<template>
  

    
  
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
      >
        <v-tab value="Encabezado">Encabezado</v-tab>
        <v-tab value="Documentos" v-if="maquina_id!=-1">Documentos</v-tab>
        <v-tab value="Repuestos" v-if="maquina_id!=-1">Repuestos</v-tab>
        <v-tab value="Mantenimientos" v-if="maquina_id!=-1">Mantenimientos (Registros)</v-tab>
        <v-tab value="Combustible" v-if="maquina_id!=-1">Combustible</v-tab>
        <v-tab value="Preventivos" v-if="maquina_id!=-1">Reglas (Preventivos)</v-tab>
        <v-tab value="Registros" v-if="maquina_id!=-1">Registros</v-tab>
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
                    v-model="firma_id_maquina"
                    :items="firmas2"
                    item-title="firma"
                    item-value="id"
                    label="Firma"
                    return-object
                    :rules="firmaRules"
                    required
                  ></v-select>    
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-autocomplete
                    v-model="tipo_de_maquina_id"
                    :items="tipos_de_maquina"
                    :rules="tipo_de_maquinaRules"
                    item-title="tipo_de_maquina"
                    item-value="id"
                    dense
                    filled
                    label="Tipo de Cliente *"
                  ></v-autocomplete> 
                </v-col>
            </v-row>

              <v-row>

                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="sino_activa"
                    :true-value="1"
                    :false-value="0"
                    label="Activa?"
                    color="success"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="corresponde_registro_de_horas"
                    :true-value="1"
                    :false-value="0"
                    label="Corresponde registro de horas?"
                    color="success"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="corresponde_registro_de_kms"
                    :true-value="1"
                    :false-value="0"
                    label="Corresponde registro de kms?"
                    color="success"
                  ></v-switch>
                </v-col>

            </v-row>

              <v-row>
                

                <v-col cols="12" sm="6" md="2" >
                  <v-text-field
                    v-model="codigo"
                    counter="80"
                    clearable
                    label="Codigo"
                  ></v-text-field>   
                </v-col>
                
                <v-col cols="12" sm="6" md="10" >
                  <v-text-field
                    v-model="nombre_de_maquina"
                    :rules="nombre_de_maquinaRules"
                    counter="80"
                    clearable
                    label="Nombre de Maquina *"
                  ></v-text-field>           
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


            </v-form>
          </v-window-item>
          

          <v-window-item value="Documentos" v-if="maquina_id!=-1">
            <MaquinasDocumentosList :maquina_id="props.maquina_id" />            
          </v-window-item>

          <v-window-item value="Repuestos" v-if="maquina_id!=-1">
            <MaquinasRepuestosList :maquina_id="props.maquina_id" />            
          </v-window-item>

          <v-window-item value="Mantenimientos" v-if="maquina_id!=-1">
            <MaquinasMantenimientosList :maquina_id="props.maquina_id" :corresponde_registro_de_horas="corresponde_registro_de_horas" :corresponde_registro_de_kms="corresponde_registro_de_kms" />            
          </v-window-item>

          <v-window-item value="Combustible" v-if="maquina_id!=-1">
            <MaquinasFluidosList :maquina_id="props.maquina_id" />            
          </v-window-item>


          <v-window-item value="Preventivos" v-if="maquina_id!=-1">
            <MaquinasPreventivosList :maquina_id="props.maquina_id" :corresponde_registro_de_horas="corresponde_registro_de_horas" :corresponde_registro_de_kms="corresponde_registro_de_kms" />            
          </v-window-item>

          <v-window-item value="Registros" v-if="maquina_id!=-1">
            <MaquinasRegistrosList :maquina_id="props.maquina_id" :corresponde_registro_de_horas="corresponde_registro_de_horas" :corresponde_registro_de_kms="corresponde_registro_de_kms" />            
          </v-window-item>


        </v-window>
      </v-card-text>
    </v-card>
    
  <!--v-card style="padding: 20px">{{maquina}}</v-card>
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
  import MaquinasDocumentosList from '../components/MaquinasDocumentosList.vue';
  import MaquinasRepuestosList from '../components/MaquinasRepuestosList.vue';
  import MaquinasMantenimientosList from '../components/MaquinasMantenimientosList.vue';
  import MaquinasFluidosList from '../components/MaquinasFluidosList.vue';
  import MaquinasPreventivosList from '../components/MaquinasPreventivosList.vue';
  import MaquinasRegistrosList from '../components/MaquinasRegistrosList.vue';
  
  

  const props = defineProps({
    maquina_id: {
          type: Number,
          default: null
      },
    tab: {
          type: String,
          default: null
      },
  })
  

  //Variables grales de Aplicacion
  const { headersAxios, firmas, firma_id, user_id, setearMensajeStore, mensajeStore } = useData()
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  let maquina = ref([])
  let titulo = ''
  let tab = ref('one')
  const loading = ref(false)
  const hasError = ref(false)

  //Traigo firmas
  const body_firmas = await axios.get(ENDPOINT_PATH_API.value + "firma", {headers: headersAxios.value[0]})
  let firmas2 = body_firmas['data']

  //Traigo Tipos de Maquinas
  const body_tipos_de_maquina = await axios.get(ENDPOINT_PATH_API.value + "tipo-de-maquina", {headers: headersAxios.value[0]})
  let tipos_de_maquina = ref(body_tipos_de_maquina['data'])

  //Variables maquinas_encabezados
  let firma_id_maquina = ref(null)
  const formEncabezado = ref(null) 
  let codigo = ref(null)
  let nombre_de_maquina = ref(null)
  let tipo_de_maquina_id = ref(null)
  let sino_activa = ref(0)
  let corresponde_registro_de_horas = ref(0)
  let corresponde_registro_de_kms = ref(0)
  const accionPosterior = ref(null)

  if (props.maquina_id == -1) {
    // Seteo valores de variables para un alta de maquinas_encabezados
    firma_id_maquina.value = Number(firma_id.value)
    titulo = 'Crear nueva Maquina'
    maquina = -1
  }
  else {
    // Traigo maquinas_encabezados y seteo variables
    const body_find = await axios.get(ENDPOINT_PATH_API.value + "maquina/"+props.maquina_id, {headers: headersAxios.value[0]})
    maquina = body_find['data']
    titulo = 'Maquina ID: '+props.maquina_id+' | '+maquina.data.nombre_de_maquina
    firma_id_maquina.value = maquina.data.firma_id
    codigo.value = maquina.data.codigo
    nombre_de_maquina.value = maquina.data.nombre_de_maquina
    tipo_de_maquina_id.value = maquina.data.tipo_de_maquina_id
    sino_activa.value = maquina.data.sino_activa
    corresponde_registro_de_horas.value = maquina.data.corresponde_registro_de_horas
    corresponde_registro_de_kms.value = maquina.data.corresponde_registro_de_kms

  }




  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos 
  let valid = ref(true);
  const firmaRules = [
    v => !!v || 'Firma es requerido'
  ];
  const codigoRules =  [
    v => (v && v.length <= 80) || 'Maximo 80 caracteres',
  ];
  

  let nombre_de_maquinaRules = [
      value => {
        if (!value) {
            return 'Requerido'
        }           
        return true
      }
  ]

  let tipo_de_maquinaRules = [
      value => {
        if (!value) {
            return 'Requerido'
        }           
        return true
      }
  ]

  //Valido el Formulario
  async function validate(accionValidate = null) {
    let resul = await formEncabezado.value.validate()
    accionPosterior.value = accionValidate

    // Si el formulario es valido guardo los datos
    if (valid.value) {
      enviarFormEncabazado()
    }
    else {
      console.log(valid.value)
      console.log(resul)
    }

  };


  //Envio el Formulario
  async function enviarFormEncabazado() {

    loading.value = true

    const json = JSON.stringify({ 
      maquina_id: props.maquina_id,
      firma_id: firma_id_maquina.value,
      sino_activa: sino_activa.value,
      corresponde_registro_de_horas: corresponde_registro_de_horas.value,
      corresponde_registro_de_kms: corresponde_registro_de_kms.value,
      nombre_de_maquina: nombre_de_maquina.value,
      codigo: codigo.value,
      tipo_de_maquina_id: tipo_de_maquina_id.value,
    });

    let resultadoGuardar = null;

    //Si maquina_id = -1 creo el maquina sino actualizo
    if (props.maquina_id == -1) {
      const body_new = await axios.post(ENDPOINT_PATH_API.value + "maquina-create", json, {headers: headersAxios.value[0]})
      setearMensajeStore(body_new['data'].mensaje)
      hasError.value = body_new['data'].hasError
      let maquina_id_create = body_new['data'].Maquina.id
        console.log('hasError.value')
        console.log(hasError.value)
        if (!hasError.value) {
        console.log('entro')
        router.push("/maquina/"+maquina_id_create);
      }
    }
    else {
      if (accionPosterior.value == 'borrar-y-volver-al-listado') {
        //const body_update = await axios.delete(ENDPOINT_PATH_API.value + "compra-encabezado/"+props.compra_encabezado_id, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "maquina-delete/"+props.maquina_id, json, {headers: headersAxios.value[0]})
        let maquina_update = body_update['data']
        setearMensajeStore(body_update['data'].mensaje)
      }
      else {
        //const body_update = await axios.put(ENDPOINT_PATH_API.value + "maquina-encabezado/"+props.maquina_id, json, {headers: headersAxios.value[0]})
        const body_update = await axios.post(ENDPOINT_PATH_API.value + "maquina-update/"+props.maquina_id, json, {headers: headersAxios.value[0]})
        let maquina_update = body_update['data']
        setearMensajeStore(body_update['data'].mensaje)
      }
    }    

    if (!hasError.value) {
      getTime()
    }

    loading.value = false
  }

  // ----- Fin: Validación y envio del Formulario Encabezado
  
  function getTime() {
    setTimeout(() => {
      setearMensajeStore(null)
      
      if (accionPosterior.value == 'borrar-y-volver-al-listado') {
        router.push("/maquinas-list");        
      }

    }, 2 * 1000);
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
