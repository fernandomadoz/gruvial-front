<template>
  <v-row>

    <!--v-col cols="6" sm="4" md="2">
        <v-select
        v-model="paginacion"
        label="Cant. por Página"
        :items="[10,20,50,100,999999999]"
      ></v-select>
    </v-col-->

    <v-col cols="6" sm="4" md="2">
      <v-select
        v-model="razon_social_id"
        :items="razones_sociales"
        item-title="razon_social"
        item-value="id"
        required="required"
        label="Razon Social"
    ></v-select>     
    </v-col>

    <v-col cols="6" sm="4" md="2">
      <v-select
        v-model="tipo_de_factura_id"
        :items="tipos_de_facturas"
        item-title="tipo_de_factura"
        item-value="id"
        required="required"
        label="Tipo de Factura"
    ></v-select>     
    </v-col>

    <v-col cols="6" sm="4" md="4">
      <v-autocomplete
      v-model="proveedor_id"
      :items="proveedores"
      item-title="detalle_select"
      item-value="id"
      class="lg-12"
      hide-no-data
      hide-details
      label="Proveedor"
    ></v-autocomplete>
  </v-col>


  </v-row>

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
      Facturas Compra {{ getFirma?.firma }}     
    </v-toolbar-title>
    

    <!--v-btn icon="mdi-magnify"></v-btn-->

  </v-toolbar>

    <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>
    <!--pre>listaFacturas.value {{ listaFacturas }}</pre-->
    
    <v-table class="w-full">
      <thead>
        <tr>
          <th class="text-left">
            Accion
          </th>
          <th class="text-left pointer" @click="changeOrder('id')">
            ID
          </th>
          <th class="text-left pointer" @click="changeOrder('fecha_de_factura')">
            Fecha
          </th>
          <th class="text-left pointer" @click="changeOrder('razon_social.razon_social')">
            Rason Social
          </th>
          <th class="text-left pointer" @click="changeOrder('tipo_de_factura.tipo_de_factura')">
            Tipo de Factura
          </th>
          <th class="text-left pointer" @click="changeOrder('nro_de_factura')">
            Nro
          </th>
          <th class="text-left pointer" @click="changeOrder('descripcion')">
            Descripcion
          </th>
          <th class="text-left pointer" @click="changeOrder('archivo')">
            Archivo
          </th>
          <th class="text-left pointer" @click="changeOrder('compra_encabezado.proveedor_id')">
            Proveedor
          </th>
          <th class="text-left pointer" @click="changeOrder('importe_iva')">
            Iva
          </th>
          <th class="text-left pointer" @click="changeOrder('importe_total')">
            Importe Total
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in listaFacturas"
          :key="item.id"
          v-show="!loading"
          v-bind:class="classFactura(item)"
        >
          <td>
            <v-btn
            size="small"
              icon="mdi-pencil"
              color="yellow"
              :to="'/compra/'+item.compra_encabezado.id"
            ></v-btn> 
            <!--v-btn
            size="small"
              icon="mdi-pencil"
              color="yellow"
              @click="irAFactura(item)"
            ></v-btn--> 
            
          </td>
          <td>{{ item.id }}</td>
          <td>{{ item.fecha_de_factura_f }}</td>
          <td>{{ item.razon_social.razon_social }}</td>
          <td>{{ item.tipo_de_factura.tipo_de_factura }}</td>
          <td>{{ item.nro_de_factura }}</td>
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
          <td>{{ item.compra_encabezado?.proveedor?.nombre_o_razon_social }}</td>
          <td>$ {{ formatoNumero(item.importe_iva) }}</td>
          <td>$ {{ formatoNumero(item.importe_total) }}</td>
          <!--td>
              <v-expansion-panels v-if="item.cobros.length>4">
                  <v-expansion-panel v-bind:class="classFactura(item)" >
                      <v-expansion-panel-title>Cobros asociados</v-expansion-panel-title>
                      <v-expansion-panel-text>
                          <v-chip
                              size="small"
                              v-for="cobro in item.cobros"
                              :key="cobro"
                              class="m-1"
                              >
                              Cobro id:{{ cobro.id }} ${{ formatoNumero(cobro.importe_total_con_retenciones) }}
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
                  Cobro id:{{ cobro.id }} ${{ formatoNumero(cobro.importe_total_con_retenciones) }}
              </v-chip>

          </td-->
        </tr>
        
        <tr>
          <td class="text-subtitle-1">TOTAL: </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="text-subtitle-1">${{ formatoNumero(sum_importe_iva) }}</td>
          <td class="text-subtitle-1">${{ formatoNumero(sum_importe_total) }}</td>
          <!--td>
              <v-expansion-panels v-if="item.cobros.length>4">
                  <v-expansion-panel v-bind:class="classFactura(item)" >
                      <v-expansion-panel-title>Cobros asociados</v-expansion-panel-title>
                      <v-expansion-panel-text>
                          <v-chip
                              size="small"
                              v-for="cobro in item.cobros"
                              :key="cobro"
                              class="m-1"
                              >
                              Cobro id:{{ cobro.id }} ${{ formatoNumero(cobro.importe_total_con_retenciones) }}
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
                  Cobro id:{{ cobro.id }} ${{ formatoNumero(cobro.importe_total_con_retenciones) }}
              </v-chip>

          </td-->
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
const mensajeError = ref('')
const razon_social_id = ref('')
const page = ref(1)
const sortBy = ref('updated_at')
const orderDirection = ref('desc')
const listaFacturas = ref()
const loading = ref(false)
const proveedor_id = ref(null)
const cant_paginas = ref(1)
const sum_importe_total = ref(0)
const sum_importe_iva = ref(0)
const criterio = ref(null)
const tipo_de_operacion = ref('TODAS')
const tipo_de_factura_id = ref(null)
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
  traerFacturas()  
})


//Traigo PROVEEDORES
let body_proveedores = await axios.get(ENDPOINT_PATH_API.value + "proveedor", {headers: headersAxios.value[0]})
let proveedores = ref(body_proveedores['data'])

//Traigo RAZONES SOCIALES
let body_razones_sociales = await axios.get(ENDPOINT_PATH_API.value + "razon-social", {headers: headersAxios.value[0]})
let razones_sociales = ref(body_razones_sociales['data'])

//Traigo tipos de facturas
const body_tipos_de_facturas = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-factura", {headers: headersAxios.value[0]})
let tipos_de_facturas = body_tipos_de_facturas['data']

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
        
  const irAFactura = (item) => {
      let destino = null
      //destino = item.tipo_de_operacion == 'VENTA' ? '/trabajo/'+item.operacion_id : '/compra/'+item.operacion_id
      return destino;
    }

  const traerFacturas = async () => {
    loading.value = true
    //console.log(page)
    let jsonProveedor = JSON.stringify({ 
        page: page.value,
        orderBy: sortBy.value,
        orderDirection: orderDirection.value,
        paginacion: paginacion.value,
        firma_id: firma_id.value,
        proveedor_id: proveedor_id.value,
        razon_social_id: razon_social_id.value,
        tipo_de_factura_id: tipo_de_factura_id.value,
        criterio: criterio.value,
        mes: mes.value,
        anio: anio.value,
        
        
        
    });

    let body = await axios.post(ENDPOINT_PATH_API.value + "factura-compra-listar", jsonProveedor, {headers: headersAxios.value[0]});
    //console.log(body['data'])
    
    listaFacturas.value = body['data']['filas']
    cant_paginas.value = body['data']['cant_paginas']
    sum_importe_total.value = body['data']['sum_importe_total']
    sum_importe_iva.value = body['data']['sum_importe_iva']
    
    loading.value = false

    
  }

  const changePage = (inc) => {
    page.value = page.value + inc
    traerFacturas()
  }


  // Crear una instancia de `ordenActual` utilizando la función de utilidades
  const ordenActual = crearOrdenActual();

  const changeOrder = (field) => {
    
    if (paginacion.value == 999999999) {
      cambiarOrden(listaFacturas.value, ordenActual.value, field);
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
      traerFacturas()
      */
     console.log('no se puede ordenar')
    }
    
  } 
  
  watch(
      () => razon_social_id.value,
      (newValue, oldValue) => {
        page.value = 1
        traerFacturas()
      }
  )    

  watch(
      () => criterio.value,
      (newValue, oldValue) => {
        if (newValue.length > 2 || newValue.length == 0) {
          page.value = 1
          traerFacturas()
        }
      }
  )   
  watch(
      () => proveedor_id.value,
      (newValue, oldValue) => {
        page.value = 1
        traerFacturas()
      }
  )   
  watch(
      () => tipo_de_factura_id.value,
      (newValue, oldValue) => {
        page.value = 1
        traerFacturas()
      }
  )   
  watch(
      () => razon_social_id.value,
      (newValue, oldValue) => {
        page.value = 1
        traerFacturas()
      }
  )   
  
  
  watch(
      () => page.value,
      (newValue, oldValue) => {
        traerFacturas()
      }
  )  

  watch(
      () => paginacion.value,
      (newValue, oldValue) => {
        page.value = 1
        traerFacturas()
      }
  )  

  watch(
        () => mes.value,
        (newValue, oldValue) => {
          page.value = 1
          traerFacturas()
        }
    )  

  watch(
      () => anio.value,
      (newValue, oldValue) => {
        page.value = 1
        traerFacturas()
      }
  )  
  
  function formatoNumero(numero) {
      let decimal = {useGrouping: false }
      let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
      //return Number(numero).toLocaleString("ARS", decimal)
      return Number(numero).toLocaleString("es-AR", 'ARS')

  }

  
  
  
  function classFactura(item) {
      let clase = 'nopagado'
      if (item.factura_saldada || item.es_nota_de_credito) {
          clase = 'pagado'
      }
      return clase
  }


</script>
<style scoped>

.nopagado {
background-color: #ffbdc3;
}
.pagado {
background-color: #c4ffbd;
}


.pointer {
cursor: pointer;
}
</style>