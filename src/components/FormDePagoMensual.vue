<template>
    
    <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
    <hr  v-show="mensaje != null" /> 

    <v-form
        ref="formPagos"
        v-model="validPago"
        lazy-validation
        class="mt-3"
    >
        <v-row>
            <!-- CUENTA -->
            <v-col cols="12" md="4">
                <v-autocomplete
                    v-model="cuenta_de_origen_id"
                    :items="props.cuentas"
                    item-title="detalle_select"
                    item-value="id"
                    density="compact"
                    filled
                    label="Cuenta que Paga *"
                    :rules="requeridoRules"
                    required
                ></v-autocomplete>      
            </v-col>  
            
            <!-- TIPO DE COBRO -->
            <v-col cols="12" md="4">
                <v-autocomplete
                    v-model="tipo_de_cobro_id"
                    :items="props.tipos_de_cobros"
                    item-title="tipo_de_cobro"
                    item-value="id"
                    density="compact"
                    filled
                    label="Tipo de Pago *"
                    :rules="requeridoRules"
                    required
                ></v-autocomplete>      
            </v-col>  

            <!-- FECHA -->
            <v-col cols="12" md="4">
                <v-text-field
                    v-model="fecha_de_pago"
                    :rules="requeridoRules"
                    density="compact"
                    label="Fecha de Pago *"
                    type="date"
                    required
                ></v-text-field>    
            </v-col>  

            <!-- IMPORTE -->
            <v-col cols="12" md="4">
                <MoneyField
                    v-model="importe_de_pago"
                    density="compact"
                    :rules="importe_de_pagoRules"
                    :options="currencyOptions_general"
                    label="Importe de Pago *"
                >
                </MoneyField>    
            </v-col>  
            
            <!-- BOTON GUARDAR Y LOADING -->
            <v-col cols="12" md="4">
            <v-btn  color="primary" @click="validate" :disabled="loading">
                <v-icon start icon="mdi-content-save"></v-icon> GUARDAR
            </v-btn>        
            <v-progress-circular indeterminate color="amber" v-show="loading"></v-progress-circular>
        </v-col>
        </v-row>
    </v-form>
</template>

<script setup>
  import { ref } from "vue"
  import axios from "axios"
  import { useData } from '../composables/useData';
  import MoneyField from '../components/MoneyField.vue';
  
  const { headersAxios, firma_id, getNotificacionesPorUsuario, getOpcionesMenuPrincipal } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  const props = defineProps({
      cuentas: {
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
      concepto_de_sueldo_id:{
          type: Number,
          default: null
      },
      tiempo:{
          type: String,
          default: null
      },
  })
  
  //defineEmits(['registracion-ok'])
  const emit = defineEmits(['registracion-ok'])

  const cuenta_de_origen_id = ref(cuenta_de_origen_by_firma())
  const tipo_de_cobro_id = ref(2)
  const today = new Date();
  const fecha_de_pago = ref(today.getFullYear() + '-' + ('0' + (today.getMonth() + sumaMes())).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
  const importe_de_pago = ref(null)
  const loading = ref(false)
  const mensaje = ref(null)
  //Variables compras_encabezados
  const formPagos = ref(null) 
  const validPago = ref(true);


  //RULES
    const requeridoRules = [
        v => !!v || 'Es requerido'
    ];

    
    const importe_de_pagoRules = [
        value => {
            if (!value) {
                return 'Es requerido'
            }
            else {
                if (!value > 0) {
                    return 'importe de la compra debe ser mayor a 0'
                }
            }
        }
    ];

    
    const currencyOptions_general = ref({
        locale: 'es-AR', 
        currency: 'ARS', 
        distractionFree: false, 
        precision: 2, 
        //valueRange: {min: 1}, 
        autoDecimalMode: true, 
    })
  // FIN RULES

    function cuenta_de_origen_by_firma() {
        let cuenta = 1
        if (firma_id.value == 1) {
            cuenta = 11
        }
        if (firma_id.value == 2) {
            cuenta = 5
        }
        if (firma_id.value == 3) {
            cuenta = 6
        }
        return cuenta
    }

    
  //Valido el Formulario
  async function validate () {
    const formValidado = await formPagos.value.validate()
      if (validPago.value) {
        enviarFormPago()
        }    
        else {
            console.log(formValidado.valid)
        }
    }

  //Envio el Formulario
  async function enviarFormPago() {
    
    
    loading.value = true

    //construjo el json a enviar a laravel
    const json = JSON.stringify({ 
    compra_encabezado_id: props.compra_encabezado_id,
    cuenta_de_origen_id: cuenta_de_origen_id.value,
    fecha_de_pago: fecha_de_pago.value,
    importe_de_pago: importe_de_pago.value,
    tipo_de_cobro_id: tipo_de_cobro_id.value,
    concepto_de_sueldo_id: props.concepto_de_sueldo_id
    });

    let body_abm = await axios.post(ENDPOINT_PATH_API.value + "registrar-pago-de-compra-mensual", json, {headers: headersAxios.value[0]})
    mensaje.value = body_abm['data'].mensaje
    
    getTime()
    loading.value = false
    }

    
  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);
    emit('registracion-ok', importe_de_pago.value)

  }

  function sumaMes() {
        let cant = 0
        if (props.tiempo == 'vencidos') {
            cant = 0
        }
        if (props.tiempo == 'hoy') {
            cant = 1
        }
        if (props.tiempo == 'proximos') {
            cant = 2
        }
        return cant
    }
</script>
