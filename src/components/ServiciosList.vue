<template>
    <v-row>

      <v-col cols="6" sm="4" md="2">
        <v-switch
            v-model="mostrar_servicios_realizados"
            label="Mostrar servicios realizados?"
            color="success"
        ></v-switch>
      </v-col>

      <!--v-col cols="6" sm="4" md="2">
          <v-select
          v-model="paginacion"
          label="Cant. por Página"
          :items="[10,20,50,100,999999999]"
        ></v-select>
      </v-col-->

      <v-col cols="6" sm="4" md="2">
        <v-select
          v-model="maquina_id"
          :items="maquinas"
          item-title="nombre_de_maquina"
          item-value="id"
          required="required"
          label="Maquina"
      ></v-select>     
      </v-col>

      <v-col cols="6" sm="4" md="2">
        <v-select
          v-model="tipo_de_trabajo_id"
          :items="tipos_de_trabajo"
          item-title="tipo_de_trabajo"
          item-value="id"
          required="required"
          label="Tipo de Trabajo"
      ></v-select>     
      </v-col>

      <v-col cols="6" sm="4" md="4">
        <v-autocomplete
        v-model="cliente_id"
        :items="clientes"
        item-title="detalle_select"
        item-value="id"
        class="lg-12"
        hide-no-data
        hide-details
        label="Cliente"
      ></v-autocomplete>
    </v-col>

    
      <v-col cols="6" sm="4" md="2">
        <a :href="ENDPOINT_PATH+'remito-de-servicio/-1' " target="_blank">
          <v-btn
                  size="small"
                  color="blue"
                  v-bind="props"
                  @click="ABMLinea('A', null)"
              >Orden de Servicio en Blanco</v-btn> 
        </a>
      </v-col>



    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-text-field
          v-model="criterio"
          label="criterio de búsqueda"
        ></v-text-field> 
      </v-col>
    </v-row>

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
      Servicios {{ getFirma?.firma }}     
      </v-toolbar-title>
      

      <!--v-btn icon="mdi-magnify"></v-btn-->

    </v-toolbar>
        
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>
      <!--pre>listaServicios.value {{ listaServicios }}</pre-->
      
      <v-table class="w-full">
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">
              Orden de Servicio
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha_inicio')">
              Fecha
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">
              ID (Nro Orden)
            </th>
            <th class="text-left pointer" @click="changeOrder('trabajo_encabezado.cliente.nombre_o_razon_social')">
              Cliente
            </th>
            <th class="text-left pointer" @click="changeOrder('trabajo_encabezado.cliente.direccion_con_barrio')">
              Dirección 
            </th>
            <th class="text-left pointer" @click="changeOrder('tipo_de_trabajo.tipo_de_trabajo')">
              Tipo de Trabajo
            </th>
            <th class="text-left pointer" @click="changeOrder('maquina.maquina')">
              Maquina
            </th>
            <th class="text-left pointer" @click="changeOrder('importe')">
              Importe 
            </th>
            <th class="text-left pointer" @click="changeOrder('observaciones')">
              Observaciones
            </th>
            <th class="text-left pointer" @click="changeOrder('trabajo_confirmado')">
              Confirmado
            </th>
            <th class="text-left pointer" @click="changeOrder('trabajo_realizado')">
              Realizado
            </th>
            <th class="text-left pointer" @click="changeOrder('importe_cobrado')">
              Importe Cobrado
            </th>
            <th class="text-left pointer" @click="changeOrder('cobros')">
              Cobros Asociados
            </th>

          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" >
            <td colspan="12">
              <v-progress-circular
                    indeterminate
                    color="amber"
                  ></v-progress-circular>
            </td>
          </tr>
          <tr
            v-for="item in listaServicios"
            :key="item.id"
            v-show="!loading && mostrarServicio(item)"
            v-bind:class="classServicio(item)"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="'/trabajo/'+item.trabajo_encabezado.id"
              ></v-btn> 
              <!--v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irAServicio(item)"
              ></v-btn--> 
              
            </td>
            <td>
                <a :href="ENDPOINT_PATH+'remito-de-servicio/'+item.id " target="_blank">
                <v-btn
                    size="small"
                    icon="mdi-file-document-edit"
                    color="blue"
                ></v-btn>
                </a>
            </td>
            <td>{{ item.fecha_inicio_f }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.trabajo_encabezado.cliente.nombre_o_razon_social }}</td>
            <td>{{ item.trabajo_encabezado.cliente.direccion_con_barrio }}</td>
            <!--td>{{ item.maquina.firma.firma }}</td-->
            <td>{{ item.tipo_de_trabajo.tipo_de_trabajo }}</td>
            <td>{{ item.maquina.maquina }}</td>
            <td>$ {{ formatoNumero(item.importe) }}</td>
            <td>{{ item.observaciones }}</td>
            <td>{{ item.trabajo_confirmado }}</td>
            <td>{{ item.trabajo_realizado }}</td>
            <td>$ {{ formatoNumero(item.importe_cobrado) }}</td>
                    <td>
                        <v-expansion-panels v-if="item.cobros.length>4">
                            <v-expansion-panel v-bind:class="classServicio(item)" >
                                <v-expansion-panel-title>Cobros asociados</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-chip
                                        size="small"
                                        v-for="cobro in item.cobros"
                                        :key="cobro"
                                        class="m-1"
                                        >
                                        Cobro id:{{ cobro.id }} {{cobro.tipo_de_cobro}} ${{ formatoNumero(cobro.importe_total_con_retenciones) }}
                                    </v-chip>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        
                        <v-chip v-else
                            size="small"
                            v-for="cobro in item.cobros"
                            :key="cobro"
                            class="m-1"
                            >
                            Cobro id:{{ cobro.id }} {{cobro.tipo_de_cobro}} ${{ formatoNumero(cobro.importe_total_con_retenciones) }}
                        </v-chip>

                    </td>
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
  const ENDPOINT_PATH = ref(import.meta.env.VITE_ENDPOINT_PATH)

  //console.log(token);
  const error = ref(false);
  const mensajeError = ref('')
  const maquina_id = ref('')
  const page = ref(1)
  const sortBy = ref('fecha_inicio')
  const orderDirection = ref('desc')
  const listaServicios = ref()
  const loading = ref(false)
  const cliente_id = ref(null)
  const cant_paginas = ref(1)
  const criterio = ref(null)
  const tipo_de_operacion = ref('TODAS')
  const tipo_de_trabajo_id = ref(null)
  const paginacion = ref(999999999)
  const mostrar_servicios_realizados = ref(true)
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
    traerServicios()  
  })

  

  //Traigo CLIENTES
  let body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
  let clientes = ref(body_clientes['data'])

  let jsonFirma = JSON.stringify({ 
          firma_id: firma_id.value,          
      });
  //Traigo RAZONES SOCIALES
  let body_maquinas = await axios.get(ENDPOINT_PATH_API.value + "maquina", {headers: headersAxios.value[0]})
  let maquinas = ref(body_maquinas['data'])

  //Traigo tipos de servicios
  const body_tipos_de_trabajo = await axios.post(ENDPOINT_PATH_API.value + "tipo-de-trabajo-por-firma", jsonFirma, {headers: headersAxios.value[0]})
  let tipos_de_trabajo = body_tipos_de_trabajo['data']

  /*
  const convertir = (valor) => {
    let resultado = '';
    //if (Array.isArray(valor)) {
    //  resultado = valor[1]; 
    //}

    if (valor != null) {
      resultado = valor.nombre_o_maquina+' ('+valor.CUIT_o_CUIL+')'; 
    }
    return resultado;
  };
  */
          


    const traerServicios = async () => {
      loading.value = true
      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          page: page.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          paginacion: paginacion.value,
          firma_id: firma_id.value,
          cliente_id: cliente_id.value,
          maquina_id: maquina_id.value,
          tipo_de_trabajo_id: tipo_de_trabajo_id.value,
          criterio: criterio.value,
          mes: mes.value,
          anio: anio.value,
          
          
          
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "servicios-listar", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaServicios.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']

      loading.value = false

      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerServicios()
    }


    // Crear una instancia de `ordenActual` utilizando la función de utilidades
    const ordenActual = crearOrdenActual();

    const changeOrder = (field) => {
      
      if (paginacion.value == 999999999) {
        cambiarOrden(listaServicios.value, ordenActual.value, field);
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
          if (newValue.length > 2) {
            page.value = 1
            traerServicios()
          }
          else {
            if (newValue.length == 0) {
              page.value = 1
              traerServicios()
            } 
          }
        }
    )   
    watch(
        () => cliente_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerServicios()
        }
    )   
    watch(
        () => tipo_de_trabajo_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerServicios()
        }
    )   
    watch(
        () => maquina_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerServicios()
        }
    )   
    
    
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerServicios()
        }
    )  

    watch(
        () => paginacion.value,
        (newValue, oldValue) => {
          page.value = 1
          traerServicios()
        }
    )  

    watch(
        () => mes.value,
        (newValue, oldValue) => {
          page.value = 1
          traerServicios()
        }
    )  

    watch(
        () => anio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerServicios()
        }
    )  

    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }

    
    function mostrarServicio(item) {
        let mostrar = true
        if (!mostrar_servicios_realizados.value) {
            if (item.trabajo_realizado == 'SI') {
                mostrar = false
            } 
        }
        return mostrar
    }
    
    function classServicio(item) {
        let clase = 'norealizado'
        if (item.trabajo_realizado == 'SI') {
          clase = 'realizado'
            
          if (item.importe_cobrado == item.importe && item.importe >0) {
              clase = 'cobrado'
          }
          else {
            clase = 'cobradodemasomenos'
          }
        }
        return clase
    }


</script>
<style scoped>

.norealizado {
  background-color: #ffbdc3;
}
.cobrado {
  background-color: #c4ffbd;
}

.cobradodemasomenos {
  background-color: #ffc400;
}



.pointer {
  cursor: pointer;
}
</style>