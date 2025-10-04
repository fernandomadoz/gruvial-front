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
                    <th class="text-left">Responsable</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">KMS</th>
                    <th class="text-left">HS</th>
                    <th class="text-left">Notas</th>
                    <th class="text-left">Archivos</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaRegistros"
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
                    <td>{{ item.persona.nombre }} {{ item.persona.apellido }} </td>
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.kms }}</td>
                    <td>{{ item.horas }}</td>
                    <td>{{ item.notas }}</td>
                    <td>
                        <span v-for="n in 10" :key="n" class="m-1">
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
                    <span class="text-h5">Registro</span>
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
                        ref="formRegistros"
                        v-model="validRegistro"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="registro.persona.id"
                                    :items="personas"
                                    :disabled="deshabilitarEdicionCamposABMRegistros"
                                    item-title="detalle_select"
                                    item-value="id"
                                    required="required"
                                    label="Responsable *"
                                    :rules="requeridoRules"
                                    ></v-select>     
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="6" v-if="props.corresponde_registro_de_horas">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMRegistros"
                                    v-model="registro.horas"
                                    :rules="requeridoRules"
                                    label="Horas (horometro)"
                                    type="number"
                                    min="0"
                                    prefix="hs"
                                    required="required"
                                ></v-text-field> 
                            </v-col>
                            <v-col cols="12" sm="6" md="6" v-if="props.corresponde_registro_de_kms">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMRegistros"
                                    v-model="registro.kms"
                                    :rules="requeridoRules"
                                    label="Kilometros"
                                    type="number"
                                    min="0"
                                    prefix="km"
                                    required="required"
                                ></v-text-field> 
                            </v-col>
                                
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMRegistros"
                                    v-model="registro.fecha_f"
                                    :rules="fechaRules"
                                    label="Fecha de Registro *"
                                    type="date"
                                ></v-text-field>  
                            </v-col>

                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="registro.archivo">                                
                                <div class="text-center">
                                    <a :href="registro.archivo" target="_blank">
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
                                    :disabled="deshabilitarEdicionCamposABMRegistros"
                                    v-model="files"
                                    multiple 
                                    label="Cargar o reemplazar archivo (Hasta 10 archivos y no puede superar los 20MB en total)"
                                    show-size
                                    counter 
                                    chips
                                    :rules="filesRules"
                                ></v-file-input>
                                
                                <div v-else>
                                    <h6 class="pb-3">Fotos o archivos:</h6>
                                    <span v-for="n in 10" :key="n" class="m-1">
                                    <a :href="registro['archivo_'+n]" target="_blank" v-if="registro['archivo_'+n]">
                                        <v-btn
                                        class="pl-6"
                                        prepend-icon="mdi-download"
                                        color="default"
                                        >{{ n }}</v-btn>
                                    </a>
                                    </span>
                                </div>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMRegistros"
                                    label="Notas"
                                    v-model="registro.notas"
                                ></v-textarea>
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
  let registro = ref(null)
  let registro_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMRegistros = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  //Variables maquinas_encabezados
  const formRegistros = ref(null) 
  
  const files = ref([])


  const props = defineProps({
    maquina_id: {
          type: Number,
          default: null
      },
    corresponde_registro_de_horas: {
          type: Boolean,
          default: false
      },
    corresponde_registro_de_kms: {
          type: Boolean,
          default: false
      },
  })

  let json = JSON.stringify({ 
      maquina_id: props.maquina_id
  });

  //Traigo los Registros del Maquina
  let body = await axios.post(ENDPOINT_PATH_API.value + "maquina-registro-listar", json, {headers: headersAxios.value[0]});
  let listaRegistros = ref(body['data']);
          

  //Traigo personas
  const body_personas = await axios.get(ENDPOINT_PATH_API.value + "persona", {headers: headersAxios.value[0]})
  let personas = body_personas['data']


  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validRegistro = ref(true);
  const requeridoRules = [
    v => !!v || 'Es requerido'
  ];
  const fechaRules = [
    v => !!v || 'Es requerido'
  ];
  
/*
  const preventivos_de_maquinaRules = [
    v => {
        if (registro.value.tipo_de_registro.id == 1) {
            return !!v || 'Es requerido'
        }
        return true
    }
];
*/


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
    await formRegistros.value.validate()
    if (validRegistro.value || accionABM.value == 'B') {
        enviarFormRegistro()
    }    
  }

  //Envio el Formulario
  async function enviarFormRegistro() {

    loading.value = true

    
    var formData = new FormData();
    
    formData.append("registro_id", registro_id.value)
    formData.append("maquina_id", props.maquina_id)
    formData.append("persona_id", registro.value.persona.id)
    formData.append("fecha", registro.value.fecha_f)
    formData.append("notas", registro.value.notas)
    formData.append("horas", registro.value.horas)
    formData.append("kms", registro.value.kms)

    if (files.value) {
        files.value.forEach((value, key) => formData.append("archivo_new_"+(key+1), value));
    }

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      maquina_id: props.maquina_id,
      nro_de_registro: registro.value.nro_de_registro,
      fecha: registro.value.fecha_f,
      //archivo_new: archivo_new.value
    });
    
    //Si registro_id = -1 creo la linea de maquina sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "registro-de-maquina-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "registro-de-maquina-update/"+registro_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "registro/"+registro_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "registro-de-maquina-delete/"+registro_id.value, formData, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las registros
    json = JSON.stringify({ 
        maquina_id: props.maquina_id
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "maquina-registro-listar", json, {headers: headersAxios.value[0]})
    listaRegistros.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        registro_id.value = -1
        registro.value = {

            maquina_id: props.maquina_id,
            persona: {
                id: null
            },
            fecha: null,
            kms: null,
            horas: null,
            notas: null,

        }
        files.value = null
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMRegistros.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        registro.value = item

        if (!registro.value.preventivo_de_maquina_id) {
            registro.value.preventivo_de_maquina = {
                id: null
            }
        }
        
        registro_id.value = registro.value.id        
        deshabilitarEdicionCamposABMRegistros.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            registro.value = item
            registro_id.value = registro.value.id   
            deshabilitarEdicionCamposABMRegistros.value = true       
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