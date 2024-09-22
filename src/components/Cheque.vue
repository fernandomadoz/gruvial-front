<template>
  
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Cheque</v-tab>
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
                            v-model="cuenta_emisora_id"
                            :items="cuentas"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            item-title="detalle_select"
                            item-value="id"
                            label="Cuenta emisora *"
                            required
                            :rules="requeridoRules"
                        ></v-select>     
                    </v-col>

                                
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            v-model="importe"
                            :rules="requeridoRules"
                            label="Importe *"
                            type="number"
                            min="0"
                            required
                            prefix="$"
                        ></v-text-field>  
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="numero_de_cheque"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            :rules="requeridoRules"
                            maxlength="30"
                            counter="30"
                            label="Nro de Cheque *"
                            required
                        ></v-text-field>      
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                            v-model="banco_id"
                            :items="bancos"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            item-title="nombre_del_banco"
                            item-value="id"
                            dense
                            filled
                            label="Banco *"
                            :rules="requeridoRules"
                            required
                        ></v-autocomplete>      
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            v-model="fecha_de_emision"
                            label="Fecha de Emisión *"
                            type="date"
                            :rules="requeridoRules"
                            required
                        ></v-text-field>  
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            v-model="fecha_inicio_de_cobro"
                            label="Fecha de Inicio de Cobro *"
                            type="date"
                            :rules="requeridoRules"
                            required
                        ></v-text-field>  
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            v-model="fecha_de_vencimiento"
                            label="Fecha de Vencimiento *"
                            type="date"
                            :rules="requeridoRules"
                            required
                        ></v-text-field>  
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            v-model="fecha_de_cobro"
                            label="Fecha de Cobro"
                            type="date"
                            clearable
                        ></v-text-field>  
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                            v-model="persona_que_cobro_id"
                            :items="personas"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            item-title="detalle_select"
                            item-value="id"
                            dense
                            filled
                            label="Persona que cobro"
                        ></v-autocomplete>      
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-select
                            v-model="causa_de_baja_de_cheque_id"
                            :items="causas_de_bajas_de_cheques"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            item-title="causa_de_baja_de_cheque"
                            item-value="id"
                            label="Causa de No Cobro"
                        ></v-select>     
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                        <v-textarea
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            label="Observaciones"
                            counter="250"
                            maxlength="250"
                            v-model="observaciones"
                        ></v-textarea>
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            v-model="fecha_de_entrega_a_cuenta_destino"
                            label="Fecha de Entrega a cuenta destino"
                            type="date"
                        ></v-text-field>  
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4">
                        <v-select
                            v-model="cuenta_de_destino_id"
                            :items="cuentas"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            item-title="detalle_select"
                            item-value="id"
                            label="Cuenta destino"
                            return-object
                        ></v-select>     
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                            v-model="persona_que_recibe_en_cuenta_destino_id"
                            :items="personas"
                            :disabled="deshabilitarEdicionCamposABMCobros"
                            :rules="persona_que_recibe_en_cuenta_destino_idRules"
                            item-title="detalle_select"
                            item-value="id"
                            dense
                            filled
                            label="Persona que recibe en cuenta destino"
                        ></v-autocomplete>      
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
                {{ textBotonAccion }}  
              </v-btn>
            </v-form>
          </v-window-item>
          

        </v-window>
      </v-card-text>
    </v-card>
    
  <!--v-card style="padding: 20px">{{cheque}}</v-card>
  <v-card style="padding: 20px">{{clientes}}</v-card-->




  
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
    cheque_id: {
          type: Number,
          default: null
      }
  })

  const cheque_id = ref(Number(props.cheque_id))


  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearTrabajoEncabezadoId } = useData()
  let cheque = ref([])
  let titulo = ''
  let tab = ref('one')
  const formEncabezado = ref(null) 
  const deshabilitarEdicionCamposABMEncabezado = ref(false)
  const textBotonAccion = ref('')

  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')


          
  //Traigo cuentas
  const body_cuentas = await axios.get(ENDPOINT_PATH_API.value + "cuenta", {headers: headersAxios.value[0]})
  let cuentas = body_cuentas['data']

  //Traigo bancos
  const body_bancos = await axios.get(ENDPOINT_PATH_API.value + "banco", {headers: headersAxios.value[0]})
  let bancos = body_bancos['data']

  //Traigo causa de baja de cheques
  const body_causas_de_bajas_de_cheques = await axios.get(ENDPOINT_PATH_API.value + "causa-de-baja-de-cheque", {headers: headersAxios.value[0]})
  let causas_de_bajas_de_cheques = body_causas_de_bajas_de_cheques['data']



  //Variables Cheques
  const cuenta_emisora_id = ref(null)
  const numero_de_cheque = ref(null)
  const banco_id = ref(null)
  const importe = ref(null)
  const fecha_de_emision = ref(null)
  const fecha_inicio_de_cobro = ref(null)
  const fecha_de_vencimiento = ref(null)
  const fecha_de_cobro = ref(null)
  const persona_que_cobro_id = ref(null)
  const observaciones = ref(null)
  const causa_de_baja_de_cheque_id = ref(null)
  const cuenta_de_destino_id = ref(null)
  const fecha_de_entrega_a_cuenta_destino = ref(null)
  const persona_que_recibe_en_cuenta_destino_id = ref(null)

  
  
  if (props.accion == 'A') {
    // Seteo valores de variables para un alta de trabajos_encabezados
    titulo = 'Crear nuevo cheque'
    cheque = -1
    const today = new Date();
    textBotonAccion.value = 'Insertar'
  }
  else {
    // Traigo trabajos_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "cheque/"+cheque_id.value, {headers: headersAxios.value[0]})
    cheque = body_find['data']
    titulo = 'Cheque ID: '+cheque_id.value

    cuenta_emisora_id.value = cheque.data.cuenta_emisora_id
    numero_de_cheque.value = cheque.data.numero_de_cheque
    banco_id.value = cheque.data.banco_id
    importe.value = cheque.data.importe
    fecha_de_emision.value = cheque.data.fecha_de_emision_f
    fecha_inicio_de_cobro.value = cheque.data.fecha_inicio_de_cobro_f
    fecha_de_vencimiento.value = cheque.data.fecha_de_vencimiento_f
    fecha_de_cobro.value = cheque.data.fecha_de_cobro_f
    persona_que_cobro_id.value = cheque.data.persona_que_cobro_id
    observaciones.value = cheque.data.observaciones
    causa_de_baja_de_cheque_id.value = cheque.data.causa_de_baja_de_cheque_id
    cuenta_de_destino_id.value = cheque.data.cuenta_de_destino_id
    fecha_de_entrega_a_cuenta_destino.value = cheque.data.fecha_de_entrega_a_cuenta_destino_f
    persona_que_recibe_en_cuenta_destino_id.value = cheque.data.persona_que_recibe_en_cuenta_destino_id

    
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
  const requeridoRules = [
    v => !!v || 'es requerido'
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
    
    const json = JSON.stringify({ 
        cheque_id: cheque_id.value,
        cuenta_emisora_id: cuenta_emisora_id.value,
        numero_de_cheque: numero_de_cheque.value,
        banco_id: banco_id.value,
        importe: importe.value,
        fecha_de_emision: fecha_de_emision.value,
        fecha_inicio_de_cobro: fecha_inicio_de_cobro.value,
        fecha_de_vencimiento: fecha_de_vencimiento.value,
        fecha_de_cobro: fecha_de_cobro.value,
        persona_que_cobro_id: persona_que_cobro_id.value,
        observaciones: observaciones.value,
        causa_de_baja_de_cheque_id: causa_de_baja_de_cheque_id.value,
        cuenta_de_destino_id: cuenta_de_destino_id.value,
        fecha_de_entrega_a_cuenta_destino: fecha_de_entrega_a_cuenta_destino.value,
        persona_que_recibe_en_cuenta_destino_id: persona_que_recibe_en_cuenta_destino_id.value,
    });

    let cod_mensaje = null;

    //Si cheque_id = -1 creo el trabajo sino actualizo
    if (props.accion == 'A') {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "cheque", json, {headers: headersAxios.value[0]})
      cod_mensaje = 'MA'
    }
    else {      
      if (props.accion == 'M') {
        const body_update = await axios.put(ENDPOINT_PATH_API.value + "cheque/"+cheque_id.value, json, {headers: headersAxios.value[0]})
        cod_mensaje = 'MM'
      }      
      if (props.accion == 'B') {
        const body_update = await axios.delete(ENDPOINT_PATH_API.value + "cheque/"+cheque_id.value, json, {headers: headersAxios.value[0]})
        cod_mensaje = 'MB'
      }
    }    
    
    router.push('/cheques-list/'+cod_mensaje);
  }

  // ----- Fin: Validación y envio del Formulario Encabezado
  


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
