<template>
    <v-row align="center" justify="center">
      <v-col cols="auto"
      v-for="(item, index) in getOpcionesMenuPrincipal"
      :key="index"
      >
      
        <v-btn
          v-if="item.showInHome"
          class="ma-2 py-3"
          color="yellow-lighten-2"
          size="large"
          rounded="lg"
          height="72"
          min-width="164"
          :to="item.link"
        >
            <v-icon
              :icon="item.icon"
              start
            ></v-icon>
            {{ item.title }}
          </v-btn>
        </v-col>
    </v-row>

  <v-row>
    <!-- CHEQUES -->
    <v-col cols="12" sm="12" md="12" v-if="getNotificacionesPorUsuario.includes('cheques')">
      <TabNotificaciones 
        titulo="Cheques"
        tipo="cheque" 
        icon="mdi-cash" 
        :listaVencidos="listaChequesVencidos" 
        :listaHoy="listaChequesHoy" 
        :listaProximos="listaChequesProximos" 
      />
    </v-col>
    <!-- FIN CHEQUES -->

    <!-- RECORDATORIOS -->
    <v-col cols="12" sm="12" md="12" v-if="getNotificacionesPorUsuario.includes('recordatorios')">      
      <TabNotificaciones 
        titulo="Recordatorios"
        tipo="recordatorio" 
        icon="mdi-alarm" 
        :listaVencidos="listaRecordatoriosVencidos" 
        :listaHoy="listaRecordatoriosHoy" 
        :listaProximos="listaRecordatoriosProximos" 
      />     
    </v-col>
    <!-- FIN RECORDATORIOS -->

    <!-- PAGOS MENSUALES -->
    <v-col cols="12" sm="12" md="12" v-if="getNotificacionesPorUsuario.includes('mensuales')">      
      <TabNotificaciones 
        titulo="Pagos Mensuales"
        tipo="pagomensual" 
        icon="mdi-calendar-month" 
        :listaVencidos="listaMensualesVencidos" 
        :listaHoy="listaMensualesHoy" 
        :listaProximos="listaMensualesProximos" 
        tituloVencidos="Mes Anterior" 
        tituloHoy="Mes Actual" 
        tituloProximos="Proximo Mes"
      />     
    </v-col>
    <!-- FIN PAGOS MENSUALES -->

    <!-- TRABAJOS MENSUALES -->
    <v-col cols="12" sm="12" md="12" v-if="getNotificacionesPorUsuario.includes('trabajos')">      
      <TabNotificaciones 
        titulo="Trabajos Mensuales Facturados"
        tipo="trabajomensual" 
        icon="mdi-calendar-month" 
        :listaVencidos="listaTrabajosMensualesVencidos" 
        :listaHoy="listaTrabajosMensualesHoy" 
        :listaProximos="listaTrabajosMensualesProximos" 
        tituloVencidos="Mes Anterior" 
        tituloHoy="Mes Actual" 
        tituloProximos="Proximo Mes"
      />     
    </v-col>
    <!-- FIN TRABAJOS MENSUALES -->

    <!-- SUELDOS -->
    <v-col cols="12" sm="12" md="12" v-if="getNotificacionesPorUsuario.includes('sueldos')">      
      <TabNotificaciones 
        titulo="Sueldos"
        tipo="sueldo" 
        icon="mdi-calendar-month" 
        :listaVencidos="listaSueldosVencidos" 
        :listaHoy="listaSueldosHoy" 
        :listaProximos="listaSueldosProximos" 
        tituloVencidos="Mes Anterior" 
        tituloHoy="Mes Actual" 
        tituloProximos="Proximo Mes"
      />     
    </v-col>
    <!-- FIN SUELDOS -->

    <!-- TRABAJOS -->
    <v-col cols="12" sm="12" md="12" v-if="getNotificacionesPorUsuario.includes('trabajos')">      
      <TabNotificaciones 
        titulo="Trabajos"
        tipo="trabajo" 
        icon="mdi-crane" 
        :listaVencidos="listaTrabajosVencidos" 
        :listaHoy="listaTrabajosHoy" 
        :listaProximos="listaTrabajosProximos" 
      />     
    </v-col>
    <!-- FIN TRABAJOS -->


  </v-row>
</template>

<script setup>
  import { ref } from "vue"
  import axios from "axios"
  import { useData } from '../composables/useData';
  import TabNotificaciones from '../components/TabNotificaciones.vue';

  
  const { headersAxios, firma_id, getNotificacionesPorUsuario, getOpcionesMenuPrincipal } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  const panel = ref(false)
  const listaChequesVencidos = ref(null)
  const listaChequesHoy = ref(null)
  const listaChequesProximos = ref(null)
  const listaTrabajosVencidos = ref(null)
  const listaTrabajosHoy = ref(null)
  const listaTrabajosProximos = ref(null)
  const listaMensualesVencidos = ref(null)
  const listaMensualesHoy = ref(null)
  const listaMensualesProximos = ref(null)
  const listaSueldosVencidos = ref(null)
  const listaSueldosHoy = ref(null)
  const listaSueldosProximos = ref(null)
  const listaRecordatoriosVencidos = ref(null)
  const listaRecordatoriosHoy = ref(null)
  const listaRecordatoriosProximos = ref(null)
  const listaTrabajosMensualesVencidos = ref(null)
  const listaTrabajosMensualesHoy = ref(null)
  const listaTrabajosMensualesProximos = ref(null)
  
  const listaPagosMensuales = ref(null)

  //console.log(page)
  let jsonNotificaciones = JSON.stringify({ 
      firma_id: firma_id.value,
  });

  //Traigo NOTIFICACIONES DE CHEQUES
  let body_notificaciones_cheques = await axios.post(ENDPOINT_PATH_API.value + "notificaciones-cheques", jsonNotificaciones, {headers: headersAxios.value[0]})
  listaChequesVencidos.value = body_notificaciones_cheques['data']['vencidos']
  listaChequesHoy.value = body_notificaciones_cheques['data']['hoy']
  listaChequesProximos.value = body_notificaciones_cheques['data']['proximos']
  
  
  //Traigo NOTIFICACIONES DE TRABAJOS
  let body_notificaciones_trabajos = await axios.post(ENDPOINT_PATH_API.value + "notificaciones-trabajos", jsonNotificaciones, {headers: headersAxios.value[0]})
  listaTrabajosVencidos.value = body_notificaciones_trabajos['data']['vencidos']
  listaTrabajosHoy.value = body_notificaciones_trabajos['data']['hoy']
  listaTrabajosProximos.value = body_notificaciones_trabajos['data']['proximos']
  
  
  //Traigo NOTIFICACIONES DE PAGOS MENSUALES
  let body_notificaciones_pagos_mensuales = await axios.post(ENDPOINT_PATH_API.value + "notificaciones-pagos-mensuales", jsonNotificaciones, {headers: headersAxios.value[0]})
  listaMensualesVencidos.value = body_notificaciones_pagos_mensuales['data']['vencidos']
  listaMensualesHoy.value = body_notificaciones_pagos_mensuales['data']['hoy']
  listaMensualesProximos.value = body_notificaciones_pagos_mensuales['data']['proximos']
  

  //Traigo NOTIFICACIONES DE TRABAJOS MENSUALES
  let body_notificaciones_trabajos_mensuales = await axios.post(ENDPOINT_PATH_API.value + "notificaciones-trabajos-mensuales", jsonNotificaciones, {headers: headersAxios.value[0]})
  listaTrabajosMensualesVencidos.value = body_notificaciones_trabajos_mensuales['data']['vencidos']
  listaTrabajosMensualesHoy.value = body_notificaciones_trabajos_mensuales['data']['hoy']
  listaTrabajosMensualesProximos.value = body_notificaciones_trabajos_mensuales['data']['proximos']
  

  
  //Traigo NOTIFICACIONES DE PAGOS MENSUALES
  let body_notificaciones_sueldos = await axios.post(ENDPOINT_PATH_API.value + "notificaciones-sueldos", jsonNotificaciones, {headers: headersAxios.value[0]})
  listaSueldosVencidos.value = body_notificaciones_sueldos['data']['vencidos']
  listaSueldosHoy.value = body_notificaciones_sueldos['data']['hoy']
  listaSueldosProximos.value = body_notificaciones_sueldos['data']['proximos']
     

  //Traigo NOTIFICACIONES DERECORDATORIOS
  let body_notificaciones_pagos_recordatorios = await axios.post(ENDPOINT_PATH_API.value + "notificaciones-recordatorios", jsonNotificaciones, {headers: headersAxios.value[0]})
  listaRecordatoriosVencidos.value = body_notificaciones_pagos_recordatorios['data']['vencidos']
  listaRecordatoriosHoy.value = body_notificaciones_pagos_recordatorios['data']['hoy']
  listaRecordatoriosProximos.value = body_notificaciones_pagos_recordatorios['data']['proximos']

</script>
