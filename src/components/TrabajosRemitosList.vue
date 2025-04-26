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
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Nro Remito</th>
                    <th class="text-left">Archivo</th>
                    <th class="text-left">observaciones</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaRemitos"
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
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.nro_de_remito }}</td>
                    <td>
                            <a :href="item.archivo" target="_blank" v-if="item.archivo">
                                <v-btn
                                class="pl-6"
                                prepend-icon="mdi-download"
                                color="default"
                                ></v-btn>
                            </a>
                    </td>
                    <td>{{ item.observaciones }}</td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Registro de Remito</span>
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
                        ref="formServicios"
                        v-model="validServicio"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="remito.fecha_f"
                                    :rules="fechaRules"
                                    label="Fecha"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="remito.nro_de_remito"
                                    :rules="nro_de_remitoRules"
                                    counter="15"
                                    maxlength="15"
                                    label="Nro de Remito"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="remito.persona_que_autoriza"
                                    counter="80"
                                    maxlength="80"
                                    label="Persona que autoriza"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="remito.persona_que_supervisa"
                                    counter="80"
                                    maxlength="80"
                                    label="Persona que supervisa"
                                ></v-text-field>  
                            </v-col>

                            
                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="remito.archivo">                                
                                <div class="text-center">
                                    <a :href="remito.archivo" target="_blank">
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
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="archivo_new"
                                    label="Cargar o reemplazar archivo"
                                ></v-file-input>
                            </v-col>


                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    label="Observaciones"
                                    counter="250"
                                    maxlength="250"
                                    v-model="remito.observaciones"
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
                <small>*indicates required field</small>
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
  let remito = ref(null)
  let remito_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMEncabezado = ref(false)
  let accionABM = ref(null)
  let sufijo_cant = ref('')
  const archivo_new = ref([])

  //Variables trabajos_encabezados
  const formServicios = ref(null) 
  let fecha = ref(null)


  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo las lineas de trabajo
  let body = await axios.post(ENDPOINT_PATH_API.value + "remito-listar", json, {headers: headersAxios.value[0]});
  let listaRemitos = ref(body['data']);

  const props = defineProps({

    remito2: {
        default: {
            id: 1,
            maquina_id: 1,
            lugar_de_trabajo: 'parque industrial',
            fecha_inicio: '2022-07-08',
            fecha_fin: '2022-07-08'

        }
    },
    valorSeleccionado: {
        default: null
    } 

  });
          
  //Rules de los Campos
  let validServicio = ref(true);
  const fechaRules = [
    v => !!v || 'Es requerido'
  ];
  const nro_de_remitoRules = [
    v => !!v || 'Es requerido'
  ];

  //Valido el Formulario
  async function validate () {
    await formServicios.value.validate()
    if (validServicio.value || accionABM.value == 'B') {
        enviarFormServicio()
    }    
  }

  //Envio el Formulario
  async function enviarFormServicio() {

    loading.value = true
    var formData = new FormData();
    
    formData.append("remito_id", remito_id.value)
    formData.append("trabajo_encabezado_id", trabajo_encabezado_id.value)
    formData.append("fecha", remito.value.fecha_f)
    formData.append("nro_de_remito", remito.value.nro_de_remito)
    formData.append("persona_que_autoriza", remito.value.persona_que_autoriza)
    formData.append("persona_que_supervisa", remito.value.persona_que_supervisa)
    formData.append("observaciones", remito.value.observaciones)
    formData.append("user_id", user_id.value)
    formData.append("archivo_new", archivo_new.value[0]);
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      fecha: remito.value.fecha_f,
      nro_de_remito: remito.value.nro_de_remito,
      persona_que_autoriza: remito.value.persona_que_autoriza,
      persona_que_supervisa: remito.value.persona_que_supervisa,
      observaciones: remito.value.observaciones,
      user_id: user_id.value
    });
    
    let resultadoGuardar = null

    //Si remito_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "remito-create", formData, {headers: headersAxiosFiles.value[0]})
    }
    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "remito-update/"+remito_id.value, formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "remito/"+remito_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "remito-delete/"+remito_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las lineas de trabajo
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "remito-listar", json, {headers: headersAxios.value[0]})
    listaRemitos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, linea) {
    accionABM.value = accion
    if (accion == 'A') {
        remito_id.value = -1
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString().split('T')[0];

        remito.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            fecha_f: fechaFormateada,
            nro_de_remito: null,
            persona_que_autoriza: null,
            persona_que_supervisa: null,
            observaciones: null,
            user_id: user_id.value
        }

        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMEncabezado.value = false    
        

    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        remito.value = linea
        remito_id.value = remito.value.id        
        deshabilitarEdicionCamposABMEncabezado.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            remito.value = linea
            remito_id.value = remito.value.id   
            deshabilitarEdicionCamposABMEncabezado.value = true       
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }
  
</script>

