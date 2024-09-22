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
                    <th class="text-left">Factura</th>
                    <th class="text-left">Fecha de Factura</th>
                    <th class="text-left">Descripcion</th>
                    <th class="text-left">Archivo</th>
                    <th class="text-left">Importe Total</th>
                    
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaFacturas"
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
                    <td>{{ item.tipo_de_factura.razon_social }} {{ item.tipo_de_factura.tipo_de_factura }} Nro: {{item.nro_de_factura}}</td>
                    <td>{{ item.fecha_de_factura }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>
                            <a :href="item.archivo" target="_blank" v-if="item.archivo">
                                <v-btn
                                class="pl-6"
                                prepend-icon="mdi-download"
                                color="default"
                                ></v-btn>
                            </a>
                    </td>
                    <td>${{ formatoNumero(item.importe_total) }}</td>
                    
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Factura</span>
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
                        ref="formFacturas"
                        v-model="validFactura"
                        lazy-validation
                    >
                        <v-row>  
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="factura.razon_social.id"
                                    :items="razones_sociales"
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    item-title="razon_social"
                                    item-value="id"
                                    label="Facturado a *"
                                    :rules="razon_socialRules"
                                    required="required"
                                ></v-select>    
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="factura.tipo_de_factura.id"
                                    :items="tipos_de_facturas"
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    item-title="tipo_de_factura"
                                    item-value="id"
                                    required="required"
                                    label="Tipo de Factura *"
                                ></v-select>     
                            </v-col>


                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.fecha_de_factura_f"
                                    :rules="fecha_de_facturaRules"
                                    label="Fecha de Factura *"
                                    type="date"
                                    required
                                ></v-text-field>  
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="4">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_total"
                                    :rules="importe_totalRules"
                                    label="Importe Total *"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                    required="required"
                                ></v-text-field-->  
                                
                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_total"
                                    :rules="importe_totalRules"
                                    :options="currencyOptions_general"
                                    label="Importe Total *"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>

                            <v-col cols="12" sm="6" md="8">                       
                                <v-btn-toggle
                                    v-model="porcentaje_de_iva"
                                    rounded="0"
                                    color="deep-purple-accent-3"
                                    group
                                    class="float-right"
                                >
                                    <div class="mx-5">IVA:</div>
                                    <v-btn :value="21">
                                    21%
                                    </v-btn>

                                    <v-btn :value="10.5">
                                    10,5%
                                    </v-btn>

                                    <v-btn :value="0">
                                    0%
                                    </v-btn>

                                    <v-text-field                          
                                        v-model="porcentaje_de_iva"
                                        label="porcentaje a calcular"
                                        suffix="%"
                                        type="number"
                                    ></v-text-field> 
                                    
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.nro_de_factura"
                                    counter="15"
                                    required="required"
                                    maxlength="15"
                                    label="Nro de Factura *"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" v-show="mostrar_otros_importes">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_neto"
                                    :rules="importeRules"
                                    label="Neto"
                                    required="required"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field--> 
                                
                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_neto"
                                    :rules="importeRules"
                                    :options="currencyOptions_general"
                                    label="Neto"
                                    required="required"
                                >
                                </MoneyField>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-show="mostrar_otros_importes">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_iva"
                                    :rules="importeRules"
                                    label="IVA"
                                    required="required"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field-->  

                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_iva"
                                    :rules="importeRules"
                                    :options="currencyOptions_general"
                                    label="IVA"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-show="mostrar_otros_importes">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_no_grabado"
                                    :rules="importeRules"
                                    label="No grabado"
                                    required="required"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field-->    

                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_no_grabado"
                                    :rules="importeRules"
                                    :options="currencyOptions_general"
                                    label="No grabado"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-show="mostrar_otros_importes">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_percepcion_iibb"
                                    :rules="importeRules"
                                    label="Retencion IIBB"
                                    required="required"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field-->   

                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_percepcion_iibb"
                                    :rules="importeRules"
                                    :options="currencyOptions_general"
                                    label="Percepcion IIBB"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-show="mostrar_otros_importes">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_percepcion_iva"
                                    :rules="importeRules"
                                    label="Percepcion IVA"
                                    required="required"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field-->   

                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe_percepcion_iva"
                                    :rules="importeRules"
                                    :options="currencyOptions_general"
                                    label="Percepcion IVA"
                                    required="required"
                                >
                                </MoneyField> 
                            </v-col>

                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="factura.archivo && !borrarArchivoDeFactura">                                
                                <div class="text-center">
                                    <a :href="factura.archivo" target="_blank">
                                    <v-btn
                                    prepend-icon="mdi-download"
                                    color="default"
                                    >
                                    Descargar Archivo
                                    </v-btn>
                                    </a>
                                </div>
                            </v-col>

                            <!-- Quitar archivo-->
                            <v-col cols="12" sm="6" md="4" v-if="factura.archivo">                                
                                <v-switch
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="borrarArchivoDeFactura"
                                    color="success"
                                    label="Borrar archivo de Factura"
                                    class="float-left"
                                ></v-switch>
                            </v-col>

                            <!-- Arvhivo carga-->
                            <v-col cols="12" sm="6" md="4">                                
                                <v-file-input
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="archivo_new"
                                    label="Cargar o reemplazar archivo"
                                ></v-file-input>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    :rules="descripcionRules"
                                    label="Descripcion"
                                    counter="150"
                                    maxlength="150"
                                    v-model="factura.descripcion"
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
  import { ref, watch } from "vue";
  import { reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';
  import MoneyField from '../components/MoneyField.vue';


  const { token, headersAxios, headersAxiosFiles, compra_encabezado_id, user_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  let factura = ref({
    tipo_de_factura: {
        id: null
    }
  })
  let factura_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMFacturas = ref(false)
  let accionABM = ref(null)
  const mostrar_otros_importes = ref(true)
  //Variables compras_encabezados
  const formFacturas = ref(null) 
  let fecha_de_factura = ref(null)
  const archivo_new = ref([])
  const porcentaje_de_iva = ref(21)
  const borrarArchivoDeFactura = ref(false)

  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

  let json = JSON.stringify({ 
      compra_encabezado_id: compra_encabezado_id.value
  });

  //Traigo las lineas de compra
  let body = await axios.post(ENDPOINT_PATH_API.value + "compra-factura-listar", json, {headers: headersAxios.value[0]});
  let listaFacturas = ref(body['data']);
          
  //Traigo tipos de facturas
  const body_tipos_de_facturas = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-factura", {headers: headersAxios.value[0]})
  let tipos_de_facturas = body_tipos_de_facturas['data']


  //Traigo razones sociales
  const body_razones_sociales = await axios.get(ENDPOINT_PATH_API.value + "razon-social", {headers: headersAxios.value[0]})
  let razones_sociales = body_razones_sociales['data']


  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validFactura = ref(true);
  
  const fecha_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const importe_totalRules = [
    v => !!v || 'Es requerido'
  ];
  const tipo_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const razon_socialRules = [
    v => !!v || 'Es requerido'
  ];
    
  const importeRules = [
    v => (!!v || v==0) || 'Es requerido'
  ];
  

/*
  let importeRules = [
    value => {
        if (!!value && accionABM.value == 'M') {
            return 'Importe es requerido'
        }
    }
    ]
*/
  //Valido el Formulario
  async function validate () {
    await formFacturas.value.validate()
    if (validFactura.value) {
        enviarFormFactura()
    }    
  }

  //Envio el Formulario
  async function enviarFormFactura() {

    loading.value = true

    /*
    let tipo_de_factura_id = factura.value.tipo_de_factura.id
    if (typeof(tipo_de_factura_id) == 'object') {
      tipo_de_factura_id = tipo_de_factura_id.id
    }
      */

    
    var formData = new FormData();
    
    formData.append("factura_id", factura_id.value)
    formData.append("compra_encabezado_id", compra_encabezado_id.value)
    formData.append("tipo_de_factura_id", factura.value.tipo_de_factura.id)
    formData.append("razon_social_id", factura.value.razon_social.id)
    formData.append("fecha_de_factura", factura.value.fecha_de_factura_f)
    formData.append("nro_de_factura", factura.value.nro_de_factura)
    formData.append("descripcion", factura.value.descripcion)
    formData.append("importe_neto", factura.value.importe_neto)
    formData.append("importe_iva", factura.value.importe_iva)
    formData.append("importe_no_grabado", factura.value.importe_no_grabado)
    formData.append("importe_percepcion_iibb", factura.value.importe_percepcion_iibb)
    formData.append("importe_percepcion_iva", factura.value.importe_percepcion_iva)
    formData.append("importe_total", factura.value.importe_total)
    formData.append("borrarArchivoDeFactura", borrarArchivoDeFactura.value)

    formData.append("archivo_new", archivo_new.value[0]);
    //files.value.forEach((value, key) => formData.append("user_file_"+(key), value[0]));
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      compra_encabezado_id: compra_encabezado_id.value,
      tipo_de_factura_id: factura.value.tipo_de_factura.id,
      razon_social: factura.value.razon_social.id,
      fecha_de_factura: factura.value.fecha_de_factura_f,
      nro_de_factura: factura.value.nro_de_factura,
      descripcion: factura.value.descripcion,
      importe_neto: factura.value.importe_neto,
      importe_iva: factura.value.importe_iva,
      importe_no_grabado: factura.value.importe_no_grabado,
      importe_percepcion_iibb: factura.value.importe_percepcion_iibb,
      importe_percepcion_iva: factura.value.importe_percepcion_iva,
      importe_total: factura.value.importe_total,
      archivo_new: archivo_new.value,
    });
    
    //Si factura_id = -1 creo la linea de compra sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "factura-compra-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "factura-compra-update", formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      body_abm = await axios.delete(ENDPOINT_PATH_API.value + "factura-compra/"+factura_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las facturas
    json = JSON.stringify({ 
        compra_encabezado_id: compra_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "compra-factura-listar", json, {headers: headersAxios.value[0]})
    listaFacturas.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        factura_id.value = -1
        factura.value = {

            compra_encabezado_id: compra_encabezado_id.value,
            razon_social: {
                id: null
            },
            tipo_de_factura: {
                id: null
            },
            fecha_de_factura: null,
            nro_de_factura: null,
            descripcion: '',
            importe_neto: 0,
            importe_iva: 0,
            importe_no_grabado: 0,
            importe_percepcion_iibb: 0,
            importe_percepcion_iva: 0,
            importe_total: 0
        }
        porcentaje_de_iva.value = 21
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMFacturas.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        factura.value = item
        calcularPorcentajeIVA()

        factura_id.value = factura.value.id        
        deshabilitarEdicionCamposABMFacturas.value = false       
    }
    if (accion == 'B') {
        botonABM.value = 'Eliminar';     
        factura.value = item
        factura_id.value = factura.value.id   
        deshabilitarEdicionCamposABMFacturas.value = true    
        calcularPorcentajeIVA()

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


    watch(
        () => factura.value.tipo_de_factura.id,
        (newValue, oldValue) => {
            mostrar_otros_importes.value = newValue == 3 ? false : true
        }
    )    

    watch(
        () => porcentaje_de_iva.value,
        (newValue, oldValue) => {   
            calcularIVA()
        }
    )  

    watch(
        () => factura.value.importe_total,
        (newValue, oldValue) => {         
            calcularIVA()
        }
    )  

    watch(
      () => factura.value.tipo_de_factura.id,
      async (newValue, oldValue) => {
        if (newValue == 3) {
          porcentaje_de_iva.value = 0
        }
      }
  )   
  function calcularIVA() {
    porcentaje_de_iva.value = Number(porcentaje_de_iva.value)
    if (porcentaje_de_iva.value > 0) {
      factura.value.importe_iva = factura.value.importe_total * (porcentaje_de_iva.value / (100 + porcentaje_de_iva.value))
      factura.value.importe_iva = factura.value.importe_iva.toFixed(2)
      factura.value.importe_neto = factura.value.importe_total - factura.value.importe_iva
      factura.value.importe_neto = factura.value.importe_neto.toFixed(2)
    }
    else {
        factura.value.importe_iva = 0
        factura.value.importe_neto = factura.value.importe_total
    }
}
    
  function calcularPorcentajeIVA() {
    if (factura.value.importe_iva > 0) {
        porcentaje_de_iva.value = ((factura.value.importe_total/(factura.value.importe_total-factura.value.importe_iva))*100)-100
        porcentaje_de_iva.value =  porcentaje_de_iva.value.toFixed(1)
    }
    else {
        porcentaje_de_iva.value = 0
    }
  }

</script>


<style scoped>
</style>