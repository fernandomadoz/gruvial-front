<template>

    <v-dialog
      v-model="dialog"
      persistent
    >
        <template v-slot:activator="{ props }">

            <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
            <hr  v-show="mensaje != null" />    

            <a href="https://gruvial.com.ar/cotizador/crear-cotizacion" target="_blank">
                <v-btn
                    size="small"
                    color="yellow"
                    v-bind="props"
                    >Insertar
                </v-btn> 
            </a>


            <v-table>
                <thead>
                <tr>
                    <th class="text-center">Modificar</th>
                    <th class="text-center">Pdf</th>
                    <th class="text-left">id</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Razon Social</th>
                    <th class="text-left">Estado</th>
                    <th class="text-left">Notas</th>
                    <th class="text-left">Nombre de la Persona</th>
                    <th class="text-left">Domicilio</th>
                    <th class="text-left">Celular</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Localidad</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaDocumentos"
                    :key="item.id"
                >
                    <td>
                        <a :href="item.url_modificar+item.id" target="_blank" v-if="item.url_modificar">
                            <v-btn  
                                size="small"
                                icon="mdi-pencil"
                                color="yellow"
                            ></v-btn> 
                        </a>                        
                    </td>
                    <td>                        
                        <a :href="item.url_pdf" target="_blank" v-if="item.url_pdf">
                            <v-icon
                            size="x-large"
                            icon="mdi-file-pdf-box"
                            class="m-3"
                            ></v-icon>
                        </a>
                    </td>
                    <td>{{ (item.id) }}</td>
                    <td>{{ (item.created_at) }} </td>
                    <td>{{ (item.razon_social) }} </td>
                    <td>
                        
                        <v-dialog width="700" v-if="!item.trabajo_encabezado_id || 1==1" >
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" text="Open Dialog" color="default"> 
                                    <v-icon icon="mdi-check-circle-outline"></v-icon>
                                    {{ item.estado_de_cotizacion?.estado || 'Generada' }}
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <v-card title="Modificar Estado de Cotización">
                                <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-select
                                            v-model="item.estado_de_cotizacion_id"
                                            :items="estados_de_cotizaciones"
                                            item-title="estado"
                                            item-value="id"
                                            label="Estado actual de la cotización"
                                        ></v-select>     
                                    </v-col>
                                </v-row>
                                <v-row v-show="item.estado_de_cotizacion_id == 5">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-select
                                            v-model="item.motivo_de_rechazo_de_cotizacion_id"
                                            :items="motivos_de_rechazos_de_cotizaciones"
                                            item-title="motivo"
                                            item-value="id"
                                            label="Motivo de rechazo"
                                        ></v-select>     
                                    </v-col>
                                </v-row>      
                                <v-row>
                                    <v-col cols="12" sm="12" md="12"  v-show="item.estado_de_cotizacion_id == 3">
                                        <v-switch class="pb-0"
                                            v-model="generarServicios"
                                            color="success"
                                            label="Generar Servicios?"
                                        ></v-switch>
                                        <p v-show="generarServicios">
                                            Vas a aprobar esta cotización y generaras los siguientes servicios:
                                            <ol class="ma-3">
                                                <li class="py-2"
                                                v-for="linea in item.cotizacion_lineas"
                                                :key="linea.id"
                                                >
                                                    {{ linea.maquina?.nombre_de_maquina }} <br><b> ${{ linea.precio_servicio }}</b>
                                                </li>
                                            </ol>
                                        </p>
                                        <p class="pt-0 text-red" v-show="!generarServicios">
                                            No generaras los servicios automaticamente, <br>deberas cargarlos manualmente
                                        </p>
                                    </v-col>

                                </v-row>                          
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-textarea
                                            label="Notas"
                                            counter="60000"
                                            maxlength="60000"
                                            v-model="item.observaciones_de_estado"
                                        ></v-textarea>
                                    </v-col>
                                </v-row>
                                </v-card-text>

                                <v-card-actions>

                                    <v-btn v-show="!loading"
                                    color="default"
                                    @click="isActive.value = false"
                                    >Cancelar</v-btn>
                                    
                                    <v-spacer></v-spacer>

                                    <v-btn
                                    color="green"
                                    @click="isActive.value = false; modificarEstado(item)"
                                    >
                                    <v-icon icon="mdi-check-circle-outline" color="green"></v-icon>
                                    Guardar
                                    </v-btn>

                                    <v-progress-circular v-show="loading"
                                    :width="3"
                                    color="green"
                                    indeterminate
                                    ></v-progress-circular>
                                </v-card-actions>
                                </v-card>
                            </template>
                        </v-dialog>

                    </td>
                    <td>{{ item.observaciones_de_estado }}</td>                    
                    <td>{{ item.nombre_de_la_persona }}</td>                    
                    <td>{{ item.domicilio }}</td>
                    <td>{{ item.celular }}</td>
                    <td>{{ item.email_correo }}</td>
                    <td>{{ item.localidad }}</td>
                </tr>
                </tbody>
            </v-table>
        </template>
  
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
  const loading = ref(false)
  const listaDocumentos = ref(null)
  const generarServicios = ref(true)


  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo las Cotizaciones
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-cotizaciones-listar", json, {headers: headersAxios.value[0]});
  listaDocumentos.value = body['data']
          

  //Traigo Estados de Cotizacion
  const body_estados_de_cotizaciones = await axios.get(ENDPOINT_PATH_API.value + "estado-de-cotizacion", {headers: headersAxios.value[0]})
  let estados_de_cotizaciones = body_estados_de_cotizaciones['data']

//Traigo motivos de rechazo
const body_motivos_de_rechazos_de_cotizaciones = await axios.get(ENDPOINT_PATH_API.value + "motivo-de-rechazo-de-cotizacion", {headers: headersAxios.value[0]})
let motivos_de_rechazos_de_cotizaciones = body_motivos_de_rechazos_de_cotizaciones['data']



async function modificarEstado(item) {
    loading.value = true
    console.log(item.id)
    let jsonModificar = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value,
        cotizacion_encabezado_id: item.id,
        estado_de_cotizacion_id: item.estado_de_cotizacion_id,
        motivo_de_rechazo_de_cotizacion_id: item.motivo_de_rechazo_de_cotizacion_id,
        observaciones_de_estado: item.observaciones_de_estado,
        generarServicios: generarServicios.value

    });
    let body_aprobar = await axios.post(ENDPOINT_PATH_API.value + "modificar-estado-cotizacion", jsonModificar, {headers: headersAxios.value[0]})
    mensaje.value = body_aprobar['data'].mensaje

    //Traigo las Cotizaciones
    let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-cotizaciones-listar", json, {headers: headersAxios.value[0]});
    listaDocumentos.value = body['data']
    
    getTime()

    loading.value = false
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);
    //router.push('/trabajo/'+trabajo_encabezado_id.value)+'/Servicios'
    //location.reload()
  }
  
</script>


<style scoped>

</style>