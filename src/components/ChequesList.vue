<template>

    <v-row>

      <v-col cols="6" sm="4" md="3">
        <v-btn-toggle  v-model="origen_del_cheque"  color="deep-purple-accent-3"  rounded="0"  group >  
          <v-btn value="COMPRA">COMPRA</v-btn> 
          <v-btn value="VENTA">COBRO</v-btn> 
          <v-btn value="OTRO">OTRO</v-btn> 
          <v-btn value="TODOS">TODOS</v-btn> 
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
        <v-btn-toggle  v-model="estado_del_cheque"  color="deep-purple-accent-3"  rounded="0"  group >  
          <v-btn value="COBRADO">COBRADO</v-btn> 
          <v-btn value="PAGADO">PAGADO</v-btn> 
          <v-btn value="POR COBRAR">POR COBRAR</v-btn> 
          <v-btn value="POR PAGAR">POR PAGAR</v-btn> 
          <v-btn value="ENTREGADO">ENTREGADO</v-btn> 
          <v-btn value="TODOS">TODOS</v-btn> 
        </v-btn-toggle> 
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
        Cheques  {{ getFirma?.firma }}  
      </v-toolbar-title>
      <v-autocomplete
        v-model="cuenta_id"
        :items="cuentas"
        item-title="detalle_select"
        item-value="id"
        class="lg-12"
        hide-no-data
        hide-details
        label="De que cuenta queres buscar?"
      ></v-autocomplete>

      <!--v-btn icon="mdi-magnify"></v-btn-->
      <!--v-btn icon="mdi-plus" @click="irACheque(-1)"></v-btn-->

    </v-toolbar>
  
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>

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
            <th class="text-left pointer" @click="changeOrder('origen')">
              Fecha
            </th>
            <th class="text-left pointer" @click="changeOrder('origen')">
              Origen
            </th>
            <th class="text-left pointer" @click="changeOrder('numero_de_cheque')">
              Nro Cheque
            </th>
            <th class="text-left pointer" @click="changeOrder('cuenta_emisora')">
              Cuenta Emisora
            </th>
            <th class="text-left pointer" @click="changeOrder('cliente_o_proveedor')">
              Cliente o Proveedor
            </th>
            <!--th class="text-left pointer" @click="changeOrder('fecha_de_emision_f')">
              Emisión
            </th-->
            <th class="text-left pointer" @click="changeOrder('fecha_inicio_de_cobro')">
              Fecha Inicio Cobro/Pago
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha_de_vencimiento')">
              Vencimiento
            </th>
            <th class="text-left pointer" @click="changeOrder('fecha_de_cobro')">
              Cobrado/Pagado
            </th>
            <th class="text-right pointer" @click="changeOrder('importe')">
              Importe
            </th>
            <th class="text-left pointer" @click="changeOrder('observaciones')">
              Observaciones
            </th>
            <th class="text-left pointer" @click="changeOrder('causa_de_baja')">
              Baja
            </th>
            <th class="text-left pointer" @click="changeOrder('estado')">
              Estado
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
            v-for="item in listaCheques"
            :key="item.id"
            v-bind:class="{ nopagado: (item.estado != 'POR PAGAR' || item.estado != 'POR COBRAR'), pagado: (item.estado == 'COBRADO' || item.estado == 'PAGADO' || item.estado.includes('ENTREGADO')) }"
            v-show="!loading"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="irACheque(item)"
              ></v-btn> 
              <v-btn v-show="item.origen=='OTRO'"
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                :to="irACheque(item.id, 'B')"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.fecha_cheque_f }}</td>
            <td>{{ item.origen }}</td>
            <td>{{ item.numero_de_cheque }}</td>
            <td>{{ item.cuenta_emisora }}</td>
            <td>{{ item.cliente_o_proveedor }}</td>
            <!--td>{{ item.fecha_de_emision }}</td-->
            <td>{{ item.fecha_inicio_de_cobro_f }}</td>
            <td>{{ item.fecha_de_vencimiento_f }}</td>
            <td>{{ item.fecha_de_cobro_f }}</td>
            <td class="text-right">$ {{  Number(item.importe).toLocaleString("es-AR", 'ARS') }}</td>
            <td>{{ item.observaciones }}</td>
            <td>{{ item.causa_de_baja_de_cheque }}</td>
            <td>{{ item.estado }}</td>
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
  const cuenta_id = ref('')
  const page = ref(1)
  const sortBy = ref('fecha_cheque')
  const orderDirection = ref('asc')
  const listaCheques = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)
  const criterio = ref(null)
  const origen_del_cheque = ref('TODOS')
  const estado_del_cheque = ref('TODOS')
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
  
  
  
  const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })

  onMounted(() => {
    traerCheques()  
    if (props.cod_mensaje) {
      let mensaje 

      if (props.cod_mensaje == 'MB') {
        mensaje = 'Cheque eliminado'
      }
      
      if (props.cod_mensaje == 'MM') {
        mensaje = 'Cheque actualizado'
      }
      
      if (props.cod_mensaje == 'MA') {
        mensaje = 'Cheque Insertado'
      }

      setearMensajeStore(mensaje)
      getTime()

    }
  })

  //Traigo CUENTAS
  let body_cuentas = await axios.get(ENDPOINT_PATH_API.value + "cuenta", {headers: headersAxios.value[0]})
  let cuentas = ref(body_cuentas['data'])


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
          
    const irACheque = (item, accion = null) => {
      console.log(item)
      console.log(accion)
        let destino = null
        if (item == -1) {
          destino = '/cheque/A/-1'
        }
        if (accion == 'B') {
          destino = '/cheque/B/'+item
        }
        if (item.origen == 'OTRO') {
          destino = '/cheque/M/'+item.id
        }
        else {
          
          if (item.compra_encabezado_id > 0) {
            destino = '/compra/'+item.compra_encabezado_id
          }
          if (item.trabajo_encabezado_id > 0) {
            destino = '/trabajo/'+item.trabajo_encabezado_id
          }
        }
        return destino;

      }

    const traerCheques = async () => {
      loading.value=true

      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          page: page.value,
          cuenta_emisora_id: cuenta_id.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          firma_id: firma_id.value,
          criterio: criterio.value,
          estado_del_cheque: estado_del_cheque.value,
          origen_del_cheque: origen_del_cheque.value,
          paginacion: paginacion.value,
          mes: mes.value,
          anio: anio.value,
          


      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "cheque-listar", jsonCliente, {headers: headersAxios.value[0]});
      listaCheques.value = body['data']['filas']
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
      traerCheques()
    } 
    
    watch(
        () => cuenta_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )   
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerCheques()
        }
    )  

    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )   
    watch(
        () => origen_del_cheque.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )   
    watch(
        () => estado_del_cheque.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )   
    watch(
        () => paginacion.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )   
    
    watch(
        () => mes.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )  

    watch(
        () => anio.value,
        (newValue, oldValue) => {
          page.value = 1
          traerCheques()
        }
    )  

    function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
    }, 2 * 1000);
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