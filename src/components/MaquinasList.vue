<template>
    <v-row>


      <v-col cols="6" sm="4" md="4">
        <v-btn-toggle v-model="estado_de_maquina">
          <v-btn value="activas" color="primary" size="small" density="compact">ACTIVAS</v-btn>
          <v-btn value="inactivas" color="primary" size="small" density="compact">INACTIVAS</v-btn>
          <v-btn value="todas" color="primary" size="small" density="compact">TODAS</v-btn>
        </v-btn-toggle>
      </v-col>
      
      <v-col cols="6" sm="4" md="2">
        <v-select
          v-model="tipo_de_maquina_id"
          :items="tipos_de_maquinas"
          item-title="tipo_de_maquina"
          item-value="id"
          required="required"
          label="Tipo de Maquina"
          clearable
      ></v-select>     
      </v-col>


    </v-row>

    <v-text-field
        v-model="criterio"
        label="criterio de búsqueda"
    ></v-text-field> 
    


    
    
    
    <v-toolbar color="yellow">

    
      <v-toolbar-title>
      Maquinas {{ getFirma?.firma }}     
      </v-toolbar-title>
      
      <v-btn icon="mdi-plus" :to="'/maquina/-1'"></v-btn>

      <!--v-btn icon="mdi-magnify"></v-btn-->

    </v-toolbar>
  
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>
      <!--pre>listaMaquinas.value {{ listaMaquinas }}</pre-->
      
      <v-table class="w-full">
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left pointer" @click="changeOrder('id')">
              ID
            </th>
            <th class="text-left pointer" @click="changeOrder('codigo')">
              Codigo
            </th>
            <th class="text-left pointer" @click="changeOrder('nombre_de_maquina')">
              Nombre
            </th>
            <th class="text-left pointer" @click="changeOrder('tipo_de_maquina.tipo_de_maquina')">
              Tipo de Maquina
            </th>
            <th class="text-left pointer" @click="changeOrder('descripcion')">
              Imagen
            </th>
            <th class="text-left pointer" @click="changeOrder('firma.firma')">
              Firma
            </th>
            <th class="text-left pointer" @click="changeOrder('sino_activa')">
              Activa
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
            v-for="item in listaMaquinas"
            :key="item.id"
            v-show="!loading && mostrarMaquina(item)"
            v-bind:class="classMaquina(item)"
          >
            <td>
              <v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                :to="'/maquina/'+item.id"
              ></v-btn> 
              <!--v-btn
              size="small"
                icon="mdi-pencil"
                color="yellow"
                @click="irAMaquina(item)"
              ></v-btn--> 
              
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.codigo }}</td>
            <td>{{ item.nombre_de_maquina }}</td>
            <td>{{ item.tipo_de_maquina.tipo_de_maquina }}</td>
            <td>{{ item.img_imagen }}</td>
            <td>{{ item.firma.firma }}</td>
            <td><v-icon :icon="item.sino_activa == '1' ? 'mdi mdi-check-circle' : 'mdi mdi-close-circle'" :color="item.sino_activa == '1' ? 'success' : 'error'"></v-icon> </td>
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

  const { token, firma_id, headersAxios, getFirma } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  //console.log(token);
  const error = ref(false);
  const mensajeError = ref('')
  const razon_social_id = ref('')
  const page = ref(1)
  const sortBy = ref('fecha_de_maquina')
  const orderDirection = ref('desc')
  const listaMaquinas = ref()
  const loading = ref(false)
  const cant_paginas = ref(1)
  const criterio = ref(null)
  const tipo_de_maquina_id = ref(null)
  const paginacion = ref(999999999)
  const estado_de_maquina = ref('activas')
  
  
  onMounted(() => {
    traerMaquinas()  
  })

  //Traigo tipos de maquinas
  const body_tipos_de_maquinas = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-maquina", {headers: headersAxios.value[0]})
  let tipos_de_maquinas = body_tipos_de_maquinas['data']

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
          


    const traerMaquinas = async () => {
      loading.value = true
      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          page: page.value,
          orderBy: sortBy.value,
          orderDirection: orderDirection.value,
          paginacion: paginacion.value,
          firma_id: firma_id.value,
          tipo_de_maquina_id: tipo_de_maquina_id.value,
          criterio: criterio.value,
          
          
          
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "maquina-listar", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      listaMaquinas.value = body['data']['filas']
      cant_paginas.value = body['data']['cant_paginas']

      loading.value = false

      
    }

    const changePage = (inc) => {
      page.value = page.value + inc
      traerMaquinas()
    }


    // Crear una instancia de `ordenActual` utilizando la función de utilidades
    const ordenActual = crearOrdenActual();

    const changeOrder = (field) => {
      
      if (paginacion.value == 999999999) {
        cambiarOrden(listaMaquinas.value, ordenActual.value, field);
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
        traerMaquinas()
        */
      console.log('no se puede ordenar')
      }
      
    } 
    
    watch(
        () => razon_social_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerMaquinas()
        }
    )    

    watch(
        () => criterio.value,
        (newValue, oldValue) => {
          if (newValue.length > 2) {
            page.value = 1
            traerMaquinas()
          }
        }
    )   

    watch(
        () => tipo_de_maquina_id.value,
        (newValue, oldValue) => {
          page.value = 1
          traerMaquinas()
        }
    )   
    
    
    watch(
        () => page.value,
        (newValue, oldValue) => {
          traerMaquinas()
        }
    )  

    watch(
        () => paginacion.value,
        (newValue, oldValue) => {
          page.value = 1
          traerMaquinas()
        }
    )  


    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }

    
    function mostrarMaquina(item) {
        let mostrar = false
        if (estado_de_maquina.value == 'todas' || (estado_de_maquina.value == 'activas' && item.sino_activa == '1') || (estado_de_maquina.value == 'inactivas' && item.sino_activa == '0')) {
          mostrar = true
        } 
        return mostrar
    }
    
    function classMaquina(item) {
        let clase = 'nopagado'
        if (item.maquina_saldada || item.es_nota_de_credito) {
            clase = 'pagado'
        }
        clase = 'nada'
        return clase
    }


</script>
<style scoped>

.nopagado {
  background-color: #ffbdc3;
}
.pagado {
  background-color: #c4ffbd;
}
.nada {
  background-color: #ffffff;
}


.pointer {
  cursor: pointer;
}
</style>