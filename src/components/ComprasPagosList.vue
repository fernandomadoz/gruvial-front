<template>

    <v-dialog
      v-model="dialog"
      persistent
    >
        <template v-slot:activator="{ props }">

              <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
              <hr  v-show="mensaje != null" />    

            <v-btn
                size="small"
                color="yellow"
                v-bind="props"
                @click="ABMLinea('A', null)"
            >Insertar</v-btn> 


            <v-table>
                <thead>
                <tr>
                    <th class="text-left">Accion</th>
                    <th class="text-left">id</th>
                    <th class="text-left">Fecha de Pago</th>
                    <th class="text-left">Tipo</th>
                    <th class="text-left">Importe de pago</th>
                    <th class="text-left">Cuenta de origen</th>
                    <th class="text-left">Observaciones</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaPagos"
                    :key="item.id"
                >
                    <td>
                        <v-btn
                            size="small"
                            icon="mdi-pencil"
                            color="yellow"
                            @click="ABMLinea('M', item)"
                            v-bind="props"
                        ></v-btn> 
                        <v-btn
                            size="small"
                            icon="mdi-close-circle"
                            color="yellow"
                            @click="ABMLinea('B', item)"
                            v-bind="props"
                        ></v-btn>
                    </td>
                    <td>{{ (item.id) }}</td>
                    <td>{{ item.fecha_de_pago }}</td>
                    <td>{{ (item.tipo_de_cobro.tipo_de_cobro) }}</td>
                    <td>${{ formatoNumero(item.importe_de_pago) }}</td>
                    <td>{{ (item.cuenta_de_origen.detalle_select) }}</td>
                    <td>{{ item.observaciones }}</td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Pago de compra</span>
                </v-col>
                <v-col cols="1" sm="1" md="1">
                    <v-icon
                        class="float-right"
                        icon="mdi-close-circle"
                        color="grey"
                        @click="dialog = false"
                    ></v-icon>
                </v-col>
            </v-card-title>
            <v-card-text>
                <v-container>

                    <div v-if="firmasCompraCombinada?.length>1">
                        <div class="pa-4">
                            <h2 class="text-subtitle-1 font-weight-bold mb-0">
                            Compra combinada
                            </h2>
                            <v-chip-group
                            selected-class="text-primary"
                            column
                            >
                            <v-chip v-for="firma in firmasCompraCombinada" :key="firma.id">
                                {{ firma.firma }}
                            </v-chip>
                            </v-chip-group>
                        </div>
                    </div>


                    <v-form
                        ref="formPagos"
                        v-model="validPago"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete
                                    v-model="pago.cuenta_de_origen.id"
                                    :items="cuentas"
                                    :disabled="deshabilitarEdicionCamposABMPagos"
                                    item-title="detalle_select"
                                    item-value="id"
                                    dense
                                    filled
                                    label="Cuenta que Paga *"
                                    :rules="cuentaRules"
                                    required
                                ></v-autocomplete>      
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete
                                    v-model="pago.tipo_de_cobro.id"
                                    :items="tipos_de_cobros"
                                    :disabled="deshabilitarEdicionCamposABMPagos"
                                    :rules="tipo_de_cobroRules"
                                    :hint="txtNotificarCambioTipoDeCobro"
                                    item-title="tipo_de_cobro"
                                    item-value="id"
                                    required
                                    dense
                                    filled
                                    label="Tipo de Pago *"
                                ></v-autocomplete> 
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMPagos"
                                    v-model="pago.fecha_de_pago_f"
                                    :rules="fecha_de_pagoRules"
                                    label="Fecha de Pago *"
                                    type="date"
                                    required
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                {{ importe_de_pagoTexto }}
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMPagos"
                                    v-model="pago.importe_de_pago"
                                    :rules="importe_de_pagoRules"
                                    label="Importe de Pago *"
                                    type="number"
                                    min="0"
                                    :hint="iporte_de_pagoTexto"
                                    prefix="$"
                                    required
                                ></v-text-field--> 
                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMPagos"
                                    v-model="pago.importe_de_pago"
                                    :rules="importe_de_pagoRules"
                                    :options="currencyOptions_general"
                                    label="Importe de Pago *"
                                >
                                </MoneyField> 
                            </v-col>
                        </v-row>
                            

                        <!-- INICIO CHEQUE -->
                        <v-row v-show="(tipo_de_cobro_id == 3 || tipo_de_cobro_id == 4)">
                
                            <v-col cols="12" sm="6" md="4">
                                <v-switch
                                    v-model="cheque_en_cartera"
                                    label="Cheque en cartera?"
                                    color="success"
                                ></v-switch>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-if="cheque_en_cartera">
                                <v-autocomplete
                                    v-model="cheque_id"
                                    :items="cheques_en_cartera"
                                    :disabled="deshabilitarEdicionCamposABMCobros"
                                    item-title="cheque"
                                    item-value="id"
                                    dense
                                    filled
                                    label="Cheque *"
                                    :rules="chequeRules"
                                ></v-autocomplete>      
                            </v-col>
                        </v-row>
                        <v-row v-show="(tipo_de_cobro_id == 3 || tipo_de_cobro_id == 4) && !cheque_en_cartera">
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="pago.cheque.numero_de_cheque"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        maxlength="30"
                                        counter="30"
                                        label="Nro de Cheque"
                                        :rules="chequeRules"
                                    ></v-text-field>      
                                </v-col>
                                <!--v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="pago.cheque.fecha_de_emision_f"
                                        label="Fecha de Emisión *"
                                        type="date"
                                        :rules="chequeRules"
                                    ></v-text-field>  
                                </v-col-->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="pago.cheque.fecha_inicio_de_cobro_f"
                                        label="Fecha de Inicio de Pago *"
                                        type="date"
                                        :rules="chequeRules"
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="pago.cheque.fecha_de_vencimiento_f"
                                        label="Fecha de Vencimiento *"
                                        type="date"
                                        :rules="chequeRules"
                                        readonly
                                    ></v-text-field>  
                                </v-col>
                                
                                <v-col cols="12" sm="6" md="4">
                                    <v-switch
                                        v-model="cheque_pagado"
                                        label="Este Cheque ya se pago?"
                                        color="success"
                                    ></v-switch>
                                </v-col>

                                <v-col cols="12" sm="6" md="4" v-show="cheque_pagado">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="pago.cheque.fecha_de_cobro_f"
                                        label="Fecha de Pago"
                                        type="date"
                                        clearable
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-model="pago.cheque.causa_de_baja_de_cheque.id"
                                        :items="causas_de_bajas_de_cheques"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="causa_de_baja_de_cheque"
                                        item-value="id"
                                        label="Causa de No Pago"
                                        return-object
                                        clearable 
                                    ></v-select>     
                                </v-col>
                            <!-- FIN CHEQUE -->
                        </v-row>

                        <v-row>                        
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMPagos"
                                    label="Observaciones"
                                    counter="250"
                                    maxlength="250"
                                    v-model="pago.observaciones"
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        
                        <v-row>                        
                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(facturas_de_compra).length>0"> 
                                <p>Seleccione las facturas pagadas:</p>
                                <v-checkbox class="checkbox_factura"                                    
                                v-for="item in facturas_de_compra"
                                :key="item.id"
                                :label="'Factura nro: '+ item.nro_de_factura"
                                :value="item.id"
                                v-model="facturas"
                                ></v-checkbox>
                            </v-col>
                        </v-row>       



                        <v-spacer></v-spacer>
                        <v-btn
                            class="ma-2"
                            color="primary"
                            @click="validate"
                            :disabled="loading"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            {{ botonABM }}  
                        </v-btn>
                        <v-btn
                            class="ma-2"
                            color="grey"
                            @click="dialog = false"
                            :disabled="loading"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            Cerrar  
                        </v-btn>

                        <v-progress-circular
                        indeterminate
                        color="amber"
                        v-show="loading"
                        ></v-progress-circular>

                    </v-form>

                </v-container>
                <small>*Campos obligatorios</small>
            </v-card-text>
            <v-card-actions>

            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup>
  import { ref, watch, computed } from "vue";
  import { reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';
  import MoneyField from '../components/MoneyField.vue';


  const props = defineProps({
    controlarMontoDeImporte: {
          type: Boolean,
          default: true
    },
    importe_de_compra: {
          type: Number,
          default: 0
      },
    esCompraCombinada: {
          type: Boolean,
          default: false
      },
      firmasCompraCombinada: {
          type: Object,
          default: []
      },
  })

  const { token, headersAxios, compra_encabezado_id, user_id, firma_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  let pago = ref({
            tipo_de_cobro: {
                id: 1
            }})
  let pago_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMPagos = ref(false)
  let accionABM = ref(null)
  let facturas = ref([])
  let tipo_de_cobro_id = ref(1)
  let tipo_de_cobro_id_original = ref(null)
  let txtNotificarCambioTipoDeCobro = ref(null)
  let confirmado = ref(false)
  const cheque_en_cartera = ref(false)
  const cheque_pagado = ref(false)
  const cheques_en_cartera = ref(null)
  const cheque_id = ref(null)
  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

  //Variables compras_encabezados
  const formPagos = ref(null) 

  let json = JSON.stringify({ 
      compra_encabezado_id: compra_encabezado_id.value
  });

          
  //Traigo los Pagos
  let body = await axios.post(ENDPOINT_PATH_API.value + "compra-pago-listar", json, {headers: headersAxios.value[0]});
  let listaPagos = ref(body['data']);
          
  //Traigo cuentas
  let jsonCuentas = JSON.stringify({ 
      firma_id: firma_id.value,
      compra_encabezado_id: compra_encabezado_id.value
  });
  const body_cuentas = await axios.post(ENDPOINT_PATH_API.value + "cuentas-por-firma", jsonCuentas, {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']

  //Traigo las facturas
  let body_facturas = await axios.post(ENDPOINT_PATH_API.value + "facturas-de-compra", json, {headers: headersAxios.value[0]});
  let facturas_de_compra = body_facturas['data']
  
  //Traigo tipos de cobros
  const body_tipos_de_cobros = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cobro", {headers: headersAxios.value[0]})
  let tipos_de_cobros = body_tipos_de_cobros['data']


  //Traigo causa de baja de cheques
  const body_causas_de_bajas_de_cheques = await axios.get(ENDPOINT_PATH_API.value + "causa-de-baja-de-cheque", {headers: headersAxios.value[0]})
  let causas_de_bajas_de_cheques = body_causas_de_bajas_de_cheques['data']


  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validPago = ref(true);

  const cuentaRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_pagoRules = [
    v => !!v || 'Es requerido'
  ];
  const importe_de_pagoRules = [
    value => {
        if (!value) {
            return 'Es requerido'
        }
        else {
            if (value > (props.importe_de_compra*1.05) && props.controlarMontoDeImporte) {
                return 'El importe del pago esta por encima del 5% del importe de la compra '
            }
        }
    }
  ];
  const tipo_de_cobroRules = [
    v => !!v || 'Es requerido'
  ];

  const chequeRules = [
        value => {
            if (!value && (tipo_de_cobro_id.value == 3 || tipo_de_cobro_id.value == 4) && !cheque_en_cartera) {
                return 'este valor es requerido'
            }
        }
    ]


  //Valido el Formulario
  async function validate () {
    const formValidado = await formPagos.value.validate()
      if (validPago.value && ((pago.value.importe_de_pago < (props.importe_de_compra*1.05) && props.controlarMontoDeImporte) || !props.controlarMontoDeImporte)) {
        enviarFormPago()
        }    
        else {
            console.log(formValidado.valid)
        }
    }


  
  //Envio el Formulario
  async function enviarFormPago() {

    loading.value = true

    let cuenta_de_origen_id = pago.value.cuenta_de_origen.id
    if (typeof(cuenta_de_origen_id) == 'object') {
        cuenta_de_origen_id = cuenta_de_origen_id.id
    }

    let causa_de_baja_de_cheque_id = pago.value.cheque.causa_de_baja_de_cheque.id
    if (causa_de_baja_de_cheque_id != null) {    
        if (typeof(causa_de_baja_de_cheque_id) == 'object') {
        causa_de_baja_de_cheque_id = causa_de_baja_de_cheque_id.id
        }
    }
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      compra_encabezado_id: compra_encabezado_id.value,
      cuenta_de_origen_id: cuenta_de_origen_id,
      fecha_de_pago: pago.value.fecha_de_pago_f,
      importe_de_pago: pago.value.importe_de_pago,
      tipo_de_cobro_id: tipo_de_cobro_id.value,
      observaciones: pago.value.observaciones,
      user_id: user_id.value,
      facturas: facturas.value,
      cheque_id: cheque_id.value,
      cheque: {
        numero_de_cheque: pago.value.cheque.numero_de_cheque,
        //fecha_de_emision: pago.value.cheque.fecha_de_emision_f,
        fecha_inicio_de_cobro: pago.value.cheque.fecha_inicio_de_cobro_f,
        fecha_de_vencimiento: pago.value.cheque.fecha_de_vencimiento_f,
        fecha_de_cobro: cheque_pagado.value ? pago.value.cheque.fecha_de_cobro_f : null,
        causa_de_baja_de_cheque_id: causa_de_baja_de_cheque_id
        },
    });
    
    //Si pago_id = -1 creo la linea de compra sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "pago-de-compra", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      body_abm = await axios.put(ENDPOINT_PATH_API.value + "pago-de-compra/"+pago_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      body_abm = await axios.delete(ENDPOINT_PATH_API.value + "pago-de-compra/"+pago_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las pagos
    json = JSON.stringify({ 
        compra_encabezado_id: compra_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "compra-pago-listar", json, {headers: headersAxios.value[0]})
    listaPagos.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        pago_id.value = -1
        pago.value = {

            compra_encabezado_id: compra_encabezado_id.value,
            cuenta_de_origen: {
                id: null
            },
            tipo_de_cobro: {
                id: null
            },
            fecha_de_pago: null,
            importe_de_pago: null,
            observaciones: null,
            user_id: user_id.value,
            facturas: [
                {
                    factura_id: null
                }
            ],
            
            cheque: {
                numero_de_cheque: null,
                cuenta_emisora: {
                    id: null
                    },
                //fecha_de_emision: null,
                fecha_inicio_de_cobro: null,
                fecha_de_vencimiento: null,
                fecha_de_cobro: null,
                persona_que_cobro: {
                    id: null
                    },
                causa_de_baja_de_cheque: {
                    id: null
                    }
                },
        }
        cheque_pagado.value = false
        tipo_de_cobro_id_original.value = null
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMPagos.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        pago.value = item
        pago_id.value = pago.value.id        
        deshabilitarEdicionCamposABMPagos.value = false   
        facturas.value = []
        item.facturas.forEach( function(valor, indice, array) {
            facturas.value.push(valor.factura_de_compra_id)
        });    
        tipo_de_cobro_id_original.value = pago.value.tipo_de_cobro.id        
        cheque_pagado.value = pago.value.cheque?.fecha_de_cobro ? true : false
    }
    if (accion == 'B') {
        botonABM.value = 'Eliminar';     
        pago.value = item
        pago_id.value = pago.value.id   
        deshabilitarEdicionCamposABMPagos.value = true       
    }
    if (accion == 'M' || accion == 'B') {
        
        if (pago.value.tipo_de_cobro == null) {
            pago.value.tipo_de_cobro = {
                id: null
            }
        }  
          
        if (pago.value.cheque == null) {
            pago.value.cheque = {
                id: null,
                numero_de_cheque: null,
                cuenta_emisora: {
                    id: null
                    },
                //fecha_de_emision: null,
                fecha_inicio_de_cobro: null,
                fecha_de_vencimiento: null,
                fecha_de_cobro: null,
                persona_que_cobro: {
                    id: null
                    },
                causa_de_baja_de_cheque: {
                    id: null
                    }
            }
        }
        else {
            if (pago.value.cheque.causa_de_baja_de_cheque == null) {
                pago.value.cheque.causa_de_baja_de_cheque = {
                    id: null
                    }
            }


        }  
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }

  watch(
        () => pago.value.tipo_de_cobro.id,
        (newValue, oldValue) => {
            txtNotificarCambioTipoDeCobro.value = ''
            if (tipo_de_cobro_id_original.value == 2 && accionABM.value == 'M' && (newValue == 1 || newValue == 3)) {
                txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminirá el deposito cargado anteriormente'
            }
            if ((tipo_de_cobro_id_original.value == 3 || tipo_de_cobro_id_original.value == 4) && accionABM.value == 'M' && (newValue == 1 || newValue == 2)) {
                txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminará el cheque cargado anteriormente'
            }
            tipo_de_cobro_id.value = newValue
            
            if (tipo_de_cobro_id_original.value != 3 && tipo_de_cobro_id_original.value != 4) {
                cheque_id.value = null
            }
        }
    )    

    watch(
        () => cheque_en_cartera.value,
        async (newValue, oldValue) => {
          if (newValue) {
            let body_chequesencartera = await axios.get(ENDPOINT_PATH_API.value + "cheques-en-cartera", {headers: headersAxios.value[0]})
            cheques_en_cartera.value = body_chequesencartera['data']
          }
          else {
            cheque_id.value = false
          }
        }
    ) 

    watch(
        () => pago.value.cheque?.fecha_inicio_de_cobro_f,
        (newValue, oldValue) => {
            if (newValue != '' && typeof newValue === 'string') {
                pago.value.cheque.fecha_de_vencimiento_f = calcularFechaDeVencimiento(newValue)
            }
            
        }
        
    )  

    function calcularFechaDeVencimiento(fechaStr) {
        // Convertir el string a objeto de fecha
        let fechaObj = new Date(fechaStr);

        // Sumarle 29 días
        fechaObj.setDate(fechaObj.getDate() + 29);

        // Formatear la nueva fecha como string 'yyyy-mm-dd'
        let nuevaFechaStr = fechaObj.toISOString().split('T')[0];

        return nuevaFechaStr;
    }


    const importe_de_pagoTexto = computed(() => {
        let texto = ''
        let cantFirmas = props.firmasCompraCombinada?.length
        if (cantFirmas > 1) {
            if (accionABM.value == 'A') {
                let importeDividido = pago.value.importe_de_pago/cantFirmas
                importeDividido = importeDividido.toFixed(2)
                texto = 'El Importe se dividira en '+cantFirmas+' y cada uno pagará: $'+Number(importeDividido).toLocaleString("es-AR", 'ARS')
            }
            else {
                texto = 'El Importe se ha dividido en '+cantFirmas
            }
        }

        return texto
    })

    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }
</script>


<style scoped>
.checkbox_factura {
    margin-bottom: -50px;
}


</style>