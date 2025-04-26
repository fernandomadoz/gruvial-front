<template>
    <v-row>

      <v-col cols="6" sm="4" md="3">
        <v-btn-toggle  v-model="tipo_de_operacion"  color="deep-purple-accent-3"  rounded="0"  group >  
          <v-btn value="COMPRA">Compra</v-btn> 
          <v-btn value="VENTA">Venta</v-btn> 
          <v-btn value="TODAS">Todas</v-btn> 
        </v-btn-toggle> 
      </v-col>

      <v-col cols="6" sm="4" md="2">
          <v-select
          v-model="paginacion"
          label="Cant. por Página"
          :items="[10,20,50,100,999999999]"
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
    </v-row>

    <v-text-field
        v-model="criterio"
        label="criterio de búsqueda"
    ></v-text-field> 
    
    <v-toolbar color="yellow">

      <v-toolbar-title>
        Facturas
      </v-toolbar-title>
      

      <!--v-btn icon="mdi-magnify"></v-btn-->

    </v-toolbar>
  
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>
      <!--pre>listaFacturas.value {{ listaFacturas }}</pre-->
      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">
              ID
            </th>
            <th class="text-left pointer" @click="changeOrder('tipo_de_operacion')">
              Tipo
            </th>
            <th class="text-left pointer" @click="changeOrder('operacion')">
              Trabajo/Compra
            </th>
            <th class="text-left pointer" @click="changeOrder('rs.razon_social')">
              Razón Social
            </th>
            <th class="text-left pointer" @click="changeOrder('tipo_de_factura')">
              Tipo
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha_de_factura')">
              Fecha
            </th>
            <th class="text-left pointer" @click="changeOrder('nro_de_factura')">
              Nro
            </th>
            <th class="text-right pointer" @click="changeOrder('importe_total')">
              Importe
            </th>
            <th class="text-right pointer" @click="changeOrder('importe_cobrado')">
              Importe Cobrado
            </th>
            <th class="text-left pointer" @click="changeOrder('descripcion')">
                Descripción
            </th>
            <th class="text-left pointer" @click="changeOrder('archivo')">
              Archivo
            </th>
            <th class="text-left pointer" @click="changeOrder('estado')">
              Estado
            </th>
            <th class="text-left pointer" @click="changeOrder('updated_at')">
              Ultima Actualizacion
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
            v-for="item in listaFacturas"
            :key="item.id"
            v-bind:class="{ 
                notadecredito: item.estado == 'NOTA DE CREDITO', 
                pagadademas: item.estado == 'PAGADA DE MAS', 
                pagadaparcial: item.estado == 'PAGADA PARCIAL', 
                pagada: item.estado == 'PAGADA',
                nopagada: item.estado == 'NO PAGADA',
                anulada: item.estado == 'ANULADA'
                }"
            v-show="!loading"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="irAFactura(item)"
              ></v-btn> 
              <!--v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irAFactura(item)"
              ></v-btn--> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.tipo_de_operacion }}</td>
            <td>{{ item.operacion }}</td>
            <td>{{ item.razon_social }}</td>
            <td>{{ item.tipo_de_factura }}</td>
            <td>{{ item.fecha_de_factura_f }}</td>
            <td>{{ item.nro_de_factura }}</td>
            <td class="text-right">$ {{  Number(item.importe_total).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">$ {{  Number(item.importe_cobrado).toLocaleString("es-AR", 'ARS') }}</td>
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
            <td>{{ item.estado }}</td>
            <td>{{ item.ultima_actualizacion }}</td>
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
  
  const { token, firma_id, headersAxios } = useData();
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
  const cant_paginas = ref(1)
  const criterio = ref(null)
  const tipo_de_operacion = ref('TODAS')
  const tipo_de_factura_id = ref(null)
  const paginacion = ref(50)
  
  

  
  onMounted(() => {
    traerFacturas()  
  })

  //Traigo CUENTAS
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
        destino = item.tipo_de_operacion == 'VENTA' ? '/trabajo/'+item.operacion_id : '/compra/'+item.operacion_id
        return destino;
      }

    const traerFacturas = async () => {
      loading.value = true
      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          page: page.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          firma_id: firma_id.value,
          criterio: criterio.value,
          tipo_de_operacion: tipo_de_operacion.value,
          tipo_de_factura_id: tipo_de_factura_id.value,
          paginacion: paginacion.value,
          
          
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "factura-listar", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaFacturas.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']

      loading.value = false

      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerFacturas()
    }

    const changeOrder = (field) => {
      //console.log(sortBy.value)
      if (field != sortBy.value) {
        sortBy.value = field
        orderDirection.value = 'asc'
        page.value = 1
      }
      else {
        orderDirection.value = orderDirection.value == 'asc' ? 'desc' : 'asc'
      }
      traerFacturas()
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
          if (newValue.length > 2) {
            page.value = 1
            traerFacturas()
          }
        }
    )   
    watch(
        () => tipo_de_operacion.value,
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
.pagadademas {
  background-color: #dbf708;
}
.notadecredito {
  background-color: #b9b3b3;
}
.anulada {
  background-color: #666;
  color: white;
}

.pointer {
  cursor: pointer;
}
</style>