<template>

    <v-row>


      <v-col cols="6" sm="6" md="3">
        <v-btn-toggle  v-model="prioridad_id"  color="deep-purple-accent-3"  rounded="0"  group >  
          <v-btn :value="1">CRITICA</v-btn> 
          <v-btn :value="2">MEDIA</v-btn> 
          <v-btn :value="3">BAJA</v-btn> 
          <v-btn :value="0">TODAS</v-btn> 
        </v-btn-toggle> 
      </v-col>


      <v-col cols="6" sm="4" md="2">
          <v-select
          v-model="paginacion"
          label="Cant. por Página"
          :items="[10,20,50,100,999999999]"
        ></v-select>
      </v-col>

      <v-col cols="6" sm="6" md="7">
        <v-btn-toggle  v-model="estado_de_tarea_id"  color="deep-purple-accent-3"  rounded="0"  group >  
          <v-btn :value="1">PENDIENTE </v-btn> 
          <v-btn :value="2">EN PROGRESO</v-btn> 
          <v-btn :value="3">FINALIZADA</v-btn> 
          <v-btn :value="4">CANCELADA</v-btn> 
          <v-btn :value="0">TODOS</v-btn> 
        </v-btn-toggle> 
      </v-col>

    </v-row>
    <v-row>
        <v-col cols="6" sm="6" md="6">
          <v-text-field
            v-model="criterio"
            label="criterio de búsqueda"
          ></v-text-field> 
      </v-col>

      <v-col cols="6" sm="6" md="6">
        <v-btn-toggle  v-model="tipo"  color="deep-purple-accent-3"  rounded="0"  group >  
          <v-btn value="tarea">TAREA</v-btn> 
          <v-btn value="mantenimiento">MANTENIMIENTO</v-btn> 
          <v-btn value="TODOS">TODOS</v-btn> 
        </v-btn-toggle> 
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
        Tareas  {{ getFirma?.firma }}  
      </v-toolbar-title>
      <v-autocomplete
        v-model="equipo_id"
        :items="equipos"
        item-title="equipo"
        item-value="id"
        class="lg-12"
        hide-no-data
        hide-details
        label="Equipo"
        clearable
      ></v-autocomplete>

      <v-btn icon="mdi-plus" :to="irATarea(-1, 'A')"></v-btn>
      <!--v-btn icon="mdi-magnify"></v-btn-->
      <!--v-btn icon="mdi-plus" @click="irATarea(-1)"></v-btn-->

    </v-toolbar>
  
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>

      <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">ID</th>
            <th class="text-left pointer" @click="changeOrder('tipo')">Tipo</th>
            <th class="text-left pointer" @click="changeOrder('prioridad')">Prioridad</th>
            <th class="text-left pointer" @click="changeOrder('estado_de_tarea')">Estado de tarea</th>
            <th class="text-left pointer" @click="changeOrder('fecha_programada')">Fecha programada</th>
            <th class="text-left pointer" @click="changeOrder('fecha_de_realizacion')">Fecha realizacion</th>
            <th class="text-left pointer" @click="changeOrder('nombre_de_tarea')">Nombre de tarea</th>
            <th class="text-left pointer" @click="changeOrder('equipo')">Equipo</th>
            <th class="text-left pointer" @click="changeOrder('persona')">Persona</th>
            <th class="text-left pointer" @click="changeOrder('archivo_1')">Archivos</th>
            <th class="text-left pointer" @click="changeOrder('notas')">Notas</th>
            <th class="text-left pointer" @click="changeOrder('cantidad_de_dias_para_repetir')">Cantidad dias para repetir</th>
            <th class="text-left pointer" @click="changeOrder('firma')">Firma</th>
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
            v-for="item in listaTareas"
            :key="item.id"
            v-bind:class="{ critica: (item.prioridad_id == 1), media: (item.prioridad_id == 2), baja: (item.prioridad_id == 3) }"
            v-show="!loading"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="irATarea(item, 'M')"
              ></v-btn> 
              <v-btn v-show="item.tipo=='tarea'"
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                :to="irATarea(item, 'B')"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.tipo }}</td>
            <td>{{ item.prioridad }}</td>
            <td>{{ item.estado_de_tarea }}</td>
            <td>{{ item.fecha_programada_f }}</td>
            <td>{{ item.fecha_de_realizacion_f }}</td>
            <td>{{ item.nombre_de_tarea }} {{ item.mas_info }}</td>
            <td>{{ item.equipo }}</td>
            <td>{{ item.persona }}</td>
            <td>
                <span v-for="n in 10" :key="n" class="m-1">
                    <a :href="item['archivo_'+n]" target="_blank" v-if="item['archivo_'+n]">
                        <v-btn
                        class="pl-6"
                        prepend-icon="mdi-download"
                        color="default"
                        >{{ n }}</v-btn>
                    </a>
                </span>
            </td>
            <td>{{ item.notas }}</td>
            <td>{{ item.cantidad_de_dias_para_repetir }}</td>
            <td>{{ item.firma }}</td>
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
  
  const { token, firma_id, headersAxios, setearMensajeStore, mensajeStore, getFirma } = useData();

  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  
  console.log('import.meta.env.VITE_ENDPOINT_PATH');
  console.log(import.meta.env.VITE_ENDPOINT_PATH);
  const error = ref(false);
  const mensajeError = ref('')
  const equipo_id = ref(null)
  const page = ref(1)
  const sortBy = ref('fecha_programada')
  const orderDirection = ref('asc')
  const listaTareas = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)
  const criterio = ref(null)
  const tipo = ref('TODOS')
  const prioridad_id = ref(0)
  const estado_de_tarea_id = ref(0)
  const paginacion = ref(50)
  const meses = ref([
    "TODOS", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ])
  const mes = ref(new Date().getMonth() + 1)
  const anio = ref(new Date().getFullYear())

  const anios = ref([
  anio.value-1, anio.value, anio.value+1, 'TODOS'
  ])
  anio.value = 'TODOS'
  mes.value = 0
  
  
  
  const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })

  onMounted(() => {
    traerTareas()  
    if (props.cod_mensaje) {
      let mensaje 

      if (props.cod_mensaje == 'MB') {
        mensaje = 'Tarea eliminado'
      }
      
      if (props.cod_mensaje == 'MM') {
        mensaje = 'Tarea actualizado'
      }
      
      if (props.cod_mensaje == 'MA') {
        mensaje = 'Tarea Insertado'
      }

      setearMensajeStore(mensaje)
      getTime()

    }
  })

  //Traigo EQUIPOS
  let body_equipos = await axios.get(ENDPOINT_PATH_API.value + "equipo", {headers: headersAxios.value[0]})
  let equipos = ref(body_equipos['data'])


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
          
    const irATarea = (item, accion = null) => {
      console.log(item)
      console.log(accion)
        let destino = null
        if (item == -1) {
          destino = '/tarea/A/-1'
        }
        if (accion == 'M') {
          destino = '/tarea/M/'+item.id
        }
        if (accion == 'B') {
          destino = '/tarea/B/'+item.id
        }
        if (item.origen == 'OTRO') {
          destino = '/maquina/M/'+item.id
        }
        return destino;

      }

    const traerTareas = async () => {
      loading.value=true

      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          page: page.value,
          equipo_id: equipo_id.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          firma_id: firma_id.value,
          criterio: criterio.value,
          tipo: tipo.value,
          estado_de_tarea_id: estado_de_tarea_id.value,
          prioridad_id: prioridad_id.value,
          paginacion: paginacion.value,
          mes: mes.value,
          anio: anio.value,
          


      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "tarea-listar", jsonCliente, {headers: headersAxios.value[0]});
      listaTareas.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']
      loading.value=false

      
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
      traerTareas()
    } 
    
    watch(
        () => equipo_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )   
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerTareas()
        }
    )  

    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )   
    watch(
        () => prioridad_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )   
    watch(
        () => estado_de_tarea_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )   
    watch(
        () => paginacion.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )   
    
    watch(
        () => mes.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )  

    watch(
        () => tipo.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )  

    watch(
        () => anio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTareas()
        }
    )  

    function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
    }, 2 * 1000);
  }

</script>
<style scoped>
.critica {
  background-color: #ffbdc3;
}
.media {
  background-color: #c4ffbd;
}


.pointer {
  cursor: pointer;
}
</style>