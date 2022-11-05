<template>
      <h2>Trabajos </h2>
      <v-alert v-if="error" type="error">{{ mensajeError }}</v-alert>

      <v-btn
      size="small"
        
        color="yellow"
        @click="irATrabajo(-1)"
      >Insertar</v-btn> 

      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Accion
            </th>
            <th class="text-left">
              ID
            </th>
            <th class="text-left">
              Cliente
            </th>
            <th class="text-left">
              Fecha de Inicio
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in listaTrabajos"
            :key="item.id"
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
            <td>{{ convertir(item.cliente) }}</td>
            <td>{{ item.fecha_inicio }}</td>
          </tr>
        </tbody>
      </v-table>
  

</template>

<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  
  const { ENDPOINT_PATH_API, token, firma_id, headersAxios } = useData();
  //console.log(token);
  let listaTrabajos = ref([]);
  const error = ref(false);
  const mensajeError = ref('');

  const json = JSON.stringify({ 
      firma_id: firma_id.value
  });

  const body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-encabezado-listar", json, {headers: headersAxios.value[0]});

  listaTrabajos = body['data'];

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
          
    const irATrabajo = (id) => {
        router.push("/trabajo/"+id);

      }

/*

  import { useDataStore } from "@/stores/DataStore";
  import trabajos from "@/logic/trabajos";
  

  export default {
    setup() {
        const DataStore = useDataStore()
        return {
          // you can return the whole store instance to use it in the template
          DataStore,
        }
    },    
    data () {
      return {
        listaTrabajos: [1,2,3],
        error: false,
        mensajeError: ''
      }
    },
    mounted: function () {
      // `this` hace referencia a la instancia vm
      this.traerTrabajos();
      console.log(this.listaTrabajos);
    },
    methods: {
      async traerTrabajos () {
         try {
            let body = await trabajos.traerTrabajos();
            this.listaTrabajos = body['data'];
            console.log(this.listaTrabajos);


         } catch (error) {
            this.error = true;          
         }        
      }, 
      convertir: function(valor) {
        let resultado = '';
        //if (Array.isArray(valor)) {
        //  resultado = valor[1]; 
        //}

        if (valor != null) {
          resultado = valor.nombre_o_razon_social+' ('+valor.CUIT_o_CUIL+')'; 
        }
        return resultado;
      },
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }

*/
</script>
