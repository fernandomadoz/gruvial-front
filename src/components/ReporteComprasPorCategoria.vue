<template>

    <v-card>
        <v-card-title>Compras por Categoria</v-card-title>
        <v-card-text>
            <!-- BOTONES -->
            <v-row no-gutters>

                <v-col cols="12" sm="10">
                    <v-btn-toggle v-model="firma_id" color="deep-purple-accent-3" rounded="0" group>
                        <v-btn :value="1">Gruvial</v-btn>
                        <v-btn :value="2">Desagotadora</v-btn>
                        <v-btn :value="3">Baños</v-btn>
                    </v-btn-toggle>
                </v-col>
                <v-col cols="12" sm="2" class="pl-3">
                    <v-text-field label="Año" v-model="anio" class="right-0" type="number" min="2024"
                        required></v-text-field>
                </v-col>
            </v-row>
            <v-btn-toggle v-model="mes" color="light-blue" rounded="0" group class="my-3">
                <v-btn :value="0" size="small">Todo</v-btn>
                <v-btn :value="1" size="small">Enero</v-btn>
                <v-btn :value="2" size="small">Febrero</v-btn>
                <v-btn :value="3" size="small">Marzo</v-btn>
                <v-btn :value="4" size="small">Abril</v-btn>
                <v-btn :value="5" size="small">Mayo</v-btn>
                <v-btn :value="6" size="small">Junio</v-btn>
                <v-btn :value="7" size="small">Julio</v-btn>
                <v-btn :value="8" size="small">Agosto</v-btn>
                <v-btn :value="9" size="small">Septiembre</v-btn>
                <v-btn :value="10" size="small">Octubre</v-btn>
                <v-btn :value="11" size="small">Noviembre</v-btn>
                <v-btn :value="12" size="small">Diciembre</v-btn>
            </v-btn-toggle>

            <!-- GRAFICOS -->
            <v-row no-gutters>
                <v-progress-circular v-if="loading" indeterminate color="amber"></v-progress-circular>

                <v-col cols="12" sm="8">
                    <Bar v-if="!loading" id="my-chart-id" :options="chartOptions" :data="chartData" />
                </v-col>
                <v-col cols="12" sm="4" class="pl-3">
                    <Pie v-if="!loading" id="my-chart-id" :options="chartOptionsPie" :data="chartData" />
                </v-col>
            </v-row>

        </v-card-text>
    </v-card>



</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
import { useData } from '../composables/useData';
import { Bar } from 'vue-chartjs';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const { getFirmasPorUsuario } = useData();

const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH + 'api/')
const { headersAxios } = useData();
const loading = ref(true)
const firma_id = ref(1)
const compras = ref(null)
const comprasMes = ref(null)
const comprasAnio = ref(null)
const mes = ref(1)
const anio = ref(2024)

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
            text: 'Compras por Categoria'
        },
    }
}

const chartOptionsPie = ref(null)
chartOptionsPie.value = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'top',
        },
        title: {
            display: false,
            text: 'Compras por Categoria'
        },
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

    let bodyMes = await axios.post(ENDPOINT_PATH_API.value + "traer-valores-reporte-compras-por-categoria-por-mes", jsonCliente, { headers: headersAxios.value[0] });
    let bodyAnio = await axios.post(ENDPOINT_PATH_API.value + "traer-valores-reporte-compras-por-categoria-por-anio", jsonCliente, { headers: headersAxios.value[0] });
    //console.log(body['data'])

    comprasMes.value = bodyMes['data']['compras']
    comprasAnio.value = bodyAnio['data']['compras']


    loading.value = false

}



const chartData = computed(() => {
    loading.value = true
    let data = {
        labels: [],
        datasets: []
    }


    let comprasFiltradas
    if (mes.value === 0) {
        compras.value = comprasAnio.value
        comprasFiltradas = compras.value.filter(compra => compra.firma_id === firma_id.value && compra.anio == anio.value);
    }
    else {
        compras.value = comprasMes.value
        comprasFiltradas = compras.value.filter(compra => compra.firma_id === firma_id.value && compra.anio == anio.value && compra.mes === mes.value);
    }

    /*
    let dataFiltrada = comprasFiltradas

    //SI el mes es 0 son TODOS LOS MESES y aqui agrupo los resultados de todos los meses por Plan de Cuentas
    if (mes.value === 0) {
        const result = dataFiltrada.reduce((acc, item) => {
            // Convierte el importe a número para poder sumarlo
            const importe = parseFloat(item.importe);

            // Si el plan de cuenta ya está en el acumulador, suma el importe
            if (acc[item.plan_de_cuenta]) {
                acc[item.plan_de_cuenta] += importe;
            } else {
                // Si el plan de cuenta no está en el acumulador, crea una nueva entrada
                acc[item.plan_de_cuenta] = importe;
            }

            return acc;
        }, {});

        // Convierte el objeto resultante en un array de objetos
        const resultArray = Object.entries(result).map(([plan_de_cuenta, importe]) => ({
            plan_de_cuenta,
            importe: importe.toFixed(2) // Formatear a dos decimales
        }));
        comprasFiltradas = resultArray
    }
    */


    data.labels = comprasFiltradas.map(compra => compra.plan_de_cuenta);

    let chartCompras = { data: null, label: null, backgroundColor: null }
    chartCompras.data = comprasFiltradas.map(compra => Number(compra.importe));
    chartCompras.label = 'Gastos';
    chartCompras.backgroundColor = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1',
        '#A133FF', '#33FFF6', '#F6FF33', '#FF8333',
        '#8333FF', '#33FF83', '#FF3333', '#33A1FF',
        '#FF33FF', '#33FFA1', '#FF8A33', '#33FF8A',
        '#8A33FF', '#FF338A', '#33FF33', '#FF33F6'
    ];
    data.datasets.push(chartCompras)
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