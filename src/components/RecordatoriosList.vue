<template>
    <v-row>

      <v-col cols="6" sm="4" md="3">

        <v-autocomplete
          v-model="recordatorio_para_user_id"
          :items="users"
          item-title="detalle_select"
          item-value="id"
          dense
          :rules="requeridoRules"
          filled
          label="Recordatorio para *"
        ></v-autocomplete> 

      </v-col>


      <v-col cols="6" sm="4" md="2">
          <v-select
          v-model="paginacion"
          label="Cant. por Página"
          :items="[10,20,50,100,999999999]"
        ></v-select>
      </v-col>

      <v-col cols="6" sm="6" md="7">
        <v-autocomplete
          v-model="tipo_de_recordatorio_id"
          :items="tipos_de_recordatorios"
          item-title="tipo_de_recordatorio"
          item-value="id"
          :rules="requeridoRules"
          dense
          filled
          label="Tipo de Recordatorio *"
        ></v-autocomplete> 
      </v-col>

      </v-row>

    <v-text-field
        v-model="criterio"
        label="Buscar"
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
        Recordatorios
      </v-toolbar-title>


      <!--v-btn icon="mdi-magnify"></v-btn-->
      <v-btn icon="mdi-plus" :to="irArecordatorio('A', -1)"></v-btn>

    </v-toolbar>
  
      <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">
                ID
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha')">
                Fecha
            </th>
            <th class="text-left pointer" @click="changeOrder('detalle')">
                Detalle
            </th>
            <th class="text-left pointer" @click="changeOrder('usuario')">
                Para
            </th>
            <th class="text-left pointer" @click="changeOrder('completado')">
                Completado
            </th>
            <th class="text-right pointer" @click="changeOrder('tipo_de_recordatorio')">
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
                :to="irArecordatorio('M', item.id)"
              ></v-btn> 
              <v-btn
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                :to="irArecordatorio('B', item.id)"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.fecha_format }}</td>
            <td>{{ item.detalle }}</td>
            <td>{{ item.usuario }}</td>
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
  import { cambiarOrden, crearOrdenActual } from '@/utils/sortUtils';
  
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
  const paginacion = ref(999999999)
  const cant_paginas = ref(1)
  const meses = ref([
    "TODOS", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ])
  const mes = ref(new Date().getMonth() + 1)
  const anio = ref(new Date().getFullYear())

  const anios = ref([
  anio.value-1, anio.value, anio.value+1, 'TODOS'
  ])
  const tipo_de_recordatorio_id = ref(null)
  const recordatorio_para_user_id = ref(null)

//Traigo Tipos de Recordatorios
const body_tipos_de_recordatorios = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-recordatorio", {headers: headersAxios.value[0]})
let tipos_de_recordatorios = body_tipos_de_recordatorios['data']

//Traigo los Usuarios
let jsonRecordatorio = JSON.stringify({ 
        firma_id: 1
    });
let body_users = await axios.post(ENDPOINT_PATH_API.value + "usuarios", jsonRecordatorio, {headers: headersAxios.value[0]});
let users = body_users['data']

  
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
        return destino;
      }

    const traerRecordatorios = async () => {
      loading.value = true
      //console.log(page)
      let jsonRecordatorio = JSON.stringify({ 
          firma_id: firma_id.value,
          page: page.value,
          criterio: criterio.value,
          orderBy: sortBy.value,
          paginacion: paginacion.value,
          orderDirection: orderDirection.value,
          mes: mes.value,
          anio: anio.value,
          tipo_de_recordatorio_id: tipo_de_recordatorio_id.value,
          recordatorio_para_user_id: recordatorio_para_user_id.value,
          
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


    // Crear una instancia de `ordenActual` utilizando la función de utilidades
    const ordenActual = crearOrdenActual();

    const changeOrder = (field) => {
      
      if (paginacion.value == 999999999) {
        cambiarOrden(listaRecordatorios.value, ordenActual.value, field);
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
          traerRecordatorios()
        }
    )   

    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerRecordatorios()
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
          traerRecordatorios()
        }
    )  

    watch(
        () => anio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRecordatorios()
        }
    ) 

    watch(
        () => tipo_de_recordatorio_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRecordatorios()
        }
    )

    watch(
        () => recordatorio_para_user_id.value,
        (newValue, oldValue) => {
          page.value = 1
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

.pointer {
  cursor: pointer;
}
</style>