<template>

    <v-text-field
        v-model="criterio"
        label="criterio de búsqueda"
      ></v-text-field> 
    
    <v-toolbar color="yellow">

      
      <v-toolbar-title>
        Cheques
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
            <th class="text-left" @click="changeOrder('id')">
              ID
            </th>
            <th class="text-left" @click="changeOrder('origen')">
              Origen
            </th>
            <th class="text-left" @click="changeOrder('numero_de_cheque')">
              Nro Cheque
            </th>
            <th class="text-left" @click="changeOrder('cuenta_emisora')">
              Cuenta Emisora
            </th>
            <th class="text-left" @click="changeOrder('cliente_o_proveedor')">
              Cliente o Proveedor
            </th>
            <!--th class="text-left" @click="changeOrder('fecha_de_emision_f')">
              Emisión
            </th-->
            <th class="text-left" @click="changeOrder('fecha_inicio_de_cobro_f')">
              Fecha Inicio
            </th>
            <th class="text-left" @click="changeOrder('fecha_de_vencimiento_f')">
              Vencimiento
            </th>
            <th class="text-left" @click="changeOrder('fecha_de_cobro_f')">
              Cobrado/Pagado
            </th>
            <th class="text-right" @click="changeOrder('importe')">
              Importe
            </th>
            <th class="text-left" @click="changeOrder('observaciones')">
              Observaciones
            </th>
            <th class="text-left" @click="changeOrder('causa_de_baja')">
              Baja
            </th>
            <th class="text-left" @click="changeOrder('estado')">
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
            v-bind:class="{ nopagado: item.estado != 'COBRADO', pagado: item.estado == 'COBRADO' || item.estado == 'PAGADO' }"
            v-show="!loading"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irACheque(item)"
              ></v-btn> 
              <v-btn v-show="item.origen=='OTRO'"
                size="small"
                icon="mdi-close-circle"
                color="yellow"
                @click="irACheque(item.id, 'B')"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.origen }}</td>
            <td>{{ item.numero_de_cheque }}</td>
            <td>{{ item.cuenta_emisora }}</td>
            <td>{{ item.cliente_o_proveedor }}</td>
            <!--td>{{ item.fecha_de_emision }}</td-->
            <td>{{ item.fecha_inicio_de_cobro }}</td>
            <td>{{ item.fecha_de_vencimiento }}</td>
            <td>{{ item.fecha_de_cobro }}</td>
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
  
  const { token, firma_id, headersAxios, setearMensajeStore, mensajeStore } = useData();

  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  
  console.log('import.meta.env.VITE_ENDPOINT_PATH');
  console.log(import.meta.env.VITE_ENDPOINT_PATH);
  const error = ref(false);
  const mensajeError = ref('')
  const cuenta_id = ref('')
  const page = ref(1)
  const sortBy = ref('fecha_de_vencimiento')
  const orderDirection = ref('desc')
  const listaCheques = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)
  const criterio = ref(null)
  

  
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
          if (item.trabajo_encabezado_id > 0) {
            destino = '/trabajo/'+item.trabajo_encabezado_id
          }
          if (item.compra_encabezado_id > 0) {
            destino = '/compra/'+item.compra_encabezado_id
          }
        }
        router.push(destino);

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
</style>