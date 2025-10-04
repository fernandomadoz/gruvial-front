<template>
  <v-card>
    <v-card-title>Estado de Resultado</v-card-title>
    <v-card-text>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn-toggle v-model="rep_firma_id" color="deep-purple-accent-3" rounded="0" group>
          <v-btn :value="1">
            SERVIGRUAS SRL
          </v-btn>

          <v-btn :value="2">
            DESAGOTADORA
          </v-btn>
          
          <v-btn :value="3">
            SANIBOX SRL
          </v-btn>

        </v-btn-toggle>
      </v-col>
      <v-col cols="6" sm="2" md="2">
        <v-text-field
            v-model="desde"
            label="Desde"
            type="date"
        ></v-text-field>  
      </v-col>
      <v-col cols="6" sm="2" md="2">
        <v-text-field
            v-model="hasta"
            label="Hasta"
            type="date"
        ></v-text-field>  
      </v-col>
      <v-col cols="6" sm="2" md="2">
        <v-btn @click="traerValoresDeReportes" color="deep-purple-accent-3" rounded="5" group>
          Traer Valores
        </v-btn>
      </v-col>
    </v-row>

      <TablaEstadoDeResultado :datos_tabla="datos_tabla"></TablaEstadoDeResultado>
      <v-progress-circular v-if="loading" indeterminate color="amber"></v-progress-circular>

      <ReporteEstadoDeResultadoGrafico :datos_tabla="datos_tabla"/>


    </v-card-text>
  </v-card>


</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import { useData } from '../composables/useData';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import TablaEstadoDeResultado from '../components/TablaEstadoDeResultado.vue';
import ReporteEstadoDeResultadoGrafico from '../components/ReporteEstadoDeResultadoGrafico.vue';

//ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH + 'api/')
const { firma_id, headersAxios } = useData();
const loading = ref(true)
const rep_firma_id = ref(1)
const desde = ref(null)
const hasta = ref(null)
const today = new Date();
desde.value = today.getFullYear()+ '-01-01';
hasta.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
//desde.value = '2025-05-01'
//hasta.value = '2025-07-31'
const datos_tabla = ref(null)
    
    
/*
const chartData = ref(null)
chartData.value = {
    labels: [ 'January', 'February', 'March' ],
    datasets: [ 
      { data: [40, 20, 12] }, 
      { data: [10372953.24, 30372953.24, 80372953.24] }
    ]
  }
*/

const chartOptions = ref(null)
chartOptions.value = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Estado de Resultado'
    }
  }
}

onMounted(() => {
  traerValoresDeReportes()
})


const traerValoresDeReportes = async () => {
  loading.value = true
  //console.log(page)
  let jsonCliente = JSON.stringify({
    firma_id: rep_firma_id.value,
    desde: desde.value,
    hasta: hasta.value,
  });

  let body = await axios.post(ENDPOINT_PATH_API.value + "traer-valores-reporte-estado-de-resultados", jsonCliente, { headers: headersAxios.value[0] });
  //console.log(body['data'])

  datos_tabla.value = body['data']['datos_tabla']


  loading.value = false

}

/*

const chartData = computed(() => {
  loading.value = true
  let data = {
    labels: [],
    datasets: []
  }

  let ivaVentasFiltradas = ivaVentas.value.filter(venta => venta.rep_firma_id === rep_firma_id.value);
  data.labels = ivaVentasFiltradas.map(venta => venta.anio + '/' + venta.mes);
  let chartIvaVentas = { data: null, label: null, backgroundColor: null }
  chartIvaVentas.data = ivaVentasFiltradas.map(venta => Number(venta.importe));
  chartIvaVentas.label = 'IVA Ventas';
  chartIvaVentas.backgroundColor = 'green';
  data.datasets.push(chartIvaVentas)

  let ivaComprasFiltradas = ivaCompras.value.filter(compra => compra.rep_firma_id === rep_firma_id.value);
  let chartIvaCompras = { data: null, label: null, backgroundColor: null }
  chartIvaCompras.data = ivaComprasFiltradas.map(compra => Number(compra.importe));
  chartIvaCompras.label = 'IVA Compras';
  chartIvaCompras.backgroundColor = 'red';
  data.datasets.push(chartIvaCompras)
  loading.value = false

  return data
  
})
*/
</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>