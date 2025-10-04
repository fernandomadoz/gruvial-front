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
                    <th class="text-left">Tipo Repuesto</th>
                    <th class="text-left">Nombre del repuesto</th>
                    <th class="text-left">Archivos</th>
                    <th class="text-left">Notas</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaRepuestos"
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
                    <td>{{ (item.id) }}</td>
                    <td>{{ (item.tipo_de_repuesto.tipo_de_repuesto) }} </td>
                    <td>{{ item.nombre_del_repuesto }}</td>
                    <td>
                        <span v-for="n in 5" :key="n" class="m-1">
                            <a :href="item['archivo_'+n]" target="_blank" v-if="item['archivo_'+n]">
                                <v-btn
                                class="pl-6"
                                prepend-icon="mdi-download"
                                color="default"
                                >{{ n }}</v-btn>
                            </a>
                        </span>
                    </td>
                    <td>{{ item.notas }}</td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Repuesto</span>
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
                        ref="formRepuestos"
                        v-model="validRepuesto"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="repuesto.tipo_de_repuesto.id"
                                    :items="tipos_de_repuestos"
                                    :disabled="deshabilitarEdicionCamposABMRepuestos"
                                    item-title="tipo_de_repuesto"
                                    item-value="id"
                                    required="required"
                                    label="Tipo de Repuesto *"
                                    :rules="tipo_de_repuestoRules"
                                ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMRepuestos"
                                    v-model="repuesto.nombre_del_repuesto"
                                    counter="150"
                                    required="required"
                                    maxlength="150"
                                    label="Nombre del Repuesto *"
                                    :rules="nombre_del_repuestoRules"
                                ></v-text-field>
                            </v-col>
                            
                            
                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="repuesto.archivo">                                
                                <div class="text-center">
                                    <a :href="repuesto.archivo" target="_blank">
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
                                    :disabled="deshabilitarEdicionCamposABMRepuestos"
                                    v-model="files"
                                    multiple 
                                    label="Cargar o reemplazar archivo (Hasta 5 archivos y no puede superar los 20MB en total)"
                                    show-size
                                    counter 
                                    chips
                                    :rules="filesRules"
                                ></v-file-input>
                                
                                <div v-else>
                                    <h6 class="pb-3">Fotos o archivos:</h6>
                                    <span v-for="n in 5" :key="n" class="m-1">
                                    <a :href="repuesto['archivo_'+n]" target="_blank" v-if="repuesto['archivo_'+n]">
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
                                    :disabled="deshabilitarEdicionCamposABMRepuestos"
                                    label="Notas"
                                    v-model="repuesto.notas"
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
  let repuesto = ref(null)
  let repuesto_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMRepuestos = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  //Variables maquinas_encabezados
  const formRepuestos = ref(null) 
  let fecha_de_vencimiento = ref(null)
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

  //Traigo los Repuestos del Maquina
  let body = await axios.post(ENDPOINT_PATH_API.value + "maquina-repuesto-listar", json, {headers: headersAxios.value[0]});
  let listaRepuestos = ref(body['data']);
          
  //Traigo tipos de repuestos
  const body_tipos_de_repuestos = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-repuesto", {headers: headersAxios.value[0]})
  let tipos_de_repuestos = body_tipos_de_repuestos['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validRepuesto = ref(true);
  const requeridoRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_vencimientoRules = [
    //v => !!v || 'Es requerido'
  ];
  
  const tipo_de_repuestoRules = [
    v => !!v || 'Es requerido'
  ];
  const nombre_del_repuestoRules = [
    v => !!v || 'Es requerido'
  ];

  const maxFiles = 5 // Número máximo de archivos permitidos
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
    await formRepuestos.value.validate()
    if (validRepuesto.value || accionABM.value == 'B') {
        enviarFormRepuesto()
    }    
  }

  //Envio el Formulario
  async function enviarFormRepuesto() {

    loading.value = true

    
    var formData = new FormData();
    
    formData.append("repuesto_id", repuesto_id.value)
    formData.append("maquina_id", props.maquina_id)
    formData.append("tipo_de_repuesto_id", repuesto.value.tipo_de_repuesto.id)
    formData.append("nombre_del_repuesto", repuesto.value.nombre_del_repuesto)
    formData.append("notas", repuesto.value.notas)

    //formData.append("archivo_new", archivo_new.value[0]);
    if (files.value) {
        files.value.forEach((value, key) => formData.append("archivo_new_"+(key+1), value));
    }
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      maquina_id: props.maquina_id,
      tipo_de_repuesto_id: repuesto.value.tipo_de_repuesto.id,
      nombre_del_repuesto: repuesto.value.nombre_del_repuesto,
      //archivo_new: archivo_new.value
    });
    
    //Si repuesto_id = -1 creo la linea de maquina sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "repuesto-de-maquina-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "repuesto-de-maquina-update/"+repuesto_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "repuesto/"+repuesto_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "repuesto-de-maquina-delete/"+repuesto_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las repuestos
    json = JSON.stringify({ 
        maquina_id: props.maquina_id
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "maquina-repuesto-listar", json, {headers: headersAxios.value[0]})
    listaRepuestos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        repuesto_id.value = -1
        repuesto.value = {

            maquina_id: props.maquina_id,
            tipo_de_repuesto: {
                id: null
            },
            nombre_del_repuesto: null,
            notas: null,

        }
        files.value = null
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMRepuestos.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        repuesto.value = item
        
        repuesto_id.value = repuesto.value.id        
        deshabilitarEdicionCamposABMRepuestos.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            repuesto.value = item
            repuesto_id.value = repuesto.value.id   
            deshabilitarEdicionCamposABMRepuestos.value = true       
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