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

            <!-- Inicio Tabla de Cobros -->
                <v-table>
                    <thead>
                    <tr>
                        <th class="text-left">Accion</th>
                        <th class="text-left">id</th>
                        <th class="text-left">Cobrado</th>
                        <th class="text-left">Fecha de cobro</th>
                        <th class="text-left">Persona que cobro</th>
                        <th class="text-left">Cuenta destino</th>
                        <th class="text-left">Tipo de cobro</th>
                        <th class="text-left">Importe</th>
                        <th class="text-left">Deposito de cobro</th>
                        <th class="text-left">Cheque de cobro</th>
                        <th class="text-left">Deposito Destino</th>
                        <th class="text-left">Observaciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in listaCobros"
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
                        <td>{{ (item.cobrado) }} </td>
                        <td>{{ item.fecha_de_cobro }}</td>
                        <td>{{ item.persona_que_cobro_id > 0 ? item.persona_que_cobro.name : '' }}</td>
                        <td>{{ item.cuenta_de_destino_id > 0 ? item.cuenta_de_destino.detalle_select : '' }}</td>
                        <td>{{ (item.tipo_de_cobro.tipo_de_cobro) }}</td>
                        <td>${{ (item.importe) }}</td>
                        <td>{{ item.deposito_de_cobro_id > 0 ? item.deposito_de_cobro.deposito_detalle : '' }}</td>
                        <td>{{ item.cheque_id > 0 ? item.cheque.detalle_select : '' }}</td>
                        <td>{{ item.deposito_de_destino_id > 0 ? item.deposito_de_destino.deposito_detalle : '' }}</td>
                        <td>{{ item.observaciones }}</td>
                    </tr>
                    </tbody>
                </v-table>
            <!-- Fin Tabla de Cobros -->
            
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Cobro</span>
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
                    
                    <v-form
                        ref="formCobros"
                        v-model="validCobro"
                        lazy-validation
                    >
                        <v-row>
                        
                            <!-- INICIO ENCABEZADO COBROS -->

                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.fecha_de_cobro_f"
                                        :rules="fecha_de_cobroRules"
                                        label="Fecha de Cobro *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-model="cobro.persona_que_cobro.id"
                                        :items="personas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        :rules="persona_que_cobroRules"
                                        item-title="detalle_select"
                                        item-value="id"
                                        dense
                                        required
                                        filled
                                        label="Persona que cobro *"
                                    ></v-autocomplete>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-model="cobro.cuenta_de_destino.id"
                                        :items="cuentas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="detalle_select"
                                        item-value="id"
                                        label="Cuenta destino *"
                                        :rules="cuenta_de_destinoRules"
                                        return-object
                                        required
                                    ></v-select>     
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                

                                    <v-autocomplete
                                        v-model="cobro.tipo_de_cobro.id"
                                        :items="tipos_de_cobros"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        :rules="tipo_de_cobroRules"
                                        :hint="txtNotificarCambioTipoDeCobro"
                                        item-title="tipo_de_cobro"
                                        item-value="id"
                                        dense
                                        required
                                        filled
                                        label="Tipo de Cobro *"
                                    ></v-autocomplete> 
                                </v-col>
                            <!-- FIN ENCABEZADO COBROS -->
                            
                            <!-- INICIO EFECTIVO -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="importe"
                                        :rules="importeRules"
                                        :label="tipo_de_cobro_detalle"
                                        type="number"
                                        min="0"
                                        prefix="$"
                                        required
                                    ></v-text-field>  
                                </v-col>
                            <!-- FIN EFECTIVO -->
                            
                            <!-- INICIO DEPOSITO -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 2"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.deposito_de_cobro.fecha_de_deposito_f"
                                        label="Fecha de deposito *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                            <!-- FIN DEPOSITO -->

                            <!-- INICIO CHEQUE -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 3"
                                        v-model="cobro.cheque.numero_de_cheque"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        maxlength="30"
                                        counter="30"
                                        label="Cheque"
                                    ></v-text-field>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-show="tipo_de_cobro_id == 3"
                                        v-model="cobro.cheque.banco.id"
                                        :items="bancos"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="nombre_del_banco"
                                        item-value="id"
                                        dense
                                        filled
                                        label="Banco *"
                                        required
                                    ></v-autocomplete>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 3"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_de_emision_f"
                                        label="Fecha de Emisión *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 3"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_inicio_de_cobro_f"
                                        label="Fecha de Inicio de Cobro *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 3"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_de_vencimiento_f"
                                        label="Fecha de Vencimiento *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="tipo_de_cobro_id == 3"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.cheque.fecha_de_cobro_f"
                                        label="Fecha de Cobro *"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-show="tipo_de_cobro_id == 3"
                                        v-model="cobro.cheque.persona_que_cobro.id"
                                        :items="personas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="detalle_select"
                                        item-value="id"
                                        dense
                                        filled
                                        label="Persona que cobro *"
                                        required
                                    ></v-autocomplete>      
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-show="tipo_de_cobro_id == 3"
                                        v-model="cobro.cheque.causa_de_baja_de_cheque.id"
                                        :items="causas_de_bajas_de_cheques"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="causa_de_baja_de_cheque"
                                        item-value="id"
                                        label="Causa de No Cobro"
                                        return-object
                                    ></v-select>     
                                </v-col>
                            <!-- FIN CHEQUE -->

                            <!-- INICIO DEPOSITO DESTINO -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-switch
                                        v-show="tipo_de_cobro_id != 2"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro_depositado"
                                        color="success"
                                        label="Cobro Depositado"
                                    ></v-switch>
                                </v-col>                            
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-show="cobro_depositado"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        v-model="cobro.deposito_de_destino.fecha_de_deposito_f"
                                        label="Fecha de deposito"
                                        type="date"
                                        required
                                    ></v-text-field>  
                                </v-col>                                   
                                <v-col cols="12" sm="6" md="4">
                                    <v-autocomplete
                                        v-show="cobro_depositado"
                                        v-model="cobro.deposito_de_destino.persona_que_deposito.id"
                                        :items="personas"
                                        :disabled="deshabilitarEdicionCamposABMCobros"
                                        item-title="detalle_select"
                                        item-value="id"
                                        dense
                                        filled
                                        label="Persona que Deposito *"
                                        required
                                    ></v-autocomplete>      
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-radio-group 
                                    v-model="se_deposito_destino"
                                    v-show="tipo_de_cobro_id == 3 && cobro_depositado"
                                    >
                                    <template v-slot:label>
                                        <div><strong>Se deposito</strong></div>
                                    </template>
                                    <v-radio value="deposito_destino_cheque">
                                        <template v-slot:label>
                                        <div>El Cheque</div>
                                        </template>
                                    </v-radio>
                                    <v-radio value="deposito_destino_efectivo">
                                        <template v-slot:label>
                                        <div>En Efectivo</div>
                                        </template>
                                    </v-radio>
                                    </v-radio-group>
                                </v-col>
                            <!-- FIN DEPOSITO DESTINO -->

                            
                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(facturas_de_trabajo).length>0"> 
                                    <p>Seleccione las facturas pagadas:</p>
                                    <v-checkbox class="checkbox_factura"                                    
                                    v-for="item in facturas_de_trabajo"
                                    :key="item.id"
                                    :label="'Factura nro: '+ item.nro_de_factura"
                                    :value="item.id"
                                    v-model="facturas"
                                    ></v-checkbox>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMCobros"
                                    label="Observaciones"
                                    counter="250"
                                    maxlength="250"
                                    v-model="cobro.observaciones"
                                ></v-textarea>
                            </v-col>


                        </v-row>       


                        <v-spacer></v-spacer>
                        <v-btn
                            class="ma-2"
                            color="primary"
                            @click="validate"
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
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            Cerrar  
                        </v-btn>
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
  import { ref, watch, reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';

  const { ENDPOINT_PATH_API, token, headersAxios, trabajo_encabezado_id, user_id } = useData();
  const mensaje = ref(null);
  let dialog = ref(false)
  let cobro = ref({
            tipo_de_cobro: {
                id: 1
            }})
    const obj = reactive({ count: 0 })
          
  let cobro_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMCobros = ref(false)
  let accionABM = ref(null)
  let importe = ref(null)
  let tipo_de_cobro_detalle = ref(null)
  let cobro_depositado = ref(null)
  let se_deposito_destino = ref(null)
  let tipo_de_cobro_id = ref(1)
  let tipo_de_cobro_id_original = ref(null)
  let txtNotificarCambioTipoDeCobro = ref(null)
  //Variables trabajos_encabezados
  const formCobros = ref(null) 
  let facturas = ref([])

  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo los Cobros
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-cobro-listar", json, {headers: headersAxios.value[0]});
  let listaCobros = ref(body['data']);
          
  //Traigo personas
  const body_personas = await axios.get(ENDPOINT_PATH_API.value + "persona", {headers: headersAxios.value[0]})
  let personas = body_personas['data']
          
  //Traigo cuentas
  const body_cuentas = await axios.get(ENDPOINT_PATH_API.value + "cuenta", {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']

  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas = body_firmas['data']

  //Traigo bancos
  const body_bancos = await axios.get(ENDPOINT_PATH_API.value + "banco", {headers: headersAxios.value[0]})
  let bancos = body_bancos['data']

  //Traigo causa de baja de cheques
  const body_causas_de_bajas_de_cheques = await axios.get(ENDPOINT_PATH_API.value + "causa-de-baja-de-cheque", {headers: headersAxios.value[0]})
  let causas_de_bajas_de_cheques = body_causas_de_bajas_de_cheques['data']

  //Traigo tipos de cobros
  const body_tipos_de_cobros = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cobro", {headers: headersAxios.value[0]})
  let tipos_de_cobros = body_tipos_de_cobros['data']

  //Traigo las facturas
  let body_facturas = await axios.post(ENDPOINT_PATH_API.value + "facturas-de-trabajo", json, {headers: headersAxios.value[0]});
  let facturas_de_trabajo = body_facturas['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validCobro = ref(true);
  const fecha_de_cobroRules = [
    v => !!v || 'Es requerido'
  ];
  const cuenta_de_destinoRules = [
    v => !!v || 'Es requerido'
  ];
  const persona_que_cobroRules = [
    v => !!v || 'Es requerido'
  ];
  const tipo_de_cobroRules = [
    v => !!v || 'Es requerido'
  ];
  const importeRules = [
    v => !!v || 'Es requerido'
  ];

  //Valido el Formulario
  async function validate () {
    await formCobros.value.validate()
    if (validCobro.value) {
        enviarFormCobro()
    }    
  }
  
  //Envio el Formulario
  async function enviarFormCobro() {

    let cuenta_de_destino_id = cobro.value.cuenta_de_destino.id
    if (typeof(cuenta_de_destino_id) == 'object') {
      cuenta_de_destino_id = cuenta_de_destino_id.id
    }
        
    let causa_de_baja_de_cheque_id = cobro.value.cheque.causa_de_baja_de_cheque.id
    if (causa_de_baja_de_cheque_id != null) {    
        if (typeof(causa_de_baja_de_cheque_id) == 'object') {
        causa_de_baja_de_cheque_id = causa_de_baja_de_cheque_id.id
        }
    }

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      fecha_de_cobro: cobro.value.fecha_de_cobro_f,
      persona_que_cobro_id: cobro.value.persona_que_cobro.id,
      cuenta_de_destino_id: cuenta_de_destino_id,
      tipo_de_cobro_id: tipo_de_cobro_id.value,
      observaciones: cobro.value.observaciones,
      importe: importe.value,
      deposito_de_cobro: {
        fecha_de_deposito: cobro.value.deposito_de_cobro.fecha_de_deposito_f
        },
      cheque: {
        numero_de_cheque: cobro.value.cheque.numero_de_cheque,
        banco_id: cobro.value.cheque.banco.id,
        fecha_de_emision: cobro.value.cheque.fecha_de_emision_f,
        fecha_inicio_de_cobro: cobro.value.cheque.fecha_inicio_de_cobro_f,
        fecha_de_vencimiento: cobro.value.cheque.fecha_de_vencimiento_f,
        fecha_de_cobro: cobro.value.cheque.fecha_de_cobro_f,
        persona_que_cobro_id: cobro.value.cheque.persona_que_cobro.id,
        causa_de_baja_de_cheque_id: causa_de_baja_de_cheque_id
        },
      cobro_depositado: cobro_depositado.value,
      deposito_de_destino: {
        fecha_de_deposito: cobro.value.deposito_de_destino.fecha_de_deposito_f,
        persona_que_deposito_id: cobro.value.deposito_de_destino.persona_que_deposito.id,
        se_deposito_destino: se_deposito_destino.value
      },
      user_id: user_id.value,
      facturas: facturas.value
    });
    
    //Si cobro_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "cobro", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      body_abm = await axios.put(ENDPOINT_PATH_API.value + "cobro/"+cobro_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      body_abm = await axios.delete(ENDPOINT_PATH_API.value + "cobro/"+cobro_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las cobros
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-cobro-listar", json, {headers: headersAxios.value[0]})
    listaCobros.value = body['data'];

    getTime()
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        cobro_id.value = -1
        importe.value = null
        cobro_depositado.value = false
        se_deposito_destino.value = null
        tipo_de_cobro_id_original.value = null
        cobro.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            fecha_de_cobro: null,
            persona_que_cobro: {
                id: null
            },
            cuenta_de_destino: {
                id: null
            },
            tipo_de_cobro: {
                id: null
            },
            observaciones: null,
            deposito_de_cobro: {
                id: null,
                fecha_de_deposito: null,
                fecha_de_deposito_f: null
                },
            cheque: {
                numero_de_cheque: null,
                banco: {
                    id: null
                    },
                fecha_de_emision: null,
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
            deposito_de_destino: {
                fecha_de_deposito: null,
                importe: null,
                persona_que_deposito: {
                    id: null
                    }                
            },
            user_id: user_id.value,
            facturas: [
                {
                    factura_id: null
                }
            ],

        }
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMCobros.value = false    
        
    }
    else {
        cobro.value = item
        cobro_id.value = cobro.value.id 
        importe.value = cobro.value.importe   
        tipo_de_cobro_id_original.value = cobro.value.tipo_de_cobro.id
        if (cobro.value.persona_que_cobro == null) {
            cobro.value.persona_que_cobro = {
                id: null
            }
        }  
        if (cobro.value.cuenta_de_destino == null) {
            cobro.value.cuenta_de_destino = {
                id: null
            }
        }  
        if (cobro.value.tipo_de_cobro == null) {
            cobro.value.tipo_de_cobro = {
                id: null
            }
        }  
        if (cobro.value.deposito_de_cobro == null) {
            cobro.value.deposito_de_cobro = {
                id: null,
                fecha_de_deposito: null,
                fecha_de_deposito_f: null
            }
        }  
        if (cobro.value.cheque == null) {
            cobro.value.cheque = {
                id: null,
                numero_de_cheque: null,
                banco: {
                    id: null
                    },
                fecha_de_emision: null,
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
            if (cobro.value.cheque.causa_de_baja_de_cheque == null) {
                cobro.value.cheque.causa_de_baja_de_cheque = {
                    id: null
                    }
            }


        }  
        if (cobro.value.deposito_de_destino == null) {
            cobro.value.deposito_de_destino = {
                id: null,
                fecha_de_deposito: null,
                persona_que_deposito: {
                    id: null
                    },
                se_deposito_destino: null
            }
            se_deposito_destino.value = null
            cobro_depositado.value = false

        }
        else {
                cobro_depositado.value = true
                if (cobro.value.deposito_de_destino.cheque == null) {
                    se_deposito_destino.value = 'deposito_destino_efectivo'
                }
                else {
                    se_deposito_destino.value = 'deposito_destino_cheque'
                }
        }
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        
        facturas.value = []
        item.facturas.forEach( function(valor, indice, array) {
            facturas.value.push(valor.factura_id)
        });

        deshabilitarEdicionCamposABMCobros.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            deshabilitarEdicionCamposABMCobros.value = true       
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 10 * 1000)

  }


    function traerImporte() {
        if (cobro.value.tipo_de_cobro.id == 1) {
            importe.value = cobro.importe
            tipo_de_cobro_detalle.value = 'Importe efectivo'
        }
        if (cobro.value.tipo_de_cobro.id == 2) {
            importe.value = cobro.deposito_destino.importe
            tipo_de_cobro_detalle.value = 'Importe depositado'
        }
        if (cobro.value.tipo_de_cobro.id == 3) {
            importe.value = cobro.cheque.importe
            tipo_de_cobro_detalle.value = 'Importe del cheque'
        }

        return importe.value
    }
    
    /*
    // watch works directly on a ref
    watch(tipo_de_cobro_id_original, async (newValue, oldValue) => {
        if (newValue == 2 && accionABM.value == 'M') {
            txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminirá el deposito cargado anteriormente'
        }
        if (newValue == 3 && accionABM.value == 'M') {
            txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminará el cheque cargado anteriormente'
        }
        tipo_de_cobro_id.value = newValue
    })
    */ 
    watch(
        () => cobro.value.tipo_de_cobro.id,
        (newValue, oldValue) => {
            txtNotificarCambioTipoDeCobro.value = ''
            if (tipo_de_cobro_id_original.value == 2 && accionABM.value == 'M' && (newValue == 1 || newValue == 3)) {
                txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminirá el deposito cargado anteriormente'
            }
            if (tipo_de_cobro_id_original.value == 3 && accionABM.value == 'M' && (newValue == 1 || newValue == 2)) {
                txtNotificarCambioTipoDeCobro.value = 'Este cambio, eliminará el cheque cargado anteriormente'
            }
            tipo_de_cobro_id.value = newValue
        }
    )    

</script>



<style scoped>
.checkbox_factura {
    margin-bottom: -50px;
}
</style>