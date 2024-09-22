<template>
  
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Relación</v-tab>
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
                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                    v-model="firma_origen_id"
                    :items="firmas2"
                    item-title="firma"
                    item-value="id"
                    label="Firma Origen"
                    return-object
                    :rules="firmaRules"
                    required
                  ></v-select>    
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <!--v-text-field
                      :disabled="deshabilitarEdicionCamposABMEncabezado"
                      v-model="importe"
                      :rules="importeRules"
                      label="Importe"
                      type="number"
                      min="0"
                      prefix="$"
                  ></v-text-field-->  
                                
                  <MoneyField
                      :disabled="deshabilitarEdicionCamposABMEncabezado"
                      v-model="importe"
                      :rules="importeRules"
                      :options="currencyOptions_general"
                      label="Importe *"
                      required="required"
                      >
                  </MoneyField> 
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                    v-model="firma_destino_id"
                    :items="firmas2"
                    item-title="firma"
                    item-value="id"
                    label="Firma Destino"
                    return-object
                    :rules="firmaRules"
                    required
                  ></v-select>    
                </v-col>
                
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      :disabled="deshabilitarEdicionCamposABMEncabezado"
                      v-model="fecha"
                      :rules="fechaRules"
                      label="Fecha"
                      type="date"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="8">
                  <v-textarea
                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                    label="Detalle"
                    v-model="detalle"
                    :rules="detalleRules"
                  ></v-textarea>
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
    
  <!--v-card style="padding: 20px">{{relacion}}</v-card>
  <v-card style="padding: 20px">{{clientes}}</v-card-->




  
</template> 
 
<script setup> 
  import axios from "axios"
  import { useData } from '../composables/useData'
  import { ref } from "vue"
  import "bootstrap/dist/css/bootstrap.min.css"
  import router from "@/router";
  import { useRouter, useRoute } from 'vue-router'
  import MoneyField from '../components/MoneyField.vue';

  
  const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
    relacion_id: {
          type: Number,
          default: null
      }
  })

  const relacion_id = ref(Number(props.relacion_id))


  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearTrabajoEncabezadoId } = useData()
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  let relacion = ref([])
  let titulo = ''
  let tab = ref('one')
  const formEncabezado = ref(null) 
  const deshabilitarEdicionCamposABMEncabezado = ref(false)
  const textBotonAccion = ref('')
  const loading = ref(false)

  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })
  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas2 = body_firmas['data']


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
    relacion = -1
    const today = new Date();
    fecha.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    textBotonAccion.value = 'Insertar'
  }
  else {
    // Traigo trabajos_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "relacion/"+relacion_id.value, {headers: headersAxios.value[0]})
    relacion = body_find['data']
    titulo = 'Relación ID: '+relacion_id.value
    firma_origen_id.value = relacion.data.firma_origen_id
    firma_destino_id.value = relacion.data.firma_destino_id
    fecha.value = relacion.data.fecha_f
    importe.value = relacion.data.importe 
    detalle.value = relacion.data.detalle 

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
  const firmaRules = [
    v => !!v || 'Firma es requerido'
  ];
  
  const fechaRules = [
    v => !!v || 'Fecha de Inicio es requerido'
  ];
  const importeRules = [
    v => !!v || 'Fecha de Inicio es requerido'
  ];
  const detalleRules = [
    v => !!v || 'Fecha de Inicio es requerido'
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
    loading.value = true
    
    let firma_origen_id_value = firma_origen_id.value
    if (typeof(firma_origen_id_value) == 'object') {
      firma_origen_id_value = firma_origen_id_value.id
    }

    let firma_destino_id_value = firma_destino_id.value
    if (typeof(firma_destino_id_value) == 'object') {
      firma_destino_id_value = firma_destino_id_value.id
    }

    const json = JSON.stringify({ 
      relacion_id: relacion_id.value,
      firma_origen_id: firma_origen_id_value,
      firma_destino_id: firma_destino_id_value,
      fecha: fecha.value,
      importe: importe.value,
      detalle: detalle.value,
    });

    let cod_mensaje = null;

    //Si relacion_id = -1 creo el trabajo sino actualizo
    if (props.accion == 'A') {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "relacion", json, {headers: headersAxios.value[0]})
      cod_mensaje = 'MA'
    }
    else {      
      if (props.accion == 'M') {
        const body_update = await axios.put(ENDPOINT_PATH_API.value + "relacion/"+relacion_id.value, json, {headers: headersAxios.value[0]})
        cod_mensaje = 'MM'
      }      
      if (props.accion == 'B') {
        const body_update = await axios.delete(ENDPOINT_PATH_API.value + "relacion/"+relacion_id.value, json, {headers: headersAxios.value[0]})
        cod_mensaje = 'MB'
      }
    }    
    loading.value = false
    
    router.push('/relaciones-list/'+cod_mensaje);
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
