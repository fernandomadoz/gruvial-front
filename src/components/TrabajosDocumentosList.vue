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
                    <th class="text-left">Nro Documento</th>
                    <th class="text-left">Fecha de Documento</th>
                    <th class="text-left">Descripcion</th>
                    <th class="text-left">Archivo</th>
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
                    <td>{{ (item.tipo_de_documento.tipo_de_documento) }} </td>
                    <td>{{ item.nro_de_documento }}</td>                    
                    <td>{{ item.fecha_de_documento }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>
                            <a :href="item.archivo" target="_blank" v-if="item.archivo">
                                <v-btn
                                class="pl-6"
                                prepend-icon="mdi-download"
                                color="default"
                                ></v-btn>
                            </a>
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
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="documento.tipo_de_documento.id"
                                    :items="tipos_de_documentos"
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    item-title="tipo_de_documento"
                                    item-value="id"
                                    required="required"
                                    label="Tipo de Documento *"
                                    return-object
                                ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    v-model="documento.nro_de_documento"
                                    counter="15"
                                    required="required"
                                    maxlength="15"
                                    label="Nro de Documento"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    v-model="documento.fecha_de_documento_f"
                                    :rules="fecha_de_documentoRules"
                                    label="Fecha de Documento *"
                                    type="date"
                                ></v-text-field>  
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
                            <v-col cols="12" sm="6" md="4">                                
                                <v-file-input
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    v-model="archivo_new"
                                    label="Cargar o reemplazar archivo"
                                ></v-file-input>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMDocumentos"
                                    :rules="descripcionRules"
                                    label="Descripcion"
                                    counter="150"
                                    maxlength="150"
                                    v-model="documento.descripcion"
                                ></v-textarea>
                            </v-col>
                        </v-row>       


                        <v-spacer></v-spacer>
                        <v-btn
                            class="ma-2"
                            color="primary"
                            @click="validate"
                            :disabled="loading"
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

  const { token, headersAxios, headersAxiosFiles, trabajo_encabezado_id, user_id } = useData();
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
  //Variables trabajos_encabezados
  const formDocumentos = ref(null) 
  let fecha_de_documento = ref(null)
  const archivo_new = ref([])


  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo los Documentos del Trabajo
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-documento-listar", json, {headers: headersAxios.value[0]});
  let listaDocumentos = ref(body['data']);
          
  //Traigo tipos de documentos
  const body_tipos_de_documentos = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-documento", {headers: headersAxios.value[0]})
  let tipos_de_documentos = body_tipos_de_documentos['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validDocumento = ref(true);
  const razon_socialRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_documentoRules = [
    //v => !!v || 'Es requerido'
  ];
  
  const tipo_de_documentoRules = [
    v => !!v || 'Es requerido'
  ];
  const descripcionRules = [
    //v => !!v || 'Es requerido'
  ];

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

    let tipo_de_documento_id = documento.value.tipo_de_documento.id
    if (typeof(tipo_de_documento_id) == 'object') {
      tipo_de_documento_id = tipo_de_documento_id.id
    }

    
    var formData = new FormData();
    
    formData.append("documento_id", documento_id.value)
    formData.append("trabajo_encabezado_id", trabajo_encabezado_id.value)
    formData.append("tipo_de_documento_id", tipo_de_documento_id)
    formData.append("nro_de_documento", documento.value.nro_de_documento)
    formData.append("fecha_de_documento", documento.value.fecha_de_documento_f)
    formData.append("descripcion", documento.value.descripcion)

    formData.append("archivo_new", archivo_new.value[0]);
    //files.value.forEach((value, key) => formData.append("user_file_"+(key), value[0]));
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      tipo_de_documento_id: tipo_de_documento_id,
      nro_de_documento: documento.value.nro_de_documento,
      fecha_de_documento: documento.value.fecha_de_documento_f,
      descripcion: documento.value.descripcion,
      archivo_new: archivo_new.value
    });
    
    //Si documento_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "documento-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "documento-update/"+documento_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "documento/"+documento_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "documento-delete/"+documento_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las documentos
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-documento-listar", json, {headers: headersAxios.value[0]})
    listaDocumentos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        documento_id.value = -1
        documento.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            tipo_de_documento: {
                id: null
            },
            fecha_de_documento: null,
            nro_de_documento: null,
            descripcion: '',
        }
        
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