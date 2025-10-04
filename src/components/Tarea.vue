<template>
  
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Tarea</v-tab>
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


                <v-col cols="12" sm="6" md="6">
                    <v-select
                        v-model="equipo_id"
                        :items="equipos"
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        item-title="equipo"
                        item-value="id"
                        required="required"
                        label="Equipo *"
                        :rules="requeridoRules"
                        ></v-select>     
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                    <v-select
                        v-model="prioridad_id"
                        :items="prioridades"
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        item-title="prioridad"
                        item-value="id"
                        required="required"
                        label="Prioridad *"
                        :rules="requeridoRules"
                        ></v-select>     
                </v-col>

                <v-col cols="12" sm="6" md="6">
                    <v-select
                        v-model="persona_id"
                        :items="personas"
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        item-title="detalle_select"
                        item-value="id"
                        label="Responsable "
                        ></v-select>     
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-select
                        v-model="estado_de_tarea_id"
                        :items="estados_de_tarea"
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        item-title="estado_de_tarea"
                        item-value="id"
                        required="required"
                        label="Estado de tarea *"
                        :rules="requeridoRules"
                        ></v-select>     
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        v-model="nombre_de_tarea"
                        counter="150"
                        required="required"
                        maxlength="150"
                        label="Nombre de la tarea *"
                        :rules="requeridoRules"
                        ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        v-model="cantidad_de_dias_para_repetir"
                        label="Cant. días para repetir la tarea"
                        type="number"
                        min="0"
                        prefix="días"
                    ></v-text-field> 
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        v-model="fecha_programada"
                        label="Fecha Programada"
                        type="date"
                    ></v-text-field>  
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        v-model="fecha_de_realizacion"
                        label="Realizada"
                        type="date"
                    ></v-text-field>  
                </v-col>
                
                <!-- Arvhivo carga-->
                <v-col cols="12" sm="12" md="12">
                    <v-file-input
                        v-if="accion == 'A'"
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        v-model="files"
                        multiple 
                        label="Cargar o reemplazar archivo (Hasta 5 archivos y no puede superar los 20MB en total)"
                        show-size
                        counter 
                        chips
                        :rules="filesRules"
                    ></v-file-input>
                    
                    <div v-else>
                        <h6 class="pb-3">Fotos o archivos:</h6>
                        <span v-for="n in 5" :key="n" class="m-1">
                        <a :href="tarea['archivo_'+n]" target="_blank" v-if="tarea['archivo_'+n]">
                            <v-btn
                            class="pl-6"
                            prepend-icon="mdi-download"
                            color="default"
                            >{{ n }}</v-btn>
                        </a>
                        </span>
                    </div>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                    <v-textarea
                        :disabled="deshabilitarEdicionCamposABMTareas"
                        label="Notas"
                        v-model="notas"
                    ></v-textarea>
                </v-col>
              </v-row>


              <v-alert type="success" v-show="mensajeStore != null">{{ mensajeStore }}</v-alert>
              <v-alert :type="typeAlert" v-show="mensaje != null">{{ mensaje }}</v-alert>
              
              <v-btn
                class="ma-2"
                color="primary"
                @click="validate"
                :disabled="loading && 1==0"
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
    tarea_id: {
          type: Number,
          default: null
      }
  })

  const tarea_id = ref(Number(props.tarea_id))

  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore, setearTrabajoEncabezadoId } = useData()

  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

  let tarea = ref([])
  let titulo = ''
  let tab = ref('one')
  const formEncabezado = ref(null) 
  const textBotonAccion = ref('')
  const loading = ref(false)
  const hasError = ref(false)
  let mensaje = ref(null)
  let typeAlert = ref('success')
  let deshabilitarEdicionCamposABMTareas = ref(false)

  const files = ref([])
  let equipo_id = ref(null)
  let prioridad_id = ref(null)
  let estado_de_tarea_id = ref(null)
  let fecha_programada = ref(null)
  let fecha_de_realizacion = ref(null)
  let archivo_1 = ref(null)
  let archivo_2 = ref(null)
  let archivo_3 = ref(null)
  let archivo_4 = ref(null)
  let archivo_5 = ref(null)
  let notas = ref(null)
  let nombre_de_tarea = ref(null)
  let cantidad_de_dias_para_repetir = ref(0)
  let persona_id = ref(null)

  

  //Traigo personas
  const body_personas = await axios.get(ENDPOINT_PATH_API.value + "persona", {headers: headersAxios.value[0]})
  let personas = body_personas['data']

  //Traigo prioridades
  const body_prioridades = await axios.get(ENDPOINT_PATH_API.value + "prioridad", {headers: headersAxios.value[0]})
  let prioridades = body_prioridades['data']

  //Traigo Equipos
  const body_equipos = await axios.get(ENDPOINT_PATH_API.value + "equipo", {headers: headersAxios.value[0]})
  let equipos = body_equipos['data']

  //Traigo Estados de Tarea
  const body_estados_de_tarea = await axios.get(ENDPOINT_PATH_API.value + "estado-de-tarea", {headers: headersAxios.value[0]})
  let estados_de_tarea = ref(body_estados_de_tarea['data'])

  //Variables trabajos_encabezados
  setearTrabajoEncabezadoId(router.currentRoute.value.params.id)
  let firma_origen_id = ref(null)
  let firma_destino_id = ref(null)
  
  
  if (props.accion == 'A') {
    // Seteo valores de variables para un alta de trabajos_encabezados
    titulo = 'Crear nueva tarea'
    tarea.value = {

      equipo: {
          id: null
      },
      prioridad: {
          id: null
      },
      estado_de_tarea: {
          id: null
      },
      persona: {
          id: null
      },
    }
    const today = new Date();
    textBotonAccion.value = 'Insertar'
  }
  else {
    // Traigo trabajos_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "tarea/"+tarea_id.value, {headers: headersAxios.value[0]})
    tarea = body_find['data'].data
    titulo = 'Tarea ID: '+tarea_id.value
    
    equipo_id.value = tarea.equipo_id
    prioridad_id.value = tarea.prioridad_id
    estado_de_tarea_id.value = tarea.estado_de_tarea_id
    fecha_programada.value = tarea.fecha_programada_f
    fecha_de_realizacion.value = tarea.fecha_de_realizacion_f
    nombre_de_tarea.value = tarea.nombre_de_tarea
    /*
    archivo_1 = tarea.data.archivo_1
    archivo_2 = tarea.data.archivo_2
    archivo_3 = tarea.data.archivo_3
    archivo_4 = tarea.data.archivo_4
    archivo_5 = tarea.data.archivo_5
    */
    notas.value = tarea.notas
    cantidad_de_dias_para_repetir.value = tarea.cantidad_de_dias_para_repetir
    persona_id.value = tarea.persona_id
    

    if (props.accion == 'M') {
      textBotonAccion.value = 'Guardar'
    }
    if (props.accion == 'B') {
      textBotonAccion.value = 'Eliminar'
      deshabilitarEdicionCamposABMTareas.value = true
    }
  }




  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos 
  let valid = ref(true);

  const requeridoRules =  [
    v => !!v || 'Es requerido',
  ];



  
  const maxFiles = 5 // Número máximo de archivos permitidos
  const maxTotalSize = 20 * 1024 * 1024

  let filesRules = [
      value => {
          if (value) {
            if (value.length > maxFiles) {
                return 'Solo puedes subir un máximo de '+maxFiles+' archivos'
            }
            let totalSize = value.reduce((sum, file) => sum + file.size, 0)
            if (totalSize > maxTotalSize) {
                return 'El tamaño total de los archivos no puede superar 20 MB'
            }
          }
          return true
      }
  ]
  




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

    
    var formData = new FormData();
    
    
    formData.append("tarea_id", tarea_id.value)
    formData.append("equipo_id", equipo_id.value)
    formData.append("prioridad_id", prioridad_id.value)
    formData.append("estado_de_tarea_id", estado_de_tarea_id.value)
    formData.append("persona_id", persona_id.value)
    formData.append("fecha_programada", fecha_programada.value)
    formData.append("fecha_de_realizacion", fecha_de_realizacion.value)
    formData.append("nombre_de_tarea", nombre_de_tarea.value)
    formData.append("cantidad_de_dias_para_repetir", cantidad_de_dias_para_repetir.value)
    formData.append("notas", notas.value)



    if (files.value) {
        files.value.forEach((value, key) => formData.append("archivo_new_"+(key+1), value));
    }

    let cod_mensaje = null;
    

    //Si tarea_id = -1 creo el trabajo sino actualizo
    if (props.accion == 'A') {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "tarea-create", formData, {headers: headersAxios.value[0]})
      cod_mensaje = 'MA'
      hasError.value = body_new['data'].hasError
      if (hasError.value) {
        mensaje.value = body_new['data'].mensaje
        typeAlert.value = 'warning'
      }

    }
    else {
      if (props.accion == 'M') {
        //const body_update = await axios.put(ENDPOINT_PATH_API.value + "tarea/"+tarea_id.value, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "tarea-update/"+tarea_id.value, formData, {headers: headersAxios.value[0]})
        cod_mensaje = 'MM'
      }
      if (props.accion == 'B') {
        //const body_update = await axios.delete(ENDPOINT_PATH_API.value + "tarea/"+tarea_id.value, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "tarea-delete/"+tarea_id.value, formData, {headers: headersAxios.value[0]})
        cod_mensaje = 'MB'
      }
    }
    loading.value = false
    
    if (!hasError.value) {
      router.push('/tareas-list/'+cod_mensaje);
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
