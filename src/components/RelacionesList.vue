<template>
  
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
        Relaciones
        <v-btn v-show="page>1" icon="mdi-chevron-left" @click="changePage(-1)"></v-btn>
        <v-btn  icon="mdi-chevron-right" @click="changePage(1)"></v-btn>
      </v-toolbar-title>

      <v-autocomplete
        v-model="firma_origen_id"
        :items="firmas"
        item-title="firma"
        item-value="id"
        class="lg-12"
        hide-no-data
        hide-details
        label="Firma Origen"
      ></v-autocomplete>

      <v-autocomplete
        v-model="firma_destino_id"
        :items="firmas"
        item-title="firma"
        item-value="id"
        class="lg-12"
        hide-no-data
        hide-details
        label="Firma Destino"
      ></v-autocomplete>

      <!--v-btn icon="mdi-magnify"></v-btn-->
      <v-btn icon="mdi-plus" :to="irArelacion('A', -1)"></v-btn>

    </v-toolbar>
  
      <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
      
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha')">
              Origen
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha')">
              Fecha
            </th>
            <th class="text-left pointer" @click="changeOrder('firma_origen')">
              Origen
            </th>
            <th class="text-left pointer" @click="changeOrder('firma_destino')">
              Destino
            </th>
            <th class="text-left pointer" @click="changeOrder('detalle')">
              Detalle
            </th>
            <th class="text-right pointer" @click="changeOrder('importe_total')">
              Importe
            </th>
            <th class="text-right pointer" @click="changeOrder('importe_total')">
              Importe Acumulado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in listaRelaciones"
            :key="item.id"
          >
            <td>
              <v-btn
                size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="irArelacion('M', item)"
              ></v-btn> 
              <v-btn
                v-if="item.id_padre>0"
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                :to="irArelacion('B', item)"
              ></v-btn> 
              
            </td>
            <td>{{ item.origen }}</td>
            <td>{{ item.fecha_format }}</td>
            <td>{{ item.firma_origen }}</td>
            <td>{{ item.firma_destino }}</td>
            <td>{{ item.detalle }}</td>
            <td class="text-right">$ {{  Number(item.importe_total).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">$ {{  Number(item.importe_total_acumulado).toLocaleString("es-AR", 'ARS') }}</td>
          </tr>
        </tbody>
      </v-table>
  

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
  const firma_origen_id = ref('')
  const firma_destino_id = ref('')
  const page = ref(1)
  const sortBy = ref('fecha')
  const orderDirection = ref('asc')
  const listaRelaciones = ref()

  const meses = ref([
    "TODOS", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ])
  const mes = ref(new Date().getMonth() + 1)
  const anio = ref(new Date().getFullYear())

  const anios = ref([
  anio.value-1, anio.value, anio.value+1, 'TODOS'
  ])
  
  const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })

  onMounted(() => {
    traerRelaciones()  
    if (props.cod_mensaje) {
      let mensaje 

      if (props.cod_mensaje == 'MB') {
        mensaje = 'Relación eliminada'
      }
      
      if (props.cod_mensaje == 'MM') {
        mensaje = 'Relación actualizada'
      }
      
      if (props.cod_mensaje == 'MA') {
        mensaje = 'Relación Insertada'
      }

      setearMensajeStore(mensaje)
      getTime()

    }
  })

  //Traigo Firmas
  let body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas = ref(body_firmas['data'])

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
          
    const irArelacion = (accion, item) => {
        let destino = null
        if (item == -1) {
          destino = '/relacion/A/'+item
        }
        else {
          if (item.origen == 'COBRO' || item.origen == 'PAGO DE COMPRA EN TRABAJO') {
            destino = '/trabajo/'+item.id_padre+'/Cobros'
          }
          else {
            if (item.origen == 'PAGO DE COMPRA') {
              destino = '/compra/'+item.id_padre+'/Pagos'
            }
            else {
              destino = '/relacion/'+accion+'/'+item.id_padre
            }
          }
        }
      console.log(destino)
        
        return destino;
      }

    const traerRelaciones = async () => {
      //console.log(page)
      if (firma_origen_id.value && firma_destino_id.value) {
        let jsonCliente = JSON.stringify({ 
            page: page.value,
            firma_origen_id: firma_origen_id.value,
            firma_destino_id: firma_destino_id.value,
            orderBy: sortBy.value,
            orderDirection: orderDirection.value,
            mes: mes.value,
            anio: anio.value,
            
        });

        let body = await axios.post(ENDPOINT_PATH_API.value + "relacion-listar", jsonCliente, {headers: headersAxios.value[0]});
        //console.log(body['data'])
        
        listaRelaciones.value = body['data']

      }
      
      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerRelaciones()
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
      traerRelaciones()
    } 
    
    watch(
        () => firma_origen_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRelaciones()
        }
    )   
    
    watch(
        () => firma_destino_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRelaciones()
        }
    )   


    watch(
        () => mes.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRelaciones()
        }
    )  

    watch(
        () => anio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerRelaciones()
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