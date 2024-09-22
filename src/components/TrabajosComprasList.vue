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
                    <th class="text-left">Cuenta de origen</th>
                    <th class="text-left">Fecha de Compra</th>
                    <th class="text-left">Descripcion</th>
                    <th class="text-left">Importe de compra</th>
                    <th class="text-left">Importe Cancelado</th>
                    <th class="text-left">Factura</th>
                    <th class="text-left">Observaciones</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaCompras"
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
                    <td>{{ (item.cuenta_de_origen.numero_de_cuenta) }} {{ (item.cuenta_de_origen.banco.nombre_del_banco) }} ({{ (item.cuenta_de_origen.firma.firma) }})</td>
                    <td>{{ (item.proveedor.nombre_o_razon_social) }})</td>
                    <td>{{ item.fecha_de_compra }}</td>
                    <td>{{ item.descripcion_de_gasto }}</td>
                    <td>${{ formatoNumero(item.importe_de_compra) }}</td>
                    <td>${{ formatoNumero(item.importe_cancelado) }}</td>
                    <td>{{ item.tipo_de_factura.tipo_de_factura }} Nro: {{item.nro_de_factura}}</td>
                    <td>{{ item.observaciones }}</td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Compra o Gasto</span>
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
                        ref="formCompras"
                        v-model="validCompra"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete
                                    v-model="compra.cuenta_de_origen.id"
                                    :items="cuentas"
                                    :disabled="deshabilitarEdicionCamposABMCompras"
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
                                    v-model="compra.proveedor.id"
                                    :items="proveedores"
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    item-title="nombre_o_razon_social"
                                    item-value="id"
                                    dense
                                    filled
                                    label="Proveedor *"
                                ></v-autocomplete>      
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    v-model="compra.fecha_de_compra_f"
                                    :rules="fecha_de_compraRules"
                                    label="Fecha de Compra *"
                                    type="date"
                                    required
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    :rules="descripcion_de_gastoRules"
                                    label="Descripcion del gasto *"
                                    counter="150"
                                    maxlength="150"
                                    v-model="compra.descripcion_de_gasto"
                                    required
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    v-model="compra.importe_de_compra"
                                    :rules="importe_de_compraRules"
                                    label="Importe de Compra *"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                    required
                                ></v-text-field-->  
                                
                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    v-model="compra.importe_de_compra"
                                    :rules="importe_de_compraRules"
                                    :options="currencyOptions_general"
                                    label="Importe de Compra *"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    v-model="compra.importe_cancelado"
                                    :rules="importe_canceladoRules"
                                    label="Importe Cancelado *"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                    required
                                ></v-text-field-->   
                                
                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    v-model="compra.importe_cancelado"
                                    :rules="importe_canceladoRules"
                                    :options="currencyOptions_general"
                                    label="Importe Cancelado *"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="compra.tipo_de_factura.id"
                                    :items="tipos_de_facturas"
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    item-title="tipo_de_factura"
                                    item-value="id"
                                    label="Tipo de Factura"
                                    :rules="tipo_de_facturaRules"
                                    required
                                    return-object
                                ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    v-model="compra.nro_de_factura"
                                    counter="15"
                                    maxlength="15"
                                    label="Nro de Factura"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                
                                <v-select
                                    v-model="compra.unidad_de_negocio.id"
                                    :items="unidades_de_negocio"
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    item-title="unidad_de_negocio"
                                    item-value="id"
                                    label="Unidad de Negocio"
                                    :rules="tipo_de_facturaRules"
                                    required
                                    return-object
                                ></v-select>     

                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMCompras"
                                    label="Observaciones"
                                    counter="250"
                                    maxlength="250"
                                    v-model="compra.observaciones"
                                ></v-textarea>
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
  import { ref } from "vue";
  import { reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';
  import MoneyField from '../components/MoneyField.vue';

  const { token, headersAxios, trabajo_encabezado_id, user_id, firma_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  let compra = ref(null)
  let compra_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMCompras = ref(false)
  let accionABM = ref(null)

  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

  //Variables trabajos_encabezados
  const formCompras = ref(null) 
  let fecha_de_compra = ref(null)


  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo las lineas de trabajo
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-compra-listar", json, {headers: headersAxios.value[0]});
  let listaCompras = ref(body['data']);
          
  //Traigo cuentas
  const body_cuentas = await axios.get(ENDPOINT_PATH_API.value + "cuenta", {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']

  //Traigo tipos de facturas
  const body_tipos_de_facturas = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-factura", {headers: headersAxios.value[0]})
  let tipos_de_facturas = body_tipos_de_facturas['data']

  //Traigo unidades de negocio
  const body_unidades_de_negocio = await axios.get(ENDPOINT_PATH_API.value + "unidad-de-negocio", {headers: headersAxios.value[0]})
  let unidades_de_negocio = body_unidades_de_negocio['data']

  

  //Traigo proveedores
  const body_proveedores = await axios.get(ENDPOINT_PATH_API.value + "proveedor", {headers: headersAxios.value[0]})
  let proveedores = body_proveedores['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validCompra = ref(true);
  const cuentaRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_compraRules = [
    v => !!v || 'Es requerido'
  ];
  const importe_de_compraRules = [
    v => !!v || 'Es requerido'
  ];
  const importe_canceladoRules = [
    v => !!v || 'Es requerido'
  ];
  const descripcion_de_gastoRules = [
    v => !!v || 'Es requerido'
  ];
  const tipo_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  
  //Valido el Formulario
  async function validate () {
    await formCompras.value.validate()
    if (validCompra.value) {
        enviarFormCompra()
    }    
  }

  //Envio el Formulario
  async function enviarFormCompra() {

    loading.value = true

    let tipo_de_factura_id = compra.value.tipo_de_factura.id
    if (typeof(tipo_de_factura_id) == 'object') {
      tipo_de_factura_id = tipo_de_factura_id.id
    }

    let unidad_de_negocio_id = compra.value.unidad_de_negocio.id
    if (typeof(unidad_de_negocio_id) == 'object') {
        unidad_de_negocio_id = unidad_de_negocio_id.id
    }

    let proveedor_id = compra.value.proveedor.id
    if (typeof(proveedor_id) == 'object') {
        proveedor_id = proveedor_id.id
    }

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      firma_id: firma_id.value,
      cuenta_de_origen_id: compra.value.cuenta_de_origen.id,
      fecha_de_compra: compra.value.fecha_de_compra_f,
      descripcion_de_gasto: compra.value.descripcion_de_gasto,
      importe_de_compra: compra.value.importe_de_compra,
      importe_cancelado: compra.value.importe_cancelado,
      proveedor_id: proveedor_id,
      tipo_de_factura_id: tipo_de_factura_id,
      unidad_de_negocio_id: unidad_de_negocio_id,
      nro_de_factura: compra.value.nro_de_factura,
      observaciones: compra.value.observaciones,
      user_id: user_id.value,
      plan_de_cuenta_id: 1
    });
    
    //Si compra_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "compra", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      body_abm = await axios.put(ENDPOINT_PATH_API.value + "compra/"+compra_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      body_abm = await axios.delete(ENDPOINT_PATH_API.value + "compra/"+compra_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las compras
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-compra-listar", json, {headers: headersAxios.value[0]})
    listaCompras.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        compra_id.value = -1
        compra.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            cuenta_de_origen: {
                id: null
            },
            fecha_de_compra: null,
            descripcion_de_gasto: null,
            importe_de_compra: null,
            importe_cancelado: null,
            tipo_de_factura: {
                id: null
            },
            proveedor: {
                id: null
            },
            unidad_de_negocio: {
                id: null
            }, 
            nro_de_factura: null,
            observaciones: null,
            user_id: user_id.value
        }
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMCompras.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        compra.value = item
        compra_id.value = compra.value.id        
        deshabilitarEdicionCamposABMCompras.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            compra.value = item
            compra_id.value = compra.value.id   
            deshabilitarEdicionCamposABMCompras.value = true       
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }


    
  function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }
</script>

