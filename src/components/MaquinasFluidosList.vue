<template>

    <v-dialog
      v-model="dialog"
      persistent
    >
        <template v-slot:activator="{ props }">

              <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
              <hr  v-show="mensaje != null" />    

            <v-btn
                size="small"
                color="yellow"
                v-bind="props"
                @click="ABMLinea('A', null)"
            >Insertar</v-btn> 


            <v-table>
                <thead>
                <tr>
                    <th class="text-left">Accion</th>
                    <th class="text-left">id</th>
                    <th class="text-left">Tipo Fluido</th>
                    <th class="text-left">Responsable</th>
                    <th class="text-left">Litros</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Archivos</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaFluidos"
                    :key="item.id"
                >
                    <td>
                        <v-btn
                            size="small"
                            icon="mdi-pencil"
                            color="yellow"
                            @click="ABMLinea('M', item)"
                            v-bind="props"
                        ></v-btn> 
                        <v-btn
                            size="small"
                            icon="mdi-close-circle"
                            color="yellow"
                            @click="ABMLinea('B', item)"
                            v-bind="props"
                        ></v-btn>
                    </td>
                    <td>{{ item.id }}</td>
                    <td>{{ item.tipo_de_fluido.tipo_de_fluido }} </td>
                    <td>{{ item.persona.nombre }} {{ item.persona.apellido }} </td>
                    <td>{{ item.litros }}</td>
                    <td>{{ item.fecha }}</td>
                    <td>
                        <span v-for="n in 1" :key="n" class="m-1">
                            <a :href="item['archivo_'+n]" target="_blank" v-if="item['archivo_'+n]">
                                <v-btn
                                class="pl-6"
                                prepend-icon="mdi-download"
                                color="default"
                                >{{ n }}</v-btn>
                            </a>
                        </span>
                    </td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Fluido</span>
                </v-col>
                <v-col cols="1" sm="1" md="1">
                    <v-icon
                        class="float-right"
                        icon="mdi-close-circle"
                        color="grey"
                        @click="dialog = false"
                    ></v-icon>
                </v-col>
            </v-card-title>
            <v-card-text>
                <v-container>
                    
                    <v-form
                        ref="formFluidos"
                        v-model="validFluido"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="fluido.tipo_de_fluido.id"
                                    :items="tipos_de_fluidos"
                                    :disabled="deshabilitarEdicionCamposABMFluidos"
                                    item-title="tipo_de_fluido"
                                    item-value="id"
                                    required="required"
                                    label="Tipo de Fluido *"
                                    :rules="tipo_de_fluidoRules"
                                    ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="fluido.persona.id"
                                    :items="personas"
                                    :disabled="deshabilitarEdicionCamposABMFluidos"
                                    item-title="detalle_select"
                                    item-value="id"
                                    required="required"
                                    label="Responsable *"
                                    :rules="requeridoRules"
                                    ></v-select>     
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFluidos"
                                    v-model="fluido.litros"
                                    :rules="requeridoRules"
                                    label="Litros"
                                    type="number"
                                    min="0"
                                    prefix="lts"
                                    required="required"
                                ></v-text-field> 
                            </v-col>
                                
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFluidos"
                                    v-model="fluido.fecha_f"
                                    :rules="fechaRules"
                                    label="Fecha de Carga *"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            

                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="fluido.archivo">                                
                                <div class="text-center">
                                    <a :href="fluido.archivo" target="_blank">
                                    <v-btn
                                    prepend-icon="mdi-download"
                                    color="default"
                                    >
                                    Descargar Archivo
                                    </v-btn>
                                    </a>
                                </div>
                            </v-col>

                            <!-- Arvhivo carga-->
                            <v-col cols="12" sm="12" md="12">
                                <v-file-input
                                    v-if="accionABM == 'A'"
                                    :disabled="deshabilitarEdicionCamposABMFluidos"
                                    v-model="files"
                                    multiple 
                                    label="Cargar o reemplazar archivo (Hasta 1 archivo y no puede superar los 20MB en total)"
                                    show-size
                                    counter 
                                    chips
                                    :rules="filesRules"
                                ></v-file-input>
                                
                                <div v-else>
                                    <h6 class="pb-3">Fotos o archivos:</h6>
                                    <span v-for="n in 10" :key="n" class="m-1">
                                    <a :href="fluido['archivo_'+n]" target="_blank" v-if="fluido['archivo_'+n]">
                                        <v-btn
                                        class="pl-6"
                                        prepend-icon="mdi-download"
                                        color="default"
                                        >{{ n }}</v-btn>
                                    </a>
                                    </span>
                                </div>
                            </v-col>

                        </v-row>       


                        <v-spacer></v-spacer>
                            <v-btn
                            :disabled="loading"
                            class="ma-2"
                            color="primary"
                            @click="validate"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            {{ botonABM }}  
                        </v-btn>
                        <v-btn
                            class="ma-2"
                            color="grey"
                            @click="dialog = false"
                            :disabled="loading"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            Cerrar  
                        </v-btn>
                        
                        <v-progress-circular
                        indeterminate
                        color="amber"
                        v-show="loading"
                        ></v-progress-circular>
                        
                    </v-form>

                </v-container>
                <small>*Campos obligatorios</small>
            </v-card-text>
            <v-card-actions>

            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup>
  import { ref } from "vue";
  import { reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';

  const { token, headersAxios, headersAxiosFiles, user_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  let fluido = ref(null)
  let fluido_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMFluidos = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  //Variables maquinas_encabezados
  const formFluidos = ref(null) 
  
  const files = ref([])


  const props = defineProps({
    maquina_id: {
          type: Number,
          default: null
      },
  })

  let json = JSON.stringify({ 
      maquina_id: props.maquina_id
  });

  //Traigo los Fluidos del Maquina
  let body = await axios.post(ENDPOINT_PATH_API.value + "maquina-fluido-listar", json, {headers: headersAxios.value[0]});
  let listaFluidos = ref(body['data']);
          
  //Traigo tipos de fluidos
  const body_tipos_de_fluidos = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-fluido", {headers: headersAxios.value[0]})
  let tipos_de_fluidos = body_tipos_de_fluidos['data']

  //Traigo personas
  const body_personas = await axios.get(ENDPOINT_PATH_API.value + "persona", {headers: headersAxios.value[0]})
  let personas = body_personas['data']

  

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validFluido = ref(true);
  const requeridoRules = [
    v => !!v || 'Es requerido'
  ];
  const fechaRules = [
    v => !!v || 'Es requerido'
  ];
  
  const tipo_de_fluidoRules = [
    v => !!v || 'Es requerido'
  ];
  const trabajo_realizadoRules = [
    v => !!v || 'Es requerido'
  ];

  const maxFiles = 10 // Número máximo de archivos permitidos
  const maxTotalSize = 20 * 1024 * 1024

  let filesRules = [
      value => {
          if (value) {
            if (value.length > maxFiles) {
                return 'Solo puedes subir un máximo de '+maxFiles+' archivos'
            }
            let totalSize = value.reduce((sum, file) => sum + file.size, 0)
            if (totalSize > maxTotalSize) {
                return 'El tamaño total de los archivos no puede superar 20 MB'
            }
          }
          return true
      }
  ]
  




  //Valido el Formulario
  async function validate () {
    await formFluidos.value.validate()
    if (validFluido.value || accionABM.value == 'B') {
        enviarFormFluido()
    }    
  }

  //Envio el Formulario
  async function enviarFormFluido() {

    loading.value = true

    
    var formData = new FormData();
    
    formData.append("fluido_id", fluido_id.value)
    formData.append("maquina_id", props.maquina_id)
    formData.append("tipo_de_fluido_id", fluido.value.tipo_de_fluido.id)
    formData.append("persona_id", fluido.value.persona.id)
    formData.append("fecha", fluido.value.fecha_f)
    formData.append("litros", fluido.value.litros)

    if (files.value) {
        files.value.forEach((value, key) => formData.append("archivo_new_"+(key+1), value));
    }

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      maquina_id: props.maquina_id,
      tipo_de_fluido_id: fluido.value.tipo_de_fluido.id,
      //archivo_new: archivo_new.value
    });
    
    //Si fluido_id = -1 creo la linea de maquina sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "fluido-de-maquina-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "fluido-de-maquina-update/"+fluido_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "fluido/"+fluido_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "fluido-de-maquina-delete/"+fluido_id.value, formData, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las fluidos
    json = JSON.stringify({ 
        maquina_id: props.maquina_id
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "maquina-fluido-listar", json, {headers: headersAxios.value[0]})
    listaFluidos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        fluido_id.value = -1
        fluido.value = {

            maquina_id: props.maquina_id,
            tipo_de_fluido: {
                id: null
            },
            persona: {
                id: null
            },
            finalizado: null,
            fecha: null,
            litros: null,

        }
        files.value = null
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMFluidos.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        fluido.value = item
        
        fluido_id.value = fluido.value.id        
        deshabilitarEdicionCamposABMFluidos.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            fluido.value = item
            fluido_id.value = fluido.value.id   
            deshabilitarEdicionCamposABMFluidos.value = true       
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }


</script>


<style scoped>
.checkbox_remito {
    margin-bottom: -50px;
}
</style>