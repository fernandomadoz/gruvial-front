<template>

        <v-row no-gutters>
          
          <!--ESTADO DE RESULTADO-->
          <v-col cols="12" sm="12" class="p-2" v-if="mostrarRepGerencia">
            <ReporteEstadoDeResultado/>
          </v-col>

          <!--IVA VENTAS / IVA COMPRAS-->
          <v-col cols="12" sm="6" class="p-2" v-if="mostrarRepGerencia">
            <ReporteIva/>
          </v-col>

          <!--Rendimiento (Cobros vs Gastos)-->
          <v-col cols="12" sm="6" class="p-2" v-if="mostrarRepGerencia">
            <ReporteRendimiento/>
          </v-col>

          <!--Rendimiento (Facturas vs Gastos)-->
          <v-col cols="12" sm="12" class="p-2" v-if="mostrarRepGerencia">
            <ReporteFacturaVsGastos/>
          </v-col>

          <!--Compras por Categoria-->
          <v-col cols="12" sm="12" class="p-2" v-if="mostrarRepGerencia">
            <ReporteComprasPorCategoria/>
          </v-col>

          <!--Trabajos por Maquina-->
          <v-col cols="12" sm="12" class="p-2" v-if="mostrarRepGerencia">
            <ReporteTrabajosPorMaquina/>
          </v-col>

          <!--Cotizaciones por Estado-->
          <v-col cols="12" sm="12" class="p-2">
            <ReporteCotizacionesPorEstado/>
          </v-col>

          <!--Cotizaciones por Estado-->
          <v-col cols="12" sm="12" class="p-2">
            <ReporteComoNosConocieron/>
          </v-col>

          


        </v-row>
  
</template>
<script setup>
  import ReporteIva from '../components/ReporteIva.vue';
  import ReporteFacturaVsGastos from '../components/ReporteFacturaVsGastos.vue';
  import ReporteRendimiento from '../components/ReporteRendimiento.vue';
  import ReporteComprasPorCategoria from '../components/ReporteComprasPorCategoria.vue';
  import ReporteTrabajosPorMaquina from '../components/ReporteTrabajosPorMaquina.vue';
  import ReporteCotizacionesPorEstado from '../components/ReporteCotizacionesPorEstado.vue';
  import ReporteEstadoDeResultado from '../components/ReporteEstadoDeResultado.vue';
  import ReporteComoNosConocieron from '../components/ReporteComoNosConocieron.vue';
  
  import { ref } from "vue";
  import { useData } from '../composables/useData';
  const { getFirmasPorUsuario, getPermisosPorUsuario } = useData();

  const mostrarRepGerencia = ref(getPermisosPorUsuario.value.reportes[0] == '*' ? true : false)
  
</script>
