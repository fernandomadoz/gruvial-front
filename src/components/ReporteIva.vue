<template>

  <v-card>
    <v-card-title>IVA Ventas vs IVA compras</v-card-title>
    <v-card-text>
      <v-btn-toggle v-model="razon_social_id" color="deep-purple-accent-3" rounded="0" group>
        <v-btn :value="1">
          SERVIGRUAS SRL
        </v-btn>

        <v-btn :value="2">
          SANIBOX SRL
        </v-btn>
      </v-btn-toggle>

      <v-progress-circular v-if="loading" indeterminate color="amber"></v-progress-circular>

      <Bar v-if="!loading" id="my-chart-id" :options="chartOptions" :data="chartData" />

    </v-card-text>
  </v-card>


</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import { useData } from '../composables/useData';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { getFirmasPorUsuario } = useData();

const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH + 'api/')
const { firma_id, headersAxios } = useData();
const loading = ref(true)
const razon_social_id = ref(1)
const ivaVentas = ref(null)
const ivaCompras = ref(null)

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
      text: 'IVA Ventas vs IVA compras'
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
    firma_id: firma_id.value
  });

  let body = await axios.post(ENDPOINT_PATH_API.value + "traer-valores-reporte-iva", jsonCliente, { headers: headersAxios.value[0] });
  //console.log(body['data'])

  ivaVentas.value = body['data']['ivaVentas']
  ivaCompras.value = body['data']['ivaCompras']


  loading.value = false

}



const chartData = computed(() => {
  loading.value = true
  let data = {
    labels: [],
    datasets: []
  }

  let ivaVentasFiltradas = ivaVentas.value.filter(venta => venta.razon_social_id === razon_social_id.value);
  data.labels = ivaVentasFiltradas.map(venta => venta.anio + '/' + venta.mes);
  let chartIvaVentas = { data: null, label: null, backgroundColor: null }
  chartIvaVentas.data = ivaVentasFiltradas.map(venta => Number(venta.importe));
  chartIvaVentas.label = 'IVA Ventas';
  chartIvaVentas.backgroundColor = 'green';
  data.datasets.push(chartIvaVentas)

  let ivaComprasFiltradas = ivaCompras.value.filter(compra => compra.razon_social_id === razon_social_id.value);
  let chartIvaCompras = { data: null, label: null, backgroundColor: null }
  chartIvaCompras.data = ivaComprasFiltradas.map(compra => Number(compra.importe));
  chartIvaCompras.label = 'IVA Compras';
  chartIvaCompras.backgroundColor = 'red';
  data.datasets.push(chartIvaCompras)
  loading.value = false

  return data
})

</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>