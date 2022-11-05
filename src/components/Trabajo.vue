<template>
    <v-card v-bind:title="titulo" subtitle=""></v-card>

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
        <v-tab value="Notas" v-if="trabajo_encabezado_id!=-1">Notas</v-tab>
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
                  <v-text-field
                    v-model="nombre_o_razon_social"
                    :rules="nombre_o_razon_socialRules"
                    counter="80"
                    clearable
                    :label="es_consumidor_final ? 'Familia' : 'Nombre o Razon Social'"
                  ></v-text-field>           
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente">
                  <v-text-field
                    v-model="telefonos"
                    :rules="telefonosRules"
                    counter="80"
                    clearable
                    label="Telefonos"
                  ></v-text-field>   
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente && !es_consumidor_final">
                  <v-text-field
                    v-model="CUIT_o_CUIL"
                    :rules="CUIT_o_CUILRules"
                    counter="13"
                    clearable
                    label="CUIT o CUIL"
                  ></v-text-field>            
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="nuevoCliente && !es_consumidor_final">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
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
                
                <v-col cols="12" sm="12" md="8" v-show="nuevoCliente">
                  <v-text-field
                    v-model="direccion"
                    :rules="direccionRules"
                    counter="200"
                    clearable
                    label="Direccion"
                  ></v-text-field>       
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="fecha_inicio"
                      :rules="fecha_inicioRules"
                      label="Fecha de Inicio"
                      type="date"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6" md="8">
                  <v-textarea
                    label="Observaciones"
                    v-model="observaciones"
                  ></v-textarea>
                </v-col>

              </v-row>
              <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>

              <v-btn
                class="ma-2"
                color="primary"
                @click="validate"
              >
                <v-icon
                  start
                  icon="mdi-content-save"
                ></v-icon>
                Guardar  
              </v-btn>
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

          <v-window-item value="Notas" v-if="trabajo_encabezado_id!=-1">
            <TrabajosNotasList />            
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>
    

  <br>
  <br>

  <!--v-card style="padding: 20px">{{trabajo_encabezado}}</v-card>
  <v-card style="padding: 20px">{{clientes}}</v-card-->




  
</template> 
 
<script setup> 
  import axios from "axios"
  import { useData } from '../composables/useData'
  import router from "../router"
  import { defineComponent } from 'vue'
  import { ref } from "vue"
  import "bootstrap/dist/css/bootstrap.min.css"

  // Components
  import TrabajosLineasList from '../components/TrabajosLineasList.vue';
  import TrabajosComprasList from '../components/TrabajosComprasList.vue';
  import TrabajosCobrosList from '../components/TrabajosCobrosList.vue';
  import TrabajosFacturasList from '../components/TrabajosFacturasList.vue';
  import TrabajosNotasList from '../components/TrabajosNotasList.vue';
  

  //Variables grales de Aplicacion
  const { ENDPOINT_PATH_API, headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, trabajo_encabezado_id, setearTrabajoEncabezadoId } = useData()
  let trabajo_encabezado = ref([])
  let titulo = ''
  let tab = ref('one')
  const nuevoCliente = ref(false)

  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas2 = body_firmas['data']

  //Traigo clientes
  let body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
  let clientes = ref(body_clientes['data'])

  //Traigo barrios
  const body_barrios = await axios.get(ENDPOINT_PATH_API.value + "barrio", {headers: headersAxios.value[0]})
  let barrios = body_barrios['data']

  //Variables trabajos_encabezados
  setearTrabajoEncabezadoId(router.currentRoute.value.params.id)
  let firma_id_trabajo = ref(null)
  let cliente_id = ref(null)
  let fecha_inicio = ref(null)
  let observaciones = ref(null)
  let observaciones_de_cancelacion = ref(null)
  const formEncabezado = ref(null) 
  let es_consumidor_final = ref(false)
  let nombre_o_razon_social = ref(null)
  let CUIT_o_CUIL = ref(null)
  let telefonos = ref(null)
  let direccion = ref(null)
  let email = ref(null)
  let barrio_id = ref(null)

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
    observaciones.value = trabajo_encabezado.data.observaciones
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
    v => !!v || es_consumidor_final.value ? 'Familia' : 'Nombre o Razon Social'+'Es requerido',
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  const telefonosRules =  [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  const direccionRules =  [
    v => (v && v.length <= 200) || 'Maximo 200 caracteres',
  ];
  const CUIT_o_CUILRules =  [
    v => (v && v.length <= 13) || 'Maximo 13 caracteres',
    v => /\b(20|23|24|27|30|33|34)(\D)?[0-9]{8}(\D)?[0-9]/g || 'CUIT debe ser valido',
  ];
  const emailRules = [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];

  //Valido el Formulario
  const validate = () => {
    const resul = formEncabezado.value.validate()

    // Si el formulario es valido guardo los datos
    if (valid) {
      enviarFormEncabazado()
    }

  };

  //Envio el Formulario
  async function enviarFormEncabazado() {
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
        CUIT_o_CUIL: CUIT_o_CUIL.value,
        direccion: direccion.value,
        telefonos: telefonos.value,
        email: email.value,
        barrio_id: barrio_id.value,
      },
      fecha_inicio: fecha_inicio.value,
      user_id: user_id.value,
      observaciones: observaciones.value
    });

    let resultadoGuardar = null;

    //Si trabajo_encabezado_id = -1 creo el trabajo sino actualizo
    if (trabajo_encabezado_id.value == -1) {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "trabajo-encabezado", json, {headers: headersAxios.value[0]})
      setearMensajeStore(body_new['data'].mensaje)
      setearTrabajoEncabezadoId(body_new['data'].trabajo_encabezado.id)
      cliente_id.value = body_new['data'].trabajo_encabezado.cliente.id
      router.push("/trabajo/"+trabajo_encabezado_id.value);
    }
    else {
      const body_update = await axios.put(ENDPOINT_PATH_API.value + "trabajo-encabezado/"+trabajo_encabezado_id.value, json, {headers: headersAxios.value[0]})
      let trabajo_encabezado_update = body_update['data']
      cliente_id.value = body_update['data'].trabajo_encabezado.cliente.id
      setearMensajeStore(body_update['data'].mensaje)
    }    
    //Traigo clientes
    body_clientes = await axios.get(ENDPOINT_PATH_API.value + "cliente", {headers: headersAxios.value[0]})
    clientes.value = body_clientes['data']      
    console.log(nuevoCliente.value)
    nuevoCliente.value = false
    es_consumidor_final.value = false
    getTime()
  }

  // ----- Fin: Validación y envio del Formulario Encabezado
  
  function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
    }, 2 * 1000);
  }


let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
</script>



<style scoped>
.bg-field {
  background-color: #f6f6f6;
  height: 50px;
}
</style>