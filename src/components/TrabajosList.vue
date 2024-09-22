<template>

    <v-switch
      v-model="mostrar_canceldos"
      label="Mostrar cancelados"
      color="success"
    ></v-switch>  
    <v-toolbar color="yellow">


      <v-toolbar-title>
        Trabajos
      </v-toolbar-title>

      <v-autocomplete
        v-model="cliente_id"
        :items="clientes"
        item-title="detalle_select"
        item-value="id"
        class="lg-12"
        hide-no-data
        hide-details
        label="De que cliente quieres buscar?"
      ></v-autocomplete>

      <!--v-btn icon="mdi-magnify"></v-btn-->
      <v-btn icon="mdi-plus" @click="irATrabajo(-1)"></v-btn>

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
            <th class="text-left" @click="changeOrder('cliente')">
              Cliente
            </th>
            <th class="text-left" @click="changeOrder('fecha_inicio')">
              Fecha de Inicio
            </th>
            <th class="text-left" @click="changeOrder('updated_at')">
              Ultima Actualizacion
            </th>
            <th class="text-right" @click="changeOrder('importe')">
              Importe
            </th>
            <th class="text-right" @click="changeOrder('facturado')">
              Facturado
            </th>
            <th class="text-right" @click="changeOrder('cobrado')">
              Cobrado
            </th>
            <th class="text-right" @click="changeOrder('deuda')">
              Deuda
            </th>
            <th class="text-right" @click="changeOrder('cant_trabajos_realizados_que_faltan')">
              Cant Servicios que faltan realizar
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" >
            <td colspan="10">
              <v-progress-circular
                    indeterminate
                    color="amber"
                  ></v-progress-circular>
            </td>
          </tr>
          <tr
            v-for="item in listaTrabajos"
            :key="item.id"
            v-bind:class="{ nopagado: !item.fecha_de_cancelacion && item.deuda > 0, pagado: !item.fecha_de_cancelacion && item.deuda == 0 && item.cobrado, cancelado: item.fecha_de_cancelacion, encero: item.importe == 0 && item.deuda == 0, serviciosporrealizar: item.cant_trabajos_realizados_que_faltan > 0 }"
            v-show="!loading"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irATrabajo(item.id)"
              ></v-btn> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.cliente }}</td>
            <td>{{ item.fecha_inicio_format }}</td>
            <td>{{ item.ultima_actualizacion }}</td>
            <td class="text-right">$ {{  Number(item.importe).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">$ {{  Number(item.facturado).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">$ {{  Number(item.cobrado).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">$ {{  Number(item.deuda).toLocaleString("es-AR", 'ARS') }}</td>
            <td class="text-right">{{ item.cant_trabajos_realizados_que_faltan }}</td>
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
  const cliente_id = ref('')
  const page = ref(1)
  const sortBy = ref('t.updated_at')
  const orderDirection = ref('desc')
  const listaTrabajos = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)
  const mostrar_canceldos = ref(false)
  
  
  onMounted(() => {
    traerTrabajos()  
  })

  //Traigo CLIENTES
  let body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
  let clientes = ref(body_clientes['data'])

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
          
    const irATrabajo = (id) => {
        router.push("/trabajo/"+id);

      }

    const traerTrabajos = async () => {
      loading.value=true
      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          firma_id: firma_id.value,
          page: page.value,
          cliente_id: cliente_id.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          mostrar_canceldos: mostrar_canceldos.value
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-encabezado-listar", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaTrabajos.value = body['data']['filas']
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
      traerTrabajos()
    } 
    
    watch(
        () => cliente_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTrabajos()
        }
    )   

    watch(
        () => mostrar_canceldos.value,
        (newValue, oldValue) => {
          page.value = 1
          traerTrabajos()
        }
    )   

    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerTrabajos()
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
.encero {
  background-color: #ffffff;
}

.serviciosporrealizar {
  background-color: #fad531;
}

.cancelado {
  background-color: #666;
  color: white;
}
</style>