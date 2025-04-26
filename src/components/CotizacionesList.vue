<template>
    
    <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
    <hr  v-show="mensaje != null" />    
    <v-text-field
      v-model="criterio"
      label="criterio de búsqueda"
    ></v-text-field> 


    <v-row>
      <v-col cols="10" sm="10" md="10">
        <v-btn-toggle v-model="mes">
          <v-btn
            v-for="(nombremes, index) in meses"
            :key="index"
            :value="index" 
            color="primary"
            density="compact"
          >
            {{ nombremes }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-btn-toggle v-model="anio">
          <v-btn
            v-for="(nombreanio) in anios"
            :key="nombreanio"
            :value="nombreanio" 
            color="primary"
            size="small"
            density="compact"
          >
            {{ nombreanio }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>


      <v-toolbar color="yellow">
      <v-toolbar-title>
        Cotizaciones  {{ getFirma?.firma }}  
      </v-toolbar-title>


      <!--v-btn icon="mdi-magnify"></v-btn-->
      <a :href="'https://cotizador.gruvial.com.ar/crear-cotizacion'" target="_blank">
        <v-btn icon="mdi-plus"></v-btn>
      </a>

    </v-toolbar>
  
        <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>

      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left">
              Pdf
            </th>
            <th class="text-left" @click="changeOrder('id')">
              ID
            </th>
            <th class="text-left" @click="changeOrder('updated_at')">
                Fecha
            </th>
            <th class="text-left" @click="changeOrder('razon_social')">
                Razon Social
            </th>
            <th class="text-left" @click="changeOrder('estado')">
                Estado
            </th>
            <th class="text-left" @click="changeOrder('estado')">
                Estado
            </th>
            <th class="text-left" @click="changeOrder('observaciones_de_estado')">
                Notas
            </th>
            <th class="text-right" @click="changeOrder('nombre_de_la_persona')">
                Nombre de la Persona
            </th>
            <th class="text-left" @click="changeOrder('localidad')">
                Localidad
            </th>
          </tr>
        </thead>
        <tbody>
          
          <tr v-if="loading" >
            <td colspan="11">
              <v-progress-circular
                    indeterminate
                    color="amber"
                  ></v-progress-circular>
            </td>
          </tr>
          <tr
            v-for="item in listaCotizaciones"
            :key="item.id"
            v-bind:class="{ 
                pagadaparcial: item.estado == 'PAGADA PARCIAL', 
                pagada: item.estado == 'PAGADA',
                nopagada: item.estado == 'NO PAGADA',
                anulada: item.estado == 'ANULADA'
                }"
            v-show="!loading"
          >
            <td>
                <a :href="'https://cotizador.gruvial.com.ar/modificar-cotizaciones/'+item.id" target="_blank">
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
            <td>{{ item.id }}</td>
            <td>{{ item.ultima_actualizacion }}</td>
            <td>{{ item.razon_social }}</td>
            <td>{{ item.estado }}</td>
            <td>
                
                <v-dialog width="700" v-if="!item.trabajo_encabezado_id || 1==1" >
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" text="Open Dialog" color="default" @click="setearCotzacion(item)"> 
                                    <v-icon icon="mdi-check-circle-outline"></v-icon>
                                    {{ item.estado || 'Generada' }}
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
                                            :on-change="traerTrabajos(item.estado_de_cotizacion_id, item.razon_social)"
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
                                        <v-switch class="pb-0" v-if="trabajosPorRazonSocial.length>0"
                                            v-model="generarServicios"
                                            color="success"
                                            label="Generar Servicios?"
                                        ></v-switch>
                                        
                                        <v-select v-if="trabajosPorRazonSocial.length>0" 
                                            v-model="trabajo_encabezado_id"
                                            :items="trabajosPorRazonSocial"
                                            item-title="detalle"
                                            item-value="id"
                                            label="Trabajo"
                                        ></v-select>  
                                        <div v-else>
                                            No se encontraron trabajos de este cliente, primero debe crear un nuevo trabajo de este cliente
                                        </div>



                                        <!--v-radio-group v-if="trabajosPorRazonSocial.length>0" v-model="trabajo_encabezado_id">
                                            <v-radio 
                                                v-for="trabajo in trabajosPorRazonSocial" 
                                                :key="trabajo.id" 
                                                :label="trabajo.cliente?.nombre_o_razon_social+' ('+trabajo.firma?.firma+') Trabajo ID:'+trabajo.id" 
                                                :value="trabajo.id"
                                            ></v-radio>
                                        </v-radio-group-->

                                        <p v-show="generarServicios">
                                            Vas a aprobar esta cotización y generaras los siguientes servicios:
                                            <ol class="ma-3">
                                                <li class="py-2"
                                                v-for="linea in item.cotizacion_lineas"
                                                :key="linea.id"
                                                >
                                                    {{ linea.maquina.nombre_de_maquina }} <br><b> ${{ linea.precio_servicio }}</b>
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

                                    <v-btn v-show="!loadingActualizarEstado"
                                    color="default"
                                    @click="isActive.value = false"
                                    >Cancelar</v-btn>
                                    
                                    <v-spacer></v-spacer>

                                    <v-btn
                                    color="green"
                                    @click="isActive.value = false; modificarEstado(item)"
                                    :disabled="item.estado_de_cotizacion_id == 3 && trabajosPorRazonSocial.length==0"
                                    >
                                    <v-icon icon="mdi-check-circle-outline" color="green"></v-icon>
                                    Guardar
                                    </v-btn>

                                    <v-progress-circular v-show="loadingActualizarEstado"
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
            <td>{{ item.localidad }}</td>
          </tr>
        </tbody>
      </v-table>

      <!--PAGINADOR-->
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="cant_paginas"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
      <!--PAGINADOR-->
      
</template>

<script setup>
  import { ref, watch, onMounted } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { orderBy } from "lodash";
  import { cambiarOrden, crearOrdenActual } from '@/utils/sortUtils';
  
  const { token, firma_id, headersAxios, getFirma } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  //console.log(token);
  const error = ref(false);
  const mensaje = ref(null)
  const mensajeError = ref('')
  const criterio = ref(null)
  const page = ref(1)
  const sortBy = ref('id')
  const orderDirection = ref('desc')
  const listaCotizaciones = ref()
  const generarServicios = ref(true)
  const trabajo_encabezado_id = ref(null)
  const trabajosPorRazonSocial = ref([])
  const loadingActualizarEstado = ref(false)
  const loading = ref(false)
  const cant_paginas = ref(1)
  const paginacion = ref(999999999)
  const meses = ref([
    "TODOS", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ])
  const mes = ref(new Date().getMonth() + 1)
  const anio = ref(new Date().getFullYear())

  const anios = ref([
  anio.value-1, anio.value, anio.value+1, 'TODOS'
  ])
  
  onMounted(() => {
    traerCotizaciones()  
  })


  //Traigo CUENTAS
  let body_razones_sociales = await axios.get(ENDPOINT_PATH_API.value + "razon-social", {headers: headersAxios.value[0]})
  let razones_sociales = ref(body_razones_sociales['data'])

  
  //Traigo CLIENTES
  let body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
  let clientes = ref(body_clientes['data'])

  
  //Traigo Firmas
  let body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas = ref(body_firmas['data'])

  
  //Traigo Estados de Cotizacion
  const body_estados_de_cotizaciones = await axios.get(ENDPOINT_PATH_API.value + "estado-de-cotizacion", {headers: headersAxios.value[0]})
  let estados_de_cotizaciones = body_estados_de_cotizaciones['data']

  //Traigo motivos de rechazo
  const body_motivos_de_rechazos_de_cotizaciones = await axios.get(ENDPOINT_PATH_API.value + "motivo-de-rechazo-de-cotizacion", {headers: headersAxios.value[0]})
  let motivos_de_rechazos_de_cotizaciones = body_motivos_de_rechazos_de_cotizaciones['data']


  /*
  const convertir = (valor) => {
    let resultado = '';
    //if (Array.isArray(valor)) {
    //  resultado = valor[1]; 
    //}

    if (valor != null) {
      resultado = valor.nombre_o_razon_social+' ('+valor.CUIT_o_CUIL+')'; 
    }
    return resultado;
  };
  */
          
    const irACotizacion = (item) => {
        let destino = null
        destino = '/trabajo/'+item.trabajo_encabezado_id
        return destino;
      }

    const traerCotizaciones = async () => {
      loading.value = true
      let jsonCliente = JSON.stringify({ 
          page: page.value,
          criterio: criterio.value,
          orderBy: sortBy.value,
          paginacion: paginacion.value,
          orderDirection: orderDirection.value,
          firma_id: firma_id.value,
          mes: mes.value,
          anio: anio.value,
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "cotizacion-listar", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaCotizaciones.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']
      loading.value = false

      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerCotizaciones()
    }

        // Crear una instancia de `ordenActual` utilizando la función de utilidades
    const ordenActual = crearOrdenActual();

    const changeOrder = (field) => {
      
      if (paginacion.value == 999999999) {
        cambiarOrden(listaCotizaciones.value, ordenActual.value, field);
      }
      else {
        /*
        if (field != sortBy.value) {
          sortBy.value = field
          orderDirection.value = 'asc'
          page.value = 1
        }
        else {
          orderDirection.value = orderDirection.value == 'asc' ? 'desc' : 'asc'
        }
        traerServicios()
        */
      console.log('no se puede ordenar')
      }
      
    } 

    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCotizaciones()
        }
    )   
    
    watch(
        () => paginacion.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCotizaciones()
        }
    )  

    watch(
        () => mes.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCotizaciones()
        }
    )  

    watch(
        () => anio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCotizaciones()
        }
    )  


    async function modificarEstado(item) {
        loadingActualizarEstado.value = true
        console.log(item.id)
        
        item.estado = obtenerEstadoPorId(item.estado_de_cotizacion_id)

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
        
        getTime()
        traerCotizaciones() 

        loadingActualizarEstado.value = false
    }


    function getTime() {
    setTimeout(() => {
        mensaje.value = null
    }, 2 * 1000);
    }
  
    // Función para obtener el estado 
    function obtenerEstadoPorId(id) {
        console.log('entro 1')
        for (var i = 0; i < estados_de_cotizaciones.length; i++) {
            if (estados_de_cotizaciones[i].id === id) {
                return estados_de_cotizaciones[i].estado;
            }
        }
        return null;
    }

    async function traerTrabajos(estado_id, razon_social) {
        trabajosPorRazonSocial.value = []
        if (estado_id == 3) {
            let jsonTrabajos = JSON.stringify({ 
                razon_social: razon_social
            })
            let body_trabajos = await axios.post(ENDPOINT_PATH_API.value + "trabajos-por-razon-social", jsonTrabajos, {headers: headersAxios.value[0]})
            trabajosPorRazonSocial.value = body_trabajos['data']
        }
    }

    function setearCotzacion(item) {
        trabajosPorRazonSocial.value = null
        trabajo_encabezado_id.value = item.trabajo_encabezado_id
    }
    
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerCotizaciones()
        }
    )  
</script>

<style scoped>
.nopagada {
  background-color: #ffbdc3;
}
.pagada {
  background-color: #c4ffbd;
}
.pagadaparcial {
  background-color: #f7c308;
}
.anulada {
  background-color: #666;
  color: white;
}
</style>