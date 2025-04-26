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
                    <th class="text-left">Tipo Documento</th>
                    <th class="text-left">Mostrar en Link Publico</th>
                    <th class="text-left">Fecha de Vencimiento</th>
                    <th class="text-left">Nombre del documento</th>
                    <th class="text-left">Archivos</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaDocumentos"
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
                    <td>{{ (item.tipo_de_documento_de_maquina.tipo_de_documento) }} </td>
                    <td><v-icon :icon="item.mostrar_en_link_publico == '1' ? 'mdi mdi-check-circle' : 'mdi mdi-close-circle'" :color="item.mostrar_en_link_publico == '1' ? 'success' : 'error'"></v-icon> </td>
                    <td>{{ item.fecha_de_vencimiento }}</td>
                    <td>{{ item.nombre_del_documento }}</td>
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
                    <span class="text-h5">Documento</span>
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
                        ref="formDocumentos"
                        v-model="validDocumento"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-select
                                    v-model="documento.tipo_de_documento_de_maquina.id"
                                    :items="tipos_de_documentos"
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    item-title="tipo_de_documento *"
                                    item-value="id"
                                    required="required"
                                    label="Tipo de Documento *"
                                    :rules="tipo_de_documento_de_maquinaRules"
                                    ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    v-model="documento.nombre_del_documento"
                                    counter="150"
                                    required="required"
                                    maxlength="150"
                                    label="Nombre del Documento *"
                                    :rules="nombre_del_documentoRules"
                                    ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    v-model="documento.fecha_de_vencimiento_f"
                                    :rules="fecha_de_vencimientoRules"
                                    label="Fecha de Vencimiento"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            

                            <v-col cols="12" sm="6" md="6">
                                <v-switch
                                    v-model="documento.mostrar_en_link_publico"
                                    :true-value="1"
                                    :false-value="0"
                                    label="Mostrar en Link Público?"
                                    color="success"
                                ></v-switch>
                            </v-col>

                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="documento.archivo">                                
                                <div class="text-center">
                                    <a :href="documento.archivo" target="_blank">
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
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    v-model="files"
                                    multiple 
                                    label="Cargar o reemplazar archivo (Hasta 10 archivos y no puede superar los 20MB en total)"
                                    show-size
                                    counter 
                                    chips
                                    :rules="filesRules"
                                ></v-file-input>
                                
                                <div v-else>
                                    <h6 class="pb-3">Documentos:</h6>
                                    <span v-for="n in 10" :key="n" class="m-1">
                                    <a :href="documento['archivo_'+n]" target="_blank" v-if="documento['archivo_'+n]">
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
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    label="Notas"
                                    v-model="documento.notas"
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
  let documento = ref(null)
  let documento_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMDocumentos = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  //Variables maquinas_encabezados
  const formDocumentos = ref(null) 
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

  //Traigo los Documentos del Maquina
  let body = await axios.post(ENDPOINT_PATH_API.value + "maquina-documento-listar", json, {headers: headersAxios.value[0]});
  let listaDocumentos = ref(body['data']);
          
  //Traigo tipos de documentos
  const body_tipos_de_documentos = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-documento-de-maquina", {headers: headersAxios.value[0]})
  let tipos_de_documentos = body_tipos_de_documentos['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validDocumento = ref(true);
  const razon_socialRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_vencimientoRules = [
    //v => !!v || 'Es requerido'
  ];
  
  const tipo_de_documento_de_maquinaRules = [
    v => !!v || 'Es requerido'
  ];
  const nombre_del_documentoRules = [
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
    await formDocumentos.value.validate()
    if (validDocumento.value || accionABM.value == 'B') {
        enviarFormDocumento()
    }    
  }

  //Envio el Formulario
  async function enviarFormDocumento() {

    loading.value = true

    
    var formData = new FormData();
    
    formData.append("documento_id", documento_id.value)
    formData.append("maquina_id", props.maquina_id)
    formData.append("tipo_de_documento_de_maquina_id", documento.value.tipo_de_documento_de_maquina.id)
    formData.append("mostrar_en_link_publico", documento.value.mostrar_en_link_publico)
    formData.append("fecha_de_vencimiento", documento.value.fecha_de_vencimiento_f)
    formData.append("nombre_del_documento", documento.value.nombre_del_documento)
    formData.append("recordatorio_1", documento.value.recordatorio_1_f)
    formData.append("recordatorio_2", documento.value.recordatorio_2_f)
    formData.append("recordatorio_3", documento.value.recordatorio_3_f)
    formData.append("notas", documento.value.notas)

    //formData.append("archivo_new", archivo_new.value[0]);
    files.value.forEach((value, key) => formData.append("archivo_new_"+(key+1), value));
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      maquina_id: props.maquina_id,
      tipo_de_documento_de_maquina_id: documento.value.tipo_de_documento_de_maquina.id,
      nro_de_documento: documento.value.nro_de_documento,
      fecha_de_vencimiento: documento.value.fecha_de_vencimiento_f,
      nombre_del_documento: documento.value.nombre_del_documento,
      //archivo_new: archivo_new.value
    });
    
    //Si documento_id = -1 creo la linea de maquina sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "documento-de-maquina-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "documento-de-maquina-update/"+documento_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "documento/"+documento_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "documento-de-maquina-delete/"+documento_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las documentos
    json = JSON.stringify({ 
        maquina_id: props.maquina_id
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "maquina-documento-listar", json, {headers: headersAxios.value[0]})
    listaDocumentos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        documento_id.value = -1
        documento.value = {

            maquina_id: props.maquina_id,
            tipo_de_documento_de_maquina: {
                id: null
            },
            nombre_del_documento: null,
            mostrar_en_link_publico: null,
            fecha_de_vencimiento: null,
            recordatorio_1: null,
            recordatorio_2: null,
            recordatorio_3: null,
            notas: null,

        }
        files.value = null
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMDocumentos.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        documento.value = item
        
        documento_id.value = documento.value.id        
        deshabilitarEdicionCamposABMDocumentos.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            documento.value = item
            documento_id.value = documento.value.id   
            deshabilitarEdicionCamposABMDocumentos.value = true       
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