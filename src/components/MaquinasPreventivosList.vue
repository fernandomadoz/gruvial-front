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
                    <th class="text-left">Tipo Preventivo</th>
                    <th class="text-left">Responsable</th>
                    <th class="text-left">Finalizado</th>
                    <th class="text-left">Fecha de Parada</th>
                    <th class="text-left">Fecha de Puesta en Marcha</th>
                    <th class="text-left">Trabajo realizado</th>
                    <th class="text-left">Archivos</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaPreventivos"
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
                    <td>{{ item.tipo_de_preventivo.tipo_de_preventivo }} </td>
                    <td>{{ item.persona.nombre }} {{ item.persona.apellido }} </td>
                    <td><v-icon :icon="item.finalizado == '1' ? 'mdi mdi-check-circle' : 'mdi mdi-close-circle'" :color="item.finalizado == '1' ? 'success' : 'error'"></v-icon> </td>
                    <td>{{ item.fecha_de_parada }}</td>
                    <td>{{ item.fecha_de_puesta_en_marcha }}</td>
                    <td>{{ item.trabajo_realizado }}</td>
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
                    <span class="text-h5">Preventivo</span>
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
                        ref="formPreventivos"
                        v-model="validPreventivo"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="preventivo.tipo_de_preventivo.id"
                                    :items="tipos_de_preventivos"
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    item-title="tipo_de_preventivo"
                                    item-value="id"
                                    required="required"
                                    label="Tipo de Preventivo *"
                                    :rules="tipo_de_preventivoRules"
                                    ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="preventivo.persona.id"
                                    :items="personas"
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    item-title="detalle_select"
                                    item-value="id"
                                    required="required"
                                    label="Responsable *"
                                    :rules="requeridoRules"
                                    ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    v-model="preventivo.trabajo_realizado"
                                    counter="150"
                                    required="required"
                                    maxlength="150"
                                    label="Trabajo Realizado *"
                                    :rules="trabajo_realizadoRules"
                                    ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    v-model="preventivo.horas"
                                    :rules="requeridoRules"
                                    label="Horas (horometro)"
                                    type="number"
                                    min="0"
                                    prefix="hs"
                                    required="required"
                                ></v-text-field> 
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    v-model="preventivo.kms"
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
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    v-model="preventivo.fecha_de_parada_f"
                                    :rules="fecha_de_paradaRules"
                                    label="Fecha de Parada *"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    v-model="preventivo.fecha_de_puesta_en_marcha_f"
                                    label="Fecha de Puesta en Marcha"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            

                            <v-col cols="12" sm="6" md="6">
                                <v-switch
                                    v-model="preventivo.finalizado"
                                    :true-value="1"
                                    :false-value="0"
                                    label="Preventivo finalizado"
                                    color="success"
                                ></v-switch>
                            </v-col>

                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="preventivo.archivo">                                
                                <div class="text-center">
                                    <a :href="preventivo.archivo" target="_blank">
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
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
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
                                    <a :href="preventivo['archivo_'+n]" target="_blank" v-if="preventivo['archivo_'+n]">
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
                                    :disabled="deshabilitarEdicionCamposABMPreventivos"
                                    label="Notas"
                                    v-model="preventivo.notas"
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
  let preventivo = ref(null)
  let preventivo_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMPreventivos = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  //Variables maquinas_encabezados
  const formPreventivos = ref(null) 
  
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

  //Traigo los Preventivos del Maquina
  let body = await axios.post(ENDPOINT_PATH_API.value + "maquina-preventivo-listar", json, {headers: headersAxios.value[0]});
  let listaPreventivos = ref(body['data']);
          
  //Traigo tipos de preventivos
  const body_tipos_de_preventivos = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-preventivo", {headers: headersAxios.value[0]})
  let tipos_de_preventivos = body_tipos_de_preventivos['data']

  //Traigo personas
  const body_personas = await axios.get(ENDPOINT_PATH_API.value + "persona", {headers: headersAxios.value[0]})
  let personas = body_personas['data']

  //Traigo tipos de repuestos
  const body_tipos_de_repuestos = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-repuesto-preventivo", {headers: headersAxios.value[0]})
  let tipos_de_repuestos = body_tipos_de_repuestos['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validPreventivo = ref(true);
  const requeridoRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_paradaRules = [
    v => !!v || 'Es requerido'
  ];
  
  const tipo_de_preventivoRules = [
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
    await formPreventivos.value.validate()
    if (validPreventivo.value || accionABM.value == 'B') {
        enviarFormPreventivo()
    }    
  }

  //Envio el Formulario
  async function enviarFormPreventivo() {

    loading.value = true

    
    var formData = new FormData();
    
    formData.append("preventivo_id", preventivo_id.value)
    formData.append("maquina_id", props.maquina_id)
    formData.append("tipo_de_preventivo_id", preventivo.value.tipo_de_preventivo.id)
    formData.append("persona_id", preventivo.value.persona.id)
    formData.append("finalizado", preventivo.value.finalizado)
    formData.append("fecha_de_parada", preventivo.value.fecha_de_parada_f)
    formData.append("fecha_de_puesta_en_marcha", preventivo.value.fecha_de_puesta_en_marcha_f)
    formData.append("trabajo_realizado", preventivo.value.trabajo_realizado)
    formData.append("notas", preventivo.value.notas)
    formData.append("horas", preventivo.value.horas)
    formData.append("kms", preventivo.value.kms)

    if (files.value) {
        files.value.forEach((value, key) => formData.append("archivo_new_"+(key+1), value));
    }

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      maquina_id: props.maquina_id,
      tipo_de_preventivo_id: preventivo.value.tipo_de_preventivo.id,
      nro_de_preventivo: preventivo.value.nro_de_preventivo,
      fecha_de_parada: preventivo.value.fecha_de_parada_f,
      fecha_de_puesta_en_marcha: preventivo.value.fecha_de_puesta_en_marcha_f,
      trabajo_realizado: preventivo.value.trabajo_realizado,
      //archivo_new: archivo_new.value
    });
    
    //Si preventivo_id = -1 creo la linea de maquina sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "preventivo-de-maquina-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "preventivo-de-maquina-update/"+preventivo_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "preventivo/"+preventivo_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "preventivo-de-maquina-delete/"+preventivo_id.value, formData, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las preventivos
    json = JSON.stringify({ 
        maquina_id: props.maquina_id
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "maquina-preventivo-listar", json, {headers: headersAxios.value[0]})
    listaPreventivos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        preventivo_id.value = -1
        preventivo.value = {

            maquina_id: props.maquina_id,
            tipo_de_preventivo: {
                id: null
            },
            persona: {
                id: null
            },
            trabajo_realizado: null,
            finalizado: null,
            fecha_de_parada: null,
            fecha_de_puesta_en_marcha: null,
            kms: null,
            horas: null,
            notas: null,

        }
        files.value = null
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMPreventivos.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        preventivo.value = item
        
        preventivo_id.value = preventivo.value.id        
        deshabilitarEdicionCamposABMPreventivos.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            preventivo.value = item
            preventivo_id.value = preventivo.value.id   
            deshabilitarEdicionCamposABMPreventivos.value = true       
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