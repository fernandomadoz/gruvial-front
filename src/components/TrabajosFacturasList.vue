<template>

    <v-dialog
      v-model="dialog"
      persistent
    >
        <template v-slot:activator="{ props }">

              <v-alert type="success" v-show="mensaje != null">{{ mensaje }}</v-alert>
              <hr  v-show="mensaje != null" />    
            <v-row>
                <v-col cols="12" sm="6" md="2">
                    <v-btn
                        size="small"
                        color="yellow"
                        v-bind="props"
                        @click="ABMLinea('A', null)"
                        >Insertar
                    </v-btn> 
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                    <v-switch
                        v-model="mostrar_facturas_pagadas"
                        label="Mostrar facturas pagadas?"
                        color="success"
                    ></v-switch>
                </v-col>
            </v-row>

            <v-table>
                <thead>
                <tr>
                    <th class="text-left">Accion</th>
                    <th class="text-left">id</th>
                    <th class="text-left">Razon Social</th>
                    <th class="text-left">Factura</th>
                    <th class="text-left">Fecha de Factura</th>
                    <th class="text-left">Descripcion</th>
                    <th class="text-left">Archivo</th>
                    <th class="text-left">Importe Total</th>
                    <th class="text-left">Importe Cobrado</th>
                    <th class="text-left">Resta Cobrar</th>
                    
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaFacturas"
                    :key="item.id"
                    v-bind:class="{ nopagado: !item.factura_saldada, pagado: item.factura_saldada }"
                    v-show="!item.factura_saldada || (item.factura_saldada && mostrar_facturas_pagadas)"
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
                    <td>{{ (item.razon_social.razon_social) }} </td>
                    <td>{{ item.tipo_de_factura.tipo_de_factura }} Nro: {{item.nro_de_factura}}</td>
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
                    <td>${{ formatoNumero(item.importe_cobrado) }}</td>
                    <td>${{ formatoNumero(item.importe_restante_a_cobrar) }}</td>
                    
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
                                    label="Razon Social *"
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
                        </v-row>
                            
                        <v-row v-if="factura.tipo_de_factura.id==7">
                            <v-col cols="12" sm="12" md="12">
                                <v-select
                                    v-model="factura.factura_cancelada_id"
                                    :items="facturasPorTrabajo"
                                    item-title="detalle_select"
                                    item-value="id"
                                    label="Indica la factura donde aplicaras el crédito"
                                ></v-select>     
                            </v-col>
                        </v-row>
                            
                        <v-row>
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
                            <v-col cols="12" sm="6" md="4">
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
                            <v-col cols="12" sm="6" md="4">
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
                            
                            <v-col cols="12" sm="6" md="4">
                                <v-switch
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="anulada"
                                    color="success"
                                    label="Anulada"
                                ></v-switch>
                            </v-col>

                            <!-- Arvhivo mostrar-->
                            <v-col cols="12" sm="6" md="4" v-if="factura.archivo">                                
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

                            <!-- Arvhivo carga-->
                            <v-col cols="12" sm="6" md="4">                                
                                <v-file-input
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="archivo_new"
                                    label="Cargar o reemplazar archivo"
                                ></v-file-input>
                            </v-col>

                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(remitos_de_trabajo).length>0"> 
                                    <p>Seleccione los remitos facturados:</p>
                                    <v-checkbox class="checkbox_remito"                                    
                                    v-for="item in remitos_de_trabajo"
                                    :key="item.id"
                                    :label="'Remito nro: '+ item.nro_de_remito"
                                    :value="item.id"
                                    v-model="remitos"
                                    v-show="!item.remito_facturado || remitos.includes(item.id) || mostrarRemitosOk"
                                    ></v-checkbox>
                            </v-col>

                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(remitos_de_trabajo).length>0"> 
                                <v-switch v-model="mostrarRemitosOk" label="Mostrar todos los remitos" color="success"></v-switch>
                            </v-col>

                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(lineas_de_trabajo).length>0"> 
                                    <p>Seleccione los servicios facturados:</p>
                                    <v-checkbox class="checkbox_remito"                                    
                                    v-for="item in lineas_de_trabajo"
                                    :key="item.id"
                                    :label="item.fecha_inicio +' '+item.maquina?.nombre_de_maquina + ' $'+item.importe "
                                    :value="item.id"
                                    v-model="lineas"
                                    v-show="!item.linea_facturada || lineas.includes(item.id) || mostrarLineasOk"
                                    ></v-checkbox>
                            </v-col>

                            
                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(lineas_de_trabajo).length>0"> 
                                <v-switch v-model="mostrarLineasOk" label="Mostrar todos los servicios" color="success"></v-switch>
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
                            loading.value = false
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
  import { ref, watch } from "vue";
  import { reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';
  import MoneyField from '../components/MoneyField.vue';

  const { token, headersAxios, headersAxiosFiles, trabajo_encabezado_id, user_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  const factura = ref(null)
  let factura_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMFacturas = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  let lineas = ref([])
  //Variables trabajos_encabezados
  const formFacturas = ref(null) 
  let fecha_de_factura = ref(null)
  const archivo_new = ref([])
  const anulada = ref(false)
  const facturasPorTrabajo = ref([])
  const mostrarRemitosOk = ref(false)
  const mostrarLineasOk = ref(false)
  const mostrar_facturas_pagadas = ref(false)

  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo las lineas de trabajo
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-factura-listar", json, {headers: headersAxios.value[0]});
  let listaFacturas = ref(body['data']);
          
  //Traigo razones sociales
  const body_razones_sociales = await axios.get(ENDPOINT_PATH_API.value + "razon-social", {headers: headersAxios.value[0]})
  let razones_sociales = body_razones_sociales['data']

  //Traigo tipos de facturas
  const body_tipos_de_facturas = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-factura", {headers: headersAxios.value[0]})
  let tipos_de_facturas = body_tipos_de_facturas['data']

  //Traigo los remitos
  let body_remitos = await axios.post(ENDPOINT_PATH_API.value + "remitos-de-trabajo", json, {headers: headersAxios.value[0]});
  let remitos_de_trabajo = body_remitos['data']

  //Traigo los remitos
  let body_lineas = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea-listar", json, {headers: headersAxios.value[0]});
  let lineas_de_trabajo = body_lineas['data']


  //Traigo los facturas por trabajo
  let jsonTrabajos = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value,
    })
  let body_facturasPorTrabajo = await axios.post(ENDPOINT_PATH_API.value + "facturas-por-trabajo", jsonTrabajos, {headers: headersAxios.value[0]})
  facturasPorTrabajo.value = body_facturasPorTrabajo['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validFactura = ref(true);
  const razon_socialRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const importe_totalRules = [
    v => !!v || 'Es requerido'
  ];
  const tipo_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const descripcionRules = [
    //v => !!v || 'Es requerido'
  ];
  
  const importeRules = [
    //v => (!!v || v==0 || accionABM.value == 'B') || 'Es requerido'
    v => !!v || 'Es requerido'
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

    let anulada_sino = tf_a_sino(anulada.value)
    console.log('anulada_sino')
    console.log(anulada_sino)


    
    var formData = new FormData();
    
    formData.append("factura_id", factura_id.value)
    formData.append("trabajo_encabezado_id", trabajo_encabezado_id.value)
    formData.append("razon_social_id", factura.value.razon_social.id)
    formData.append("tipo_de_factura_id", factura.value.tipo_de_factura.id)
    formData.append("fecha_de_factura", factura.value.fecha_de_factura_f)
    formData.append("factura_cancelada_id", factura.value.factura_cancelada_id)
    formData.append("nro_de_factura", factura.value.nro_de_factura)
    formData.append("descripcion", factura.value.descripcion)
    formData.append("importe_neto", factura.value.importe_neto)
    formData.append("importe_iva", factura.value.importe_iva)
    formData.append("importe_total", factura.value.importe_total)
    formData.append("anulada", anulada_sino)
    formData.append("remitos", remitos.value)
    formData.append("lineas", lineas.value)

    formData.append("archivo_new", archivo_new.value[0]);
    //files.value.forEach((value, key) => formData.append("user_file_"+(key), value[0]));
    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      razon_social_id: factura.value.razon_social.id,
      tipo_de_factura_id: factura.value.tipo_de_factura.id,
      fecha_de_factura: factura.value.fecha_de_factura_f,
      factura_cancelada_id: factura.value.factura_cancelada_id,
      nro_de_factura: factura.value.nro_de_factura,
      descripcion: factura.value.descripcion,
      importe_neto: factura.value.importe_neto,
      importe_iva: factura.value.importe_iva,
      importe_total: factura.value.importe_total,
      anulada: anulada_sino,
      remitos: remitos.value,
      lineas: lineas.value,
      archivo_new: archivo_new.value
    });
    
    //Si factura_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''

    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "factura-create", formData, {headers: headersAxiosFiles.value[0]})
    }

    if (accionABM.value == 'M') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "factura-update", formData, {headers: headersAxiosFiles.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      body_abm = await axios.delete(ENDPOINT_PATH_API.value + "factura/"+factura_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las facturas
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-factura-listar", json, {headers: headersAxios.value[0]})
    listaFacturas.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        factura_id.value = -1
        
        remitos.value = []
        lineas.value = []

        factura.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            razon_social: {
                id: null
            },
            tipo_de_factura: {
                id: null
            },
            fecha_de_factura: null,
            nro_de_factura: null,
            factura_cancelada_id: null,
            descripcion: '',
            importe_neto: 0,
            importe_iva: 0,
            importe_total: 0,
            remitos: [
                {
                    trabajo_linea_id: null
                },
            ],
            lineas: [
                {
                    trabajo_linea_id: null
                },
            ],
        }
        anulada.value = false
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMFacturas.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        factura.value = item
        
        
        remitos.value = []
        item.remitos.forEach( function(valor, indice, array) {
            remitos.value.push(valor.remito_id)
        });
        
        lineas.value = []
        item.lineas.forEach( function(valor, indice, array) {
            lineas.value.push(valor.trabajo_linea_id)
        });
        
        factura_id.value = factura.value.id        
        deshabilitarEdicionCamposABMFacturas.value = false
        anulada.value = sino_a_tf(factura.value.anulada)

    }
    if (accion == 'B') {
        botonABM.value = 'Eliminar';     
        factura.value = item
        factura_id.value = factura.value.id   
        deshabilitarEdicionCamposABMFacturas.value = true       
        anulada.value = sino_a_tf(factura.value.anulada)

    }
  }



  function sino_a_tf(sino) {
    return sino == 'SI' ? true : false
  }
  function tf_a_sino(tf) {
    return tf ? 'SI' : 'NO'
  }

  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }


  function calcularIVA() {
    factura.value.importe_iva = factura.value.importe_total * (21 / (100 + 21))
    factura.value.importe_iva = factura.value.importe_iva.toFixed(2)
    factura.value.importe_neto = factura.value.importe_total - factura.value.importe_iva
    factura.value.importe_neto = factura.value.importe_neto.toFixed(2)

  }
  
  watch(
        () => factura.value?.importe_total,
        (newValue, oldValue) => {
            if (newValue>0) {
                calcularIVA()
            }
        }
    )   

  watch(
        () => factura.value?.factura_cancelada_id,
        (newValue, oldValue) => {
            for (const fact of facturasPorTrabajo.value) {
                console.log('entro 1')
                if (fact.id==factura.value.factura_cancelada_id) {
                    console.log('entro 2')
                    factura.value.importe_total = fact.importe_total
                }
            }
        }
    )   

    
    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }

</script>


<style scoped>
.checkbox_remito {
    margin-bottom: -50px;
}

.nopagado {
  background-color: #ffbdc3;
}
.pagado {
  background-color: #c4ffbd;
}
</style>