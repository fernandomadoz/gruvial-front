<template>

    <v-text-field
        v-model="criterio"
        label="criterio de búsqueda"
    ></v-text-field>   
    <v-toolbar color="yellow">

      <v-toolbar-title>
        Proveedores
      </v-toolbar-title>





      <!--v-btn icon="mdi-magnify"></v-btn-->
      <v-btn icon="mdi-plus" @click="irAproveedor('A', -1)"></v-btn>

    </v-toolbar>
  
      <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left" @click="changeOrder('nombre_o_razon_social')">
                Nombre o Razon Social
            </th>
            <th class="text-left" @click="changeOrder('cuit_o_cuil')">
                CUIT o CUIL
            </th>
            <th class="text-right" @click="changeOrder('condicion_iva')">
              Condicion IVA
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
            v-for="item in listaProveedores"
            :key="item.id"
            v-show="!loading"
          >
            <td>
              <v-btn
                size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irAproveedor('M', item.id)"
              ></v-btn> 
              <!--v-btn
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                @click="irAproveedor('B', item.id)"
              ></v-btn--> 
              
            </td>
            <td>{{ item.nombre_o_razon_social }}</td>
            <td>{{ item.cuit_o_cuil }}</td>
            <td>{{ item.condicion_iva }}</td>
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
  
  const { token, firma_id, headersAxios, setearMensajeStore, mensajeStore } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  //console.log(token);
  const error = ref(false);
  const mensajeError = ref('')
  const criterio = ref('')
  const page = ref(1)
  const sortBy = ref('nombre_o_razon_social')
  const orderDirection = ref('asc')
  const listaProveedores = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)

  
  const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })

  onMounted(() => {
    traerProveedores()  
    if (props.cod_mensaje) {
      let mensaje 

      if (props.cod_mensaje == 'MB') {
        mensaje = 'Proveedor eliminado'
      }
      
      if (props.cod_mensaje == 'MM') {
        mensaje = 'Proveedor actualizado'
      }
      
      if (props.cod_mensaje == 'MA') {
        mensaje = 'Proveedor Insertado'
      }

      setearMensajeStore(mensaje)
      getTime()

    }
  })

          
    const irAproveedor = (accion, id) => {
        let destino = '/proveedor/'+accion+'/'+id
        router.push(destino);
      }

    const traerProveedores = async () => {
      loading.value = true
      //console.log(page)
      let jsonProveedor = JSON.stringify({ 
          page: page.value,
          criterio: criterio.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "proveedor-listar", jsonProveedor, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaProveedores.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']
      loading.value = false

      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerProveedores()
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
      traerProveedores()
    } 
    
    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerProveedores()
        }
    )   
 
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerProveedores()
        }
    )  

    function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
    }, 2 * 1000);
  }

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