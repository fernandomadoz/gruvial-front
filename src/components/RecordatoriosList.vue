<template>

    <v-text-field
        v-model="criterio"
        label="Buscar"
    ></v-text-field>   
    <v-toolbar color="yellow">

      <v-toolbar-title>
        Recordatorios
      </v-toolbar-title>


      <!--v-btn icon="mdi-magnify"></v-btn-->
      <v-btn icon="mdi-plus" @click="irArecordatorio('A', -1)"></v-btn>

    </v-toolbar>
  
      <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left" @click="changeOrder('id')">
                ID
            </th>
            <th class="text-left" @click="changeOrder('fecha')">
                Fecha
            </th>
            <th class="text-left" @click="changeOrder('detalle')">
                Detalle
            </th>
            <th class="text-left" @click="changeOrder('completado')">
                Completado
            </th>
            <th class="text-right" @click="changeOrder('tipo_de_recordatorio')">
              Tipo de Recordatorio
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" >
            <td colspan="5">
              <v-progress-circular
                    indeterminate
                    color="amber"
                  ></v-progress-circular>
            </td>
          </tr>
          <tr
            v-for="item in listaRecordatorios"
            :key="item.id"
            v-show="!loading"
          >
            <td>
              <v-btn
                size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irArecordatorio('M', item.id)"
              ></v-btn> 
              <v-btn
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                @click="irArecordatorio('B', item.id)"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.fecha_format }}</td>
            <td>{{ item.detalle }}</td>
            <td>{{ item.completado }}</td>
            <td>{{ item.tipo_de_recordatorio }}</td>
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
  const sortBy = ref('r.fecha')
  const orderDirection = ref('asc')
  const listaRecordatorios = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)

  
  const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })

  onMounted(() => {
    traerRecordatorios()  
    if (props.cod_mensaje) {
      let mensaje 

      if (props.cod_mensaje == 'MB') {
        mensaje = 'Recordatorio eliminado'
      }
      
      if (props.cod_mensaje == 'MM') {
        mensaje = 'Recordatorio actualizado'
      }
      
      if (props.cod_mensaje == 'MA') {
        mensaje = 'Recordatorio Insertado'
      }

      setearMensajeStore(mensaje)
      getTime()

    }
  })

          
    const irArecordatorio = (accion, id) => {
        let destino = '/recordatorio/'+accion+'/'+id
        router.push(destino);
      }

    const traerRecordatorios = async () => {
      loading.value = true
      //console.log(page)
      let jsonRecordatorio = JSON.stringify({ 
          firma_id: firma_id.value,
          page: page.value,
          criterio: criterio.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "recordatorio-listar", jsonRecordatorio, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaRecordatorios.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']

      loading.value = false

      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerRecordatorios()
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
      traerRecordatorios()
    } 
    
    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRecordatorios()
        }
    )   

    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerRecordatorios()
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