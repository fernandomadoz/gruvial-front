<template>
  
  
  <v-card>
    <v-tabs
      v-model="tab"
      background-color="primary"
    >
      <v-tab value="Encabezado">Recordatorio</v-tab>
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
                <v-text-field
                    v-model="fecha"
                    :rules="requeridoRules"
                    label="Fecha del Recordatorio"
                    type="date"
                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-text-field>
              </v-col>
                    
              <v-col cols="12" sm="6" md="8">
                  <v-text-field
                  v-model="detalle"
                  :rules="requeridoRules"
                  counter="250"
                  clearable
                  label="Detalle"
                  :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-text-field>       
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="tipo_de_recordatorio_id"
                  :items="tipos_de_recordatorios"
                  item-title="tipo_de_recordatorio"
                  item-value="id"
                  :rules="requeridoRules"
                  dense
                  filled
                  label="Tipo de Recordatorio *"
                  :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-autocomplete> 
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-switch v-if="props.accion != 'A'"                 
                  v-model="completado"
                  label="Completado?"
                  color="success"
                  :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-switch>
              </v-col>             

              <v-col cols="12" sm="6" md="4">
                <v-switch v-if="completado && !recordatorio_hijo"                 
                  v-model="renovar"
                  label="Renovar?"
                  color="success"
                  :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-switch>
              </v-col>

              <v-col cols="12" sm="6" md="4" v-if="renovar">
                <v-text-field
                    v-model="fecha_proximo_recordatorio"
                    :rules="requeridoRules"
                    label="Fecha del Próximo Recordatorio"
                    type="date"
                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="recordatorio_para_user_id"
                  :items="users"
                  item-title="detalle_select"
                  item-value="id"
                  dense
                  filled
                  label="Recordatorio para"
                  :disabled="deshabilitarEdicionCamposABMEncabezado"
                ></v-autocomplete> 
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <quill-editor theme="snow" toolbar="full" v-model:content="notas" content="String" contentType="html"></quill-editor>
                mitexto {{ notas }}
              </v-col>
            </v-row>





            <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>

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
  recordatorio_id: {
        type: Number,
        default: null
    }
})

const recordatorio_id = ref(Number(props.recordatorio_id))

//Variables grales de Aplicacion
const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearTrabajoEncabezadoId } = useData()
const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
let recordatorio = ref([])
let titulo = ''
let tab = ref('one')
const formEncabezado = ref(null) 
const deshabilitarEdicionCamposABMEncabezado = ref(false)
const textBotonAccion = ref('')
const loading = ref(false)

const fecha = ref(null)
const detalle = ref(null)
const completado = ref(false)
const recordatorio_padre_id = ref(null)
const recordatorio_padre = ref(null)
const recordatorio_hijo = ref(null)
const tipo_de_recordatorio_id = ref(null)
const fecha_proximo_recordatorio = ref(null)
const recordatorio_para_user_id = ref(null)
const renovar = ref(null)
const notas = ref(null)


//Traigo Tipos de Recordatorios
const body_tipos_de_recordatorios = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-recordatorio", {headers: headersAxios.value[0]})
let tipos_de_recordatorios = body_tipos_de_recordatorios['data']

//Traigo los Usuarios
let jsonRecordatorio = JSON.stringify({ 
        firma_id: 1
    });
let body_users = await axios.post(ENDPOINT_PATH_API.value + "usuarios", jsonRecordatorio, {headers: headersAxios.value[0]});
let users = body_users['data']

if (props.accion == 'A') {
  // Seteo valores de variables para un alta de trabajos_encabezados
  titulo = 'Crear nuevo recordatorio'
  recordatorio = -1
  const today = new Date();
  textBotonAccion.value = 'Insertar'
}
else {
  // Traigo trabajos_encabezados y seteo variables
  const body_find = await axios.get(ENDPOINT_PATH_API.value + "recordatorio/"+recordatorio_id.value, {headers: headersAxios.value[0]})
  recordatorio = body_find['data']
  titulo = 'Recordatorio ID: '+recordatorio_id.value
  fecha.value = recordatorio.data.fecha
  detalle.value = recordatorio.data.detalle
  completado.value = sino_a_tf(recordatorio.data.completado) 
  recordatorio_padre_id.value = recordatorio.data.recordatorio_padre_id
  recordatorio_padre.value = recordatorio.data.recordatorio_padre
  recordatorio_hijo.value = recordatorio.data.recordatorio_hijo
  tipo_de_recordatorio_id.value = recordatorio.data.tipo_de_recordatorio_id
  fecha_proximo_recordatorio.value = recordatorio.data.fecha_proximo_recordatorio
  recordatorio_para_user_id.value = recordatorio.data.recordatorio_para_user_id
  notas.value = recordatorio.data.notas
  

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

const requeridoRules =  [
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

  const json = JSON.stringify({ 
      firma_id: firma_id.value,
      recordatorio_id: recordatorio_id.value,
      fecha: fecha.value,
      detalle: detalle.value,
      completado: tf_a_sino(completado.value),
      renovar: tf_a_sino(renovar.value),
      recordatorio_padre_id: recordatorio_padre_id.value,
      tipo_de_recordatorio_id: tipo_de_recordatorio_id.value,
      fecha_proximo_recordatorio: fecha_proximo_recordatorio.value,
      recordatorio_para_user_id: recordatorio_para_user_id.value,
      notas: notas.value
  });

  let cod_mensaje = null;

  //Si recordatorio_id = -1 creo el trabajo sino actualizo
  if (props.accion == 'A') {
    const body_new = await axios.post(ENDPOINT_PATH_API.value + "recordatorio", json, {headers: headersAxios.value[0]})
    cod_mensaje = 'MA'
  }
  else {      
    if (props.accion == 'M') {
      const body_update = await axios.put(ENDPOINT_PATH_API.value + "recordatorio/"+recordatorio_id.value, json, {headers: headersAxios.value[0]})
      cod_mensaje = 'MM'
    }      
    if (props.accion == 'B') {
      const body_update = await axios.delete(ENDPOINT_PATH_API.value + "recordatorio/"+recordatorio_id.value, json, {headers: headersAxios.value[0]})
      cod_mensaje = 'MB'
    }
  }    
  loading.value = false
  
  router.push('/recordatorios-list/'+cod_mensaje);
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
