<template>
  
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

      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left" @click="changeOrder('id')">
              ID
            </th>
            <th class="text-left" @click="changeOrder('trabajo')">
              Trabajo
            </th>
            <th class="text-left" @click="changeOrder('razon_social')">
              Razón Social
            </th>
            <th class="text-left" @click="changeOrder('tipo_de_factura')">
              Tipo
            </th>
            <th class="text-left" @click="changeOrder('fecha_de_factura')">
              Fecha
            </th>
            <th class="text-left" @click="changeOrder('nro_de_factura')">
              Nro
            </th>
            <th class="text-right" @click="changeOrder('importe_total')">
              Importe
            </th>
            <th class="text-left" @click="changeOrder('descripcion')">
                Descripción
            </th>
            <th class="text-left" @click="changeOrder('archivo')">
              Archivo
            </th>
            <th class="text-left" @click="changeOrder('estado')">
              Estado
            </th>
            <th class="text-left" @click="changeOrder('updated_at')">
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
                @click="irAFactura(item)"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.trabajo }}</td>
            <td>{{ item.razon_social }}</td>
            <td>{{ item.tipo_de_factura }}</td>
            <td>{{ item.fecha_de_factura_f }}</td>
            <td>{{ item.nro_de_factura }}</td>
            <td class="text-right">$ {{  Number(item.importe_total).toLocaleString("es-AR", 'ARS') }}</td>
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

  
  onMounted(() => {
    traerFacturas()  
  })

  //Traigo CUENTAS
  let body_razones_sociales = await axios.get(ENDPOINT_PATH_API.value + "razon-social", {headers: headersAxios.value[0]})
  let razones_sociales = ref(body_razones_sociales['data'])

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
        destino = '/trabajo/'+item.trabajo_encabezado_id
        router.push(destino);
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
        () => page.value,
        (newValue, oldValue) => {
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
.anulada {
  background-color: #666;
  color: white;
}
</style>