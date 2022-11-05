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
                    <th class="text-left">Razon Social</th>
                    <th class="text-left">Factura</th>
                    <th class="text-left">Fecha de Factura</th>
                    <th class="text-left">Descripcion</th>
                    <th class="text-left">Importe de factura</th>
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
                    <td>{{ (item.razon_social.razon_social) }} </td>
                    <td>{{ item.tipo_de_factura.tipo_de_factura }} Nro: {{item.nro_de_factura}}</td>
                    <td>{{ item.fecha_de_factura }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>${{ item.importe }}</td>
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
                                    label="Razon Social"
                                    :rules="razon_socialRules"
                                    required
                                    return-object
                                ></v-select>    
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="factura.tipo_de_factura.id"
                                    :items="tipos_de_facturas"
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    item-title="tipo_de_factura"
                                    item-value="id"
                                    label="Tipo de Factura"
                                    return-object
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
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.nro_de_factura"
                                    counter="15"
                                    maxlength="15"
                                    label="Nro de Factura"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    v-model="factura.importe"
                                    :rules="importeRules"
                                    label="Importe de Factura *"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                    required
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-show="Object.keys(remitos_de_trabajo).length>0"> 
                                    <p>Seleccione los remitos facturados:</p>
                                    <v-checkbox class="checkbox_remito"                                    
                                    v-for="item in remitos_de_trabajo"
                                    :key="item.id"
                                    :label="'Remito nro: '+ item.nro_de_remito"
                                    :value="item.id"
                                    v-model="remitos"
                                    ></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMFacturas"
                                    :rules="descripcionRules"
                                    label="Descripcion *"
                                    counter="150"
                                    maxlength="150"
                                    v-model="factura.descripcion"
                                    required
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
  import { ref } from "vue";
  import { reactive } from "vue";
  import axios from "axios";
  import { useData } from '../composables/useData';
  import router from "@/router";
  import { isProxy, toRaw } from 'vue';

  const { ENDPOINT_PATH_API, token, headersAxios, trabajo_encabezado_id, user_id } = useData();
  const error = ref(false);
  const mensaje = ref(null);
  let dialog = ref(false)
  let factura = ref(null)
  let factura_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMFacturas = ref(false)
  let accionABM = ref(null)
  let remitos = ref([])
  //Variables trabajos_encabezados
  const formFacturas = ref(null) 
  let fecha_de_factura = ref(null)


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

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validFactura = ref(true);
  const razon_socialRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const importe_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const tipo_de_facturaRules = [
    v => !!v || 'Es requerido'
  ];
  const descripcionRules = [
    v => !!v || 'Es requerido'
  ];
  const importeRules = [
    v => !!v || 'Es requerido'
  ];

  //Valido el Formulario
  async function validate () {
    await formFacturas.value.validate()
    if (validFactura.value) {
        enviarFormFactura()
    }    
  }

  //Envio el Formulario
  async function enviarFormFactura() {

    let tipo_de_factura_id = factura.value.tipo_de_factura.id
    if (typeof(tipo_de_factura_id) == 'object') {
      tipo_de_factura_id = tipo_de_factura_id.id
    }

    let razon_social_id = factura.value.razon_social.id
    if (typeof(razon_social_id) == 'object') {
        razon_social_id = razon_social_id.id
    }


    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      razon_social_id: razon_social_id,
      tipo_de_factura_id: tipo_de_factura_id,
      fecha_de_factura: factura.value.fecha_de_factura_f,
      nro_de_factura: factura.value.nro_de_factura,
      descripcion: factura.value.descripcion,
      importe: factura.value.importe,
      remitos: remitos.value
    });
    
    //Si factura_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "factura", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      body_abm = await axios.put(ENDPOINT_PATH_API.value + "factura/"+factura_id.value, json, {headers: headersAxios.value[0]})
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
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        factura_id.value = -1
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
            descripcion: null,
            importe: null,
            remitos: [
                {
                    trabajo_linea_id: null
                }
            ],
        }
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMFacturas.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        factura.value = item
        
        
        remitos.value = []
        item.remitos.forEach( function(valor, indice, array) {
            remitos.value.push(valor.trabajo_linea_id)
        });
        
        factura_id.value = factura.value.id        
        deshabilitarEdicionCamposABMFacturas.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            factura.value = item
            factura_id.value = factura.value.id   
            deshabilitarEdicionCamposABMFacturas.value = true       
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }


</script>


<style scoped>
.checkbox_remito {
    margin-bottom: -50px;
}
</style>