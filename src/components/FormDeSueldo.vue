<template>
    
    <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
    <hr  v-show="mensaje != null" /> 

    <v-card>
        <v-tabs
        v-model="tab"
        :class="colorTab(props.notificacion.sueldo)"
        color="black"
        >
        <v-tab value="sueldo" :class="colorTab(props.notificacion.sueldo)">Sueldo</v-tab>
        <v-tab value="hsextra" :class="colorTab(props.notificacion.hsextra)">Horas Extra</v-tab>
        <v-tab value="roster" :class="colorTab(props.notificacion.roster)">Roster</v-tab>
        <v-tab value="adelanto" :class="colorTab(props.notificacion.adelanto)">Adelanto</v-tab>
        
        </v-tabs>

        <v-card-text>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="sueldo">
                <FormDePagoMensual v-if="props.notificacion.sueldo ==0 || cargar_sueldo" :tiempo="props.tiempo" :compra_encabezado_id="props.notificacion.id" :cuentas="props.cuentas" :concepto_de_sueldo_id="1" :tipos_de_cobros="props.tipos_de_cobros" @registracion-ok="(importe_pago_mensual_registrado) => registrarPagoMensual(importe_pago_mensual_registrado, props.notificacion, 'sueldo')"></FormDePagoMensual>
                <div v-else>
                    <h3>Sueldo: ${{ formatoNumero(importe_sueldo) }}</h3>
                    <v-btn size="small" color="yellow" @click="cargar_sueldo=true" class="m-1">Cargar mas sueldo</v-btn> 
                </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="hsextra">
                <FormDePagoMensual v-if="props.notificacion.hsextra ==0 || cargar_hsextra" :tiempo="props.tiempo" :compra_encabezado_id="props.notificacion.id" :cuentas="props.cuentas" :concepto_de_sueldo_id="2" :tipos_de_cobros="props.tipos_de_cobros" @registracion-ok="(importe_pago_mensual_registrado) => registrarPagoMensual(importe_pago_mensual_registrado, props.notificacion, 'hsextra')"></FormDePagoMensual>
                <div v-else>
                    <h3>Hs Extras: ${{ formatoNumero(importe_hsextra) }}</h3>
                    <v-btn size="small" color="yellow" @click="cargar_hsextra=true" class="m-1">Cargar mas hs extras</v-btn> 
                </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="roster">
                <FormDePagoMensual v-if="props.notificacion.roster ==0 || cargar_roster" :tiempo="props.tiempo" :compra_encabezado_id="props.notificacion.id" :cuentas="props.cuentas" :concepto_de_sueldo_id="5" :tipos_de_cobros="props.tipos_de_cobros" @registracion-ok="(importe_pago_mensual_registrado) => registrarPagoMensual(importe_pago_mensual_registrado, props.notificacion, 'roster')"></FormDePagoMensual>
                <div v-else>
                    <h3>Roster: ${{ formatoNumero(importe_roster) }}</h3>
                    <v-btn size="small" color="yellow" @click="cargar_roster=true" class="m-1">Cargar mas roster</v-btn> 
                </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="adelanto">
                <FormDePagoMensual v-if="props.notificacion.adelanto ==0 || cargar_adelanto" :tiempo="props.tiempo" :compra_encabezado_id="props.notificacion.id" :cuentas="props.cuentas" :concepto_de_sueldo_id="3" :tipos_de_cobros="props.tipos_de_cobros" @registracion-ok="(importe_pago_mensual_registrado) => registrarPagoMensual(importe_pago_mensual_registrado, props.notificacion, 'adelanto')"></FormDePagoMensual>
                <div v-else>
                    <h3>Adelanto: ${{ formatoNumero(importe_adelanto) }}</h3>
                    <v-btn size="small" color="yellow" @click="cargar_adelanto=true" class="m-1">Cargar mas adelantos</v-btn> 
                </div>
            </v-tabs-window-item>
        </v-tabs-window>
        </v-card-text>
    </v-card>

</template>

<script setup>
  import { ref } from "vue"
  import axios from "axios"
  import { useData } from '../composables/useData';
  import FormDePagoMensual from '../components/FormDePagoMensual.vue';
  
  const { headersAxios, firma_id, getNotificacionesPorUsuario, getOpcionesMenuPrincipal } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  const props = defineProps({
      cuentas: {
          type: Object,
          default: []
      },
      notificacion: {
          type: Object,
          default: []
      },
      tipos_de_cobros: {
          type: Object,
          default: []
      },
      compra_encabezado_id: {
          type: Number,
          default: null
      },
      tiempo: {
          type: String,
          default: null
      }
  })
  
  //defineEmits(['registracion-ok'])
  const emit = defineEmits(['registracion-ok'])

  const tab = ref('sueldo')
  const bg_color_sueldo = ref('bg-red')
  const importe_de_pago = ref(0)
  const mensaje = ref(null)
  
  const importe_sueldo = ref(Number(props.notificacion.sueldo))
  const importe_hsextra = ref(Number(props.notificacion.hsextra))
  const importe_roster = ref(Number(props.notificacion.roster))
  const importe_adelanto = ref(Number(props.notificacion.adelanto))

  const cargar_sueldo = ref(false)
  const cargar_hsextra = ref(false)
  const cargar_roster = ref(false)
  const cargar_adelanto = ref(false)
    
 
 function registrarPagoMensual(importe, notificacion, tipo_de_pago) {
    if (tipo_de_pago == 'sueldo') {
        console.log(importe_sueldo.value)
        importe_de_pago.value = importe
        importe_sueldo.value = importe_sueldo.value+importe
        cargar_sueldo.value = false
        console.log(importe_sueldo.value)

    }
    if (tipo_de_pago == 'hsextra') {
        console.log(importe_hsextra.value)
        importe_hsextra.value = importe_hsextra.value+importe
        cargar_hsextra.value = false
        console.log(importe_hsextra.value)

    }
    if (tipo_de_pago == 'roster') {
        importe_roster.value = importe_roster.value+importe
        cargar_roster.value = false
    }
    if (tipo_de_pago == 'adelanto') {
        importe_adelanto.value = importe_adelanto.value+importe
        cargar_adelanto.value = false
    }
    
    console.log(notificacion.detalle)
    console.log(importe)
    getTime()
  }

  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);
    emit('registracion-ok', importe_de_pago.value)

  }


  function colorTab(monto) {
    let color = monto > 0 ? 'bg-green' : 'bg-red'
    return color
  }

  function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }
</script>
