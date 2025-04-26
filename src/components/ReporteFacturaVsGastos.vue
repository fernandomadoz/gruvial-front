<template>

    <v-card>
        <v-card-title>Rendimiento (Facturas vs Gastos)</v-card-title>
        <v-card-text>
        <v-btn-toggle
            v-model="firma_id"
            color="deep-purple-accent-3"
            rounded="0"
            group
        >
            <v-btn :value="1">
            Gruvial
            </v-btn>

            <v-btn :value="2">
            Desagotadora
            </v-btn>

            <v-btn :value="3">
            Baños 
            </v-btn>
        </v-btn-toggle>

        <v-progress-circular
            v-if="loading"
            indeterminate
            color="amber"
        ></v-progress-circular> 
        
        <Bar
        v-if="!loading"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        />

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
  
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const { headersAxios } = useData();
  const loading = ref(true)
  const firma_id = ref(1)
  const facturas = ref(null)
  const pagos = ref(null)
  const servicios = ref(null)
  
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
          text: 'Rendimiento (Facturas vs Gastos)'
        }
      }
    }

  onMounted(() => {
    traerValoresDeReportes()  
  })

  
  const traerValoresDeReportes = async () => {
      loading.value=true
      //console.log(page)
      let jsonCliente = JSON.stringify({ 
          firma_id: firma_id.value
      });

      let body = await axios.post(ENDPOINT_PATH_API.value + "traer-valores-reporte-facturas-vs-gasto", jsonCliente, {headers: headersAxios.value[0]});
      //console.log(body['data'])
      
      facturas.value = body['data']['facturas']
      pagos.value = body['data']['pagos']
      servicios.value = body['data']['servicios']


      loading.value=false
      
    }


  
    const chartData = computed(() => {
      loading.value=true
      let data = { 
        labels: [],
        datasets: []
        }
      

      let serviciosFiltradas = servicios.value.filter(compra => compra.firma_id === firma_id.value);
      let chartServicios = {data: null, label: null, backgroundColor: null} 
      chartServicios.data = serviciosFiltradas.map(compra => Number(compra.importe));
      chartServicios.label = 'Servicios';
      chartServicios.backgroundColor = 'yellow';
      data.datasets.push(chartServicios)

      let facturasFiltradas = facturas.value.filter(venta => venta.firma_id === firma_id.value);
      data.labels = facturasFiltradas.map(venta => venta.anio+'/'+venta.mes);
      let chartFacturas = {data: null, label: null, backgroundColor: null} 
      chartFacturas.data = facturasFiltradas.map(venta => Number(venta.importe));
      chartFacturas.label = 'Facturas';
      chartFacturas.backgroundColor = 'green';
      data.datasets.push(chartFacturas)

      let pagosFiltradas = pagos.value.filter(compra => compra.firma_id === firma_id.value);
      let chartPagos = {data: null, label: null, backgroundColor: null} 
      chartPagos.data = pagosFiltradas.map(compra => Number(compra.importe));
      chartPagos.label = 'Gastos';
      chartPagos.backgroundColor = 'red';
      data.datasets.push(chartPagos)

      loading.value=false

      return data
    })
  
</script>
<style>
    .v-sheet--offset {
      top: -24px;
      position: relative;
    }
</style>