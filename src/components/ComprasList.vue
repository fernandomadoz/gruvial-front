<template>
    
    <v-row>
      <v-col cols="6" sm="2" md="3">
        <v-switch
          v-model="ocultar_compras_cerradas"
          label="Ocultar compras cerradas"
          color="success"
        ></v-switch> 
      </v-col>

      <v-col cols="6" sm="4" md="2">
          <v-select
          v-model="paginacion"
          label="Cant. por Página"
          :items="[10,20,50,100,999999999]"
        ></v-select>
      </v-col>
    </v-row>
      
      <v-text-field
        v-model="criterio"
        label="criterio de búsqueda"
      ></v-text-field> 
      
    <v-toolbar color="yellow">

      <v-toolbar-title>
        Compras | Gastos | Inversiones {{ getFirma?.firma }}  
      </v-toolbar-title>


      <!--v-btn icon="mdi-magnify"></v-btn-->
      <v-btn icon="mdi-plus" :to="irACompra(-1)"></v-btn>

    </v-toolbar>
  
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>

      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">
              ID
            </th>
            <th class="text-left pointer" @click="changeOrder('proveedor')">
              Proveedor
            </th>
            <th class="text-left pointer" @click="changeOrder('detalle')">
              Detalle
            </th>
            <th class="text-left pointer" @click="changeOrder('plan_de_cuenta')">
              Clasificación
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha_de_compra')">
              Fecha de Compra
            </th>
            <th class="text-left pointer" @click="changeOrder('updated_at')">
              Ultima Actualizacion
            </th>
            <th class="text-right pointer" @click="changeOrder('mensual')">
              Es Mensual
            </th>
            <th class="text-right pointer" @click="changeOrder('importe')">
              Importe
            </th>
            <!--th class="text-right pointer" @click="changeOrder('facturado')">
              Facturado
            </th>
            <th class="text-right pointer" @click="changeOrder('cobrado')">
              Pagado
            </th-->
            <th class="text-right pointer" @click="changeOrder('deuda')">
              Deuda
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
            v-for="item in listaCompras"
            :key="item.id"
            v-bind:class="{ nopagado: item.deuda > 0, pagado: item.deuda == 0 && item.cobrado > 0 }"
            v-show="!loading"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="irACompra(item.id)"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.proveedor }}</td>
            <td>{{ item.detalle }}</td>
            <td>{{ item.plan_de_cuenta }}</td>
            <td>{{ item.fecha_de_compra_format }}</td>
            <td>{{ item.ultima_actualizacion }}</td>
            <td>{{ item.mensual }}</td>
            <td class="text-right">$ {{  Number(item.importe).toLocaleString("es-AR", 'ARS') }}</td>
            <!--td class="text-right">$ {{  Number(item.facturado).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">$ {{  Number(item.pagado).toLocaleString("es-AR", 'ARS') }}</td-->
            <td class="text-right">$ {{  Number(item.deuda).toLocaleString("es-AR", 'ARS') }}</td>
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
  
  const { token, firma_id, headersAxios, getFirma } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  //console.log(token);
  const error = ref(false);
  const mensajeError = ref('')
  const criterio = ref(null)
  const page = ref(1)
  const sortBy = ref('updated_at')
  const orderDirection = ref('desc')
  const listaCompras = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)
  const ocultar_compras_cerradas = ref(false)
  const paginacion = ref(50)
  
  onMounted(() => {
    traerCompras()  
  })

  //Traigo CLIENTES
  let body_proveedores = await axios.get(ENDPOINT_PATH_API.value + "proveedor", {headers: headersAxios.value[0]})
  let proveedores = ref(body_proveedores['data'])

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
          
    const irACompra = (id) => {
        return "/compra/"+id

      }

    const traerCompras = async () => {
      //console.log(page)
      loading.value = true
      let jsonCliente = JSON.stringify({ 
          firma_id: firma_id.value,
          page: page.value,
          criterio: criterio.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          ocultar_compras_cerradas: ocultar_compras_cerradas.value,
          paginacion: paginacion.value,
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "compra-encabezado-listar", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaCompras.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']
      loading.value=false


      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerCompras()
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
      traerCompras()
    } 
    
    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          if (newValue.length > 2) {
            page.value = 1
            traerCompras()
          }
        }
    )   

    watch(
        () => ocultar_compras_cerradas.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCompras()
        }
    ) 

    watch(
        () => paginacion.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCompras()
        }
    )   
    

 
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerCompras()
        }
    )  

function facturado_cobrado(facturado, cobrado) {
  var res = facturado-cobrado
  res = Number(res).toLocaleString("es-AR", 'ARS')
  return res
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