<template>
  
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Cliente</v-tab>
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

                <v-col cols="12" sm="6" md="8">
                  <v-switch
                   
                    v-model="es_consumidor_final"
                    label="Es consumidor final?"
                    color="success"
                  ></v-switch>
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="nombre_o_razon_social"
                    :rules="nombre_o_razon_socialRules"
                    counter="80"
                    clearable
                    label="Nombre o Razon Social"
                  ></v-text-field>           
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="telefonos"
                    counter="80"
                    clearable
                    label="Telefonos"
                  ></v-text-field>   
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="!es_consumidor_final">
                  <v-text-field
                    v-model="cuit_o_cuil"
                    :rules="cuit_o_cuilRules"
                    type="number"
                    counter="11"
                    clearable
                    label="CUIT o CUIL"
                  ></v-text-field>            
                </v-col>
                
                <v-col cols="12" sm="6" md="4" v-show="!es_consumidor_final">
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    required
                  ></v-text-field> 
                </v-col>

                
                <v-col cols="12" sm="6" md="4" v-show="es_consumidor_final">
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
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="direccion"
                    counter="200"
                    clearable
                    label="Direccion"
                  ></v-text-field>       
                </v-col>
                
                
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    v-model="tipo_de_cliente_id"
                    :items="tipos_de_clientes"
                    item-title="tipo_de_cliente"
                    item-value="id"
                    :rules="tipo_de_cliente_idRules"
                    dense
                    filled
                    label="Tipo de Cliente *"
                  ></v-autocomplete> 
                </v-col>

                <v-col cols="12" sm="6" md="4">
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


              <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
              <v-alert :type="typeAlert" v-show="mensaje != null">{{ mensaje }}</v-alert>
              
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
                {{ textBotonAccion }}  
              </v-btn>

              <v-progress-circular
                indeterminate
                color="amber"
                v-show="loading"
              ></v-progress-circular>
              
            </v-form>
          </v-window-item>
          

        </v-window>
      </v-card-text>
    </v-card>
    



  
</template> 
 
<script setup> 
  import axios from "axios"
  import { useData } from '../composables/useData'
  import { ref } from "vue"
  import "bootstrap/dist/css/bootstrap.min.css"
  import router from "@/router";
  import { useRouter, useRoute } from 'vue-router'

  
  const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
    cliente_id: {
          type: Number,
          default: null
      }
  })

  const cliente_id = ref(Number(props.cliente_id))
console.log(cliente_id.value)

  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearTrabajoEncabezadoId } = useData()

  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  let cliente = ref([])
  let titulo = ''
  let tab = ref('one')
  const formEncabezado = ref(null) 
  const deshabilitarEdicionCamposABMEncabezado = ref(false)
  const textBotonAccion = ref('')
  const loading = ref(false)
  const hasError = ref(false)
  let mensaje = ref(null)
  let typeAlert = ref('success')

  let es_consumidor_final = ref(false)
  let nombre_o_razon_social = ref(null)
  let cuit_o_cuil = ref(null)
  let telefonos = ref(null)
  let direccion = ref(null)
  let tipo_de_cliente_id = ref(null)
  let condicion_iva_id = ref(null)
  let email = ref(null)
  let barrio_id = ref(null)
  

  //Traigo barrios
  const body_barrios = await axios.get(ENDPOINT_PATH_API.value + "barrio", {headers: headersAxios.value[0]})
  let barrios = body_barrios['data']

  //Traigo Tipos de Clientes
  const body_tipos_de_clientes = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-cliente", {headers: headersAxios.value[0]})
  let tipos_de_clientes = body_tipos_de_clientes['data']

  //Traigo Condiciones de IVA
  const body_condiciones_iva = await axios.get(ENDPOINT_PATH_API.value + "condicion-iva", {headers: headersAxios.value[0]})
  let condiciones_iva = ref(body_condiciones_iva['data'])

  //Variables trabajos_encabezados
  setearTrabajoEncabezadoId(router.currentRoute.value.params.id)
  let firma_origen_id = ref(null)
  let firma_destino_id = ref(null)
  let fecha = ref(null)
  let importe = ref(null)
  let detalle = ref(null)
  
  
  if (props.accion == 'A') {
    // Seteo valores de variables para un alta de trabajos_encabezados
    titulo = 'Crear nueva relación'
    cliente = -1
    const today = new Date();
    textBotonAccion.value = 'Insertar'
  }
  else {
    // Traigo trabajos_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "cliente/"+cliente_id.value, {headers: headersAxios.value[0]})
    cliente = body_find['data']
    titulo = 'Cliente ID: '+cliente_id.value
    es_consumidor_final.value = sino_a_tf(cliente.data.es_consumidor_final)
    nombre_o_razon_social.value = cliente.data.nombre_o_razon_social
    cuit_o_cuil.value = cliente.data.cuit_o_cuil
    telefonos.value = cliente.data.telefonos
    direccion.value = cliente.data.direccion
    tipo_de_cliente_id.value = cliente.data.tipo_de_cliente_id
    condicion_iva_id.value = cliente.data.condicion_iva_id
    email.value = cliente.data.email
    barrio_id.value = cliente.data.barrio_id

    if (props.accion == 'M') {
      textBotonAccion.value = 'Guardar'
    }
    if (props.accion == 'B') {
      textBotonAccion.value = 'Eliminar'
      deshabilitarEdicionCamposABMEncabezado.value=true
    }
  }




  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos 
  let valid = ref(true);

  const nombre_o_razon_socialRules =  [
    v => !!v || 'Es requerido',
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  const telefonosRules =  [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  const direccionRules =  [
    v => (v && v.length <= 200) || 'Maximo 200 caracteres',
  ];
  /*
  const cuit_o_cuilRules =  [
    v => (v && v.length <= 13) || 'Maximo 13 caracteres',
    v => /\b(20|23|24|27|30|33|34)(\D)?[0-9]{8}(\D)?[0-9]/g || 'CUIT debe ser valido',
  ];
  */
   
  let cuit_o_cuilRules = [
      value => {
            if (!value) {
                return 'CUIT es requerido'
            }
            if (value && (value.length != 11)) {
                return 'CUIT debe ser sin guiones y no mayor a 11 caracteres'
            }
          return true
      }
  ]

  const emailRules = [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];
  const tipo_de_cliente_idRules =  [
    v => !!v || 'Es requerido',
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
    /*
    let barrio_id_value = barrio_id.value
    if (typeof(barrio_id_value) == 'object') {
      barrio_id_value = barrio_id_value.id
    }

    let tipo_de_cliente_id_value = tipo_de_cliente_id.value
    if (typeof(tipo_de_cliente_id_value) == 'object') {
      tipo_de_cliente_id_value = tipo_de_cliente_id_value.id
    }

    let localidad_id_value = localidad_id.value
    if (typeof(localidad_id_value) == 'object') {
      localidad_id_value = localidad_id_value.id
    }
    */

    const json = JSON.stringify({ 
        cliente_id: cliente_id.value,
        es_consumidor_final: tf_a_sino(es_consumidor_final.value),
        nombre_o_razon_social: nombre_o_razon_social.value,
        cuit_o_cuil: cuit_o_cuil.value,
        direccion: direccion.value,
        telefonos: telefonos.value,
        email: email.value,
        barrio_id: barrio_id.value,
        tipo_de_cliente_id: tipo_de_cliente_id.value,
        condicion_iva_id: condicion_iva_id.value,
    });

    let cod_mensaje = null;

    //Si cliente_id = -1 creo el trabajo sino actualizo
    if (props.accion == 'A') {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "cliente", json, {headers: headersAxios.value[0]})
      cod_mensaje = 'MA'
      hasError.value = body_new['data'].hasError
      if (hasError.value) {
        mensaje.value = body_new['data'].mensaje
        typeAlert.value = 'warning'
      }

    }
    else {
      if (props.accion == 'M') {
        //const body_update = await axios.put(ENDPOINT_PATH_API.value + "cliente/"+cliente_id.value, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "cliente-update/"+cliente_id.value, json, {headers: headersAxios.value[0]})
        cod_mensaje = 'MM'
      }
      if (props.accion == 'B') {
        //const body_update = await axios.delete(ENDPOINT_PATH_API.value + "cliente/"+cliente_id.value, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "cliente-delete/"+cliente_id.value, json, {headers: headersAxios.value[0]})
        cod_mensaje = 'MB'
      }
    }
    loading.value = false
    
    if (!hasError.value) {
      router.push('/clientes-list/'+cod_mensaje);
    }
  }

  // ----- Fin: Validación y envio del Formulario Encabezado
  

  function sino_a_tf(sino) {
    return sino == 'SI' ? true : false
  }

  function tf_a_sino(tf) {
    console.log('tf')
    console.log(tf)
    return tf ? 'SI' : 'NO'
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
