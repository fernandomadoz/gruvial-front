<template>
  
    <v-card v-bind:title="estado" v-bind:class="{ nopagado: !pagado, pagado: pagado  }" subtitle="" style="margin-bottom: 20px;"></v-card>
    <v-card v-bind:title="titulo" subtitle=""></v-card>

    <div class="d-flex my-2 ">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-chip class="w-100" size="x-large" label prepend-icon="mdi-hammer-wrench">Servicios Realizados: <span class="text-blue pl-3">${{ formatoNumero(importeLineas) }}</span></v-chip>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-chip class="w-100" size="x-large" label prepend-icon="mdi-text-box-outline">Total Facturado: <span class="text-blue pl-3">${{ formatoNumero(importeFacturas) }}</span></v-chip>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-chip class="w-100" size="x-large" label prepend-icon="mdi-currency-usd">Total Cobrado: <span class="text-blue pl-3">${{ formatoNumero(importeCobros) }}</span></v-chip>
        </v-col>
      </v-row>
    </div>
    
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Encabezado</v-tab>
        <v-tab value="Servicios" v-if="trabajo_encabezado_id!=-1">Servicios</v-tab>
        <v-tab value="Gastos" v-if="trabajo_encabezado_id!=-1">Compras o Gastos</v-tab>
        <v-tab value="Cobros" v-if="trabajo_encabezado_id!=-1">Cobros</v-tab>
        <v-tab value="Facturas" v-if="trabajo_encabezado_id!=-1">Facturas</v-tab>
        <v-tab value="Remitos" v-if="trabajo_encabezado_id!=-1">Remitos</v-tab>
        <v-tab value="Notas" v-if="trabajo_encabezado_id!=-1">Notas</v-tab>
        <v-tab value="Documentos" v-if="trabajo_encabezado_id!=-1">Documentos</v-tab>
        <v-tab value="Cotizaciones" v-if="trabajo_encabezado_id!=-1">Cotizaciones</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">

          <v-window-item value="Encabezado">
            <v-form
              ref="formEncabezado"
              v-model="valid"
              lazy-validation
            >
              <v-row>

                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="firma_id_trabajo"
                    :items="firmas2"
                    item-title="firma"
                    item-value="id"
                    label="Firma"
                    return-object
                    :rules="firmaRules"
                    required
                  ></v-select>    
                </v-col>

                <v-col cols="12" sm="12" md="8" v-show="!nuevoCliente">
                  <v-autocomplete
                    v-model="cliente_id"
                    :items="clientes"
                    item-title="detalle_select"
                    item-value="id"
                    dense
                    filled
                    label="Cliente"
                    :rules="clienteRules"
                    required
                  ></v-autocomplete>    
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="nuevoCliente"
                    label="Cliente nuevo?"
                    color="success"
                  ></v-switch>
                </v-col>

                <v-col cols="12" sm="6" md="8">
                  <v-switch
                    v-show="nuevoCliente"
                    v-model="es_consumidor_final"
                    label="Es consumidor final?"
                    color="success"
                  ></v-switch>
                </v-col>
                
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente">
                  <v-autocomplete
                    v-model="tipo_de_cliente_id"
                    :items="tipos_de_clientes"
                    :rules="tipo_de_clienteRules"
                    item-title="tipo_de_cliente"
                    item-value="id"
                    dense
                    filled
                    label="Tipo de Cliente *"
                  ></v-autocomplete> 
                </v-col>

                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente">
                  <v-text-field
                    v-model="nombre_o_razon_social"
                    :rules="nombre_o_razon_socialRules"
                    counter="80"
                    clearable
                    label="Nombre o Razon Social *"
                  ></v-text-field>           
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente">
                  <v-text-field
                    v-model="telefonos"
                    counter="80"
                    clearable
                    label="Telefonos"
                  ></v-text-field>   
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente && !es_consumidor_final">
                  <v-text-field
                    v-model="cuit_o_cuil"
                    counter="11"
                    type="number"
                    clearable
                    :rules="cuit_o_cuilRules"
                    label="CUIT o CUIL"
                  ></v-text-field>            
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente && !es_consumidor_final">
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    required
                  ></v-text-field> 
                </v-col>

                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente && es_consumidor_final">
                  <v-autocomplete
                    v-model="barrio_id"
                    :items="barrios"
                    item-title="barrio"
                    item-value="id"
                    dense
                    filled
                    label="Barrio"
                  ></v-autocomplete> 
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente">
                  <v-text-field
                    v-model="direccion"
                    counter="200"
                    clearable
                    label="Direccion"
                  ></v-text-field>       
                </v-col>
                
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente">
                  <v-autocomplete
                    v-model="condicion_iva_id"
                    :items="condiciones_iva"
                    item-title="condicion_iva"
                    item-value="id"
                    dense
                    filled
                    label="Condicion IVA"
                  ></v-autocomplete> 
                </v-col>

                

              </v-row>

              <v-row>
                
                <v-col cols="12" sm="12" md="4" class="p-0 m-0">
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                        v-model="fecha_inicio"
                        :rules="fecha_inicioRules"
                        label="Fecha de Inicio"
                        type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-select
                      v-model="origen_de_leed_id"
                      :items="origenes"
                      item-title="origen"
                      item-value="id"
                      label="Como nos conoció?"
                    ></v-select>    
                  </v-col>
                </v-col>

                
                <v-col cols="12" sm="6" md="8">
                  <v-textarea
                    label="Observaciones"
                    v-model="observaciones"
                  ></v-textarea>
                </v-col>

              </v-row>
              <v-alert :type="hasError ? 'warning' : 'success'" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>

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
                Guardar  
              </v-btn>

              <v-progress-circular
                indeterminate
                color="amber"
                v-show="loading"
              ></v-progress-circular>
              <hr>

              <v-row v-if="trabajo_encabezado_id != -1">
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="trabajo_cancelado"
                    label="Cancelar trabajo"
                    color="error"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="8" v-show="trabajo_cancelado">
                  <v-textarea
                    label="observaciones de cancelación"
                    v-model="observaciones_de_cancelacion"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row v-show="trabajo_cancelado && !fecha_de_cancelacion">
                <v-col cols="12" sm="12" md="12" v-show="trabajo_cancelado">
                  `<v-btn
                    class="ma-2"
                    color="primary"
                    @click="validate"
                    :disabled="loading"
                  >
                    <v-icon
                      start
                      icon="mdi-content-save"
                    ></v-icon>
                    Guardar Cancelación 
                  </v-btn>`

                  <v-progress-circular
                    indeterminate
                    color="amber"
                    v-show="loading"
                  ></v-progress-circular>
                  
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          

          <v-window-item value="Servicios" v-if="trabajo_encabezado_id!=-1">
            <TrabajosLineasList />
          </v-window-item>

          <v-window-item value="Gastos" v-if="trabajo_encabezado_id!=-1">
            <TrabajosComprasList />
          </v-window-item>

          <v-window-item value="Cobros" v-if="trabajo_encabezado_id!=-1">
            <TrabajosCobrosList />
          </v-window-item>

          <v-window-item value="Facturas" v-if="trabajo_encabezado_id!=-1">
            <TrabajosFacturasList />
          </v-window-item>

          <v-window-item value="Remitos" v-if="trabajo_encabezado_id!=-1">
            <TrabajosRemitosList />
          </v-window-item>

          <v-window-item value="Notas" v-if="trabajo_encabezado_id!=-1">
            <TrabajosNotasList />            
          </v-window-item>

          <v-window-item value="Documentos" v-if="trabajo_encabezado_id!=-1">
            <TrabajosDocumentosList />            
          </v-window-item>

          <v-window-item value="Cotizaciones" v-if="trabajo_encabezado_id!=-1">
            <TrabajosCotizacionesList />            
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>
    
  <!--v-card style="padding: 20px">{{trabajo_encabezado}}</v-card>
  <v-card style="padding: 20px">{{clientes}}</v-card-->




  
</template> 
 
<script setup> 
  import axios from "axios"
  import { useData } from '../composables/useData'
  import router from "../router"
  import { onMounted } from 'vue'
  import { ref, watch } from "vue"
  import "bootstrap/dist/css/bootstrap.min.css"

  // Components
  import TrabajosLineasList from '../components/TrabajosLineasList.vue';
  import TrabajosComprasList from '../components/TrabajosComprasList.vue';
  import TrabajosCobrosList from '../components/TrabajosCobrosList.vue';
  import TrabajosFacturasList from '../components/TrabajosFacturasList.vue';
  import TrabajosRemitosList from '../components/TrabajosRemitosList.vue';
  import TrabajosNotasList from '../components/TrabajosNotasList.vue';
  import TrabajosDocumentosList from '../components/TrabajosDocumentosList.vue';
  import TrabajosCotizacionesList from '../components/TrabajosCotizacionesList.vue';
  

  const props = defineProps({
    trabajo_id: {
          type: Number,
          default: null
      },
    tab: {
          type: String,
          default: null
      },
  })
  
  onMounted(() => {
    tab.value = props.tab ? props.tab : 'Encabezado'

  })

  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, trabajo_encabezado_id, setearTrabajoEncabezadoId } = useData()
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  let trabajo_encabezado = ref([])
  let titulo = ''
  let tab = ref('one')
  const nuevoCliente = ref(false)
  const loading = ref(false)
  const hasError = ref(false)

  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma-por-usuario", {headers: headersAxios.value[0]})
  let firmas2 = body_firmas['data']

  

  //Traigo Origenes
  let body_origenes = await axios.get(ENDPOINT_PATH_API.value + "origen-de-leed", {headers: headersAxios.value[0]})
  let origenes = ref(body_origenes['data'])

  //Traigo clientes
  let body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
  let clientes = ref(body_clientes['data'])

  //Traigo barrios
  const body_barrios = await axios.get(ENDPOINT_PATH_API.value + "barrio", {headers: headersAxios.value[0]})
  let barrios = ref(body_barrios['data'])

  //Traigo Tipos de Clientes
  const body_tipos_de_clientes = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cliente", {headers: headersAxios.value[0]})
  let tipos_de_clientes = ref(body_tipos_de_clientes['data'])

  //Traigo Condiciones de IVA
  const body_condiciones_iva = await axios.get(ENDPOINT_PATH_API.value + "condicion-iva", {headers: headersAxios.value[0]})
  let condiciones_iva = ref(body_condiciones_iva['data'])

  //Variables trabajos_encabezados
  //setearTrabajoEncabezadoId(router.currentRoute.value.params.id)
  setearTrabajoEncabezadoId(props.trabajo_id)
  let firma_id_trabajo = ref(null)
  let cliente_id = ref(null)
  let fecha_inicio = ref(null)
  let observaciones = ref(null)
  let fecha_de_cancelacion = ref(null)
  let fecha_de_cancelacion_f = ref(null)
  let observaciones_de_cancelacion = ref(null)
  const formEncabezado = ref(null) 
  let es_consumidor_final = ref(false)
  let nombre_o_razon_social = ref(null)
  let cuit_o_cuil = ref(null)
  let telefonos = ref(null)
  let direccion = ref(null)
  let tipo_de_cliente_id = ref(null)
  let origen_de_leed_id = ref(null)
  let condicion_iva_id = ref(null)
  let email = ref(null)
  let barrio_id = ref(null)
  let estado = ref(null)
  let pagado = ref(null)
  let importeLineas = ref(null)
  let importeFacturas = ref(null)
  let importeCobros = ref(null)
  let trabajo_cancelado = ref(false)

  if (trabajo_encabezado_id.value == -1) {
    // Seteo valores de variables para un alta de trabajos_encabezados
    firma_id_trabajo.value = Number(firma_id.value)
    titulo = 'Crear nuevo Trabajo'
    trabajo_encabezado = -1
    const today = new Date();
    fecha_inicio.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  }
  else {
    // Traigo trabajos_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "trabajo-encabezado/"+trabajo_encabezado_id.value, {headers: headersAxios.value[0]})
    trabajo_encabezado = body_find['data']
    titulo = 'Trabajo ID: '+trabajo_encabezado_id.value+' | '+trabajo_encabezado.data.cliente.nombre_o_razon_social
    firma_id_trabajo.value = trabajo_encabezado.data.firma.id
    cliente_id.value = trabajo_encabezado.data.cliente.id
    fecha_inicio.value = trabajo_encabezado.data.fecha_inicio_f
    fecha_de_cancelacion.value = trabajo_encabezado.data.fecha_de_cancelacion
    observaciones_de_cancelacion.value = trabajo_encabezado.data.observaciones_de_cancelacion
    observaciones.value = trabajo_encabezado.data.observaciones
    estado.value = trabajo_encabezado.data.estado
    pagado.value = trabajo_encabezado.data.pagado
    importeLineas.value = trabajo_encabezado.data.importeLineas
    importeFacturas.value = trabajo_encabezado.data.importeFacturas
    importeCobros.value = trabajo_encabezado.data.importeCobros
    origen_de_leed_id.value = trabajo_encabezado.data.origen_de_leed_id

    trabajo_cancelado.value = fecha_de_cancelacion.value ? true : false;

  }




  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos 
  let valid = ref(true);
  const firmaRules = [
    v => !!v || 'Firma es requerido'
  ];
  const clienteRules = [
    v => !!v || 'Cliente es requerido'
  ];
  const fecha_inicioRules = [
    v => !!v || 'Fecha de Inicio es requerido'
  ];
  const nombre_o_razon_socialRules =  [
    v => !!v || 'Nombre o Razon Social es requerido',
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  const tipo_de_clienteRules = [
    v => !!v || 'Tipo de Cliente es requerido'
  ];
  const telefonosRules =  [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  const direccionRules =  [
    v => (v && v.length <= 200) || 'Maximo 200 caracteres',
  ];

  
  let cuit_o_cuilRules = [
      value => {
          if (nuevoCliente.value && !es_consumidor_final.value) {
            if (!value) {
                return 'CUIT es requerido'
            }
            if (value && (value.length != 11)) {
                return 'CUIT debe ser sin guiones y no mayor a 11 caracteres'
            }
          }
          return true
      }
  ]

  const emailRules = [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];


  //Valido el Formulario
  async function validate () {
    await formEncabezado.value.validate()
    if (valid.value) {
      enviarFormEncabazado()
    }    
  }


  //Envio el Formulario
  async function enviarFormEncabazado() {

    loading.value = true

    let firma_id_trabajo_value = firma_id_trabajo.value
    if (typeof(firma_id_trabajo_value) == 'object') {
      firma_id_trabajo_value = firma_id_trabajo_value.id
    }
    const json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      firma_id: firma_id_trabajo_value,
      cliente: {
        nuevoCliente: nuevoCliente.value,
        es_consumidor_final: es_consumidor_final.value,
        id: cliente_id.value,
        nombre_o_razon_social: nombre_o_razon_social.value,
        cuit_o_cuil: cuit_o_cuil.value,
        direccion: direccion.value,
        telefonos: telefonos.value,
        email: email.value,
        barrio_id: barrio_id.value,
        tipo_de_cliente_id: tipo_de_cliente_id.value,
        condicion_iva_id: condicion_iva_id.value,
      },
      fecha_inicio: fecha_inicio.value,
      origen_de_leed_id: origen_de_leed_id.value,
      user_id: user_id.value,
      observaciones: observaciones.value,
      trabajo_cancelado: trabajo_cancelado.value,
      observaciones_de_cancelacion: observaciones_de_cancelacion.value,
    });

    let resultadoGuardar = null;

    //Si trabajo_encabezado_id = -1 creo el trabajo sino actualizo
    if (trabajo_encabezado_id.value == -1) {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "trabajo-encabezado", json, {headers: headersAxios.value[0]})
      setearMensajeStore(body_new['data'].mensaje)
      hasError.value = body_new['data'].hasError
      if (!hasError.value) {
        setearTrabajoEncabezadoId(body_new['data'].trabajo_encabezado.id)
        cliente_id.value = body_new['data'].trabajo_encabezado.cliente.id
        router.push("/trabajo/"+trabajo_encabezado_id.value);
      }
    }
    else {
      const body_update = await axios.put(ENDPOINT_PATH_API.value + "trabajo-encabezado/"+trabajo_encabezado_id.value, json, {headers: headersAxios.value[0]})
      let trabajo_encabezado_update = body_update['data']
      cliente_id.value = body_update['data'].trabajo_encabezado.cliente.id
      setearMensajeStore(body_update['data'].mensaje)
    }    

    if (!hasError.value) {
      //Traigo clientes
      body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
      clientes.value = body_clientes['data']      
      console.log(nuevoCliente.value)
      nuevoCliente.value = false
      es_consumidor_final.value = false
      getTime()
    }

    loading.value = false
  }

  // ----- Fin: Validación y envio del Formulario Encabezado
  
  function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
    }, 2 * 1000);
  }


  watch(
        () => es_consumidor_final.value,
        (newValue, oldValue) => {
          if (newValue) {
            tipo_de_cliente_id.value = 1
          }         
        }
    )   

let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'


    function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }
</script>



<style scoped>
.bg-field {
  background-color: #f6f6f6;
  height: 50px;
}
.nopagado {
  background-color: #ffbdc3;
}
.pagado {
  background-color: #31cf5e;
}
</style>
