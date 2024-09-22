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
                    <th class="text-left">Maquina</th>
                    <th class="text-left">Lugar de trabajo</th>
                    <th class="text-left">Fecha Inicio</th>
                    <th class="text-left">Fecha Fin</th>
                    <th class="text-left">Tipo de Trabajo</th>
                    <th class="text-left">Cantidad</th>
                    <th class="text-left">Importe</th>
                    <th class="text-left">Remito</th>
                    <th class="text-left">observaciones</th>
                    <th class="text-left">Realizado</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaLineas"
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
                    <td>{{ (item.maquina.nombre_de_maquina) }}</td>
                    <td>{{ (item.lugar_de_trabajo) }}</td>
                    <td>{{ item.fecha_inicio }}</td>
                    <td>{{ item.fecha_fin }}</td>
                    <td>{{ (item.tipo_de_trabajo.tipo_de_trabajo) }}</td>
                    <td>{{ (item.cantidad_unidades_trabajo) }} ({{ (item.unidad_de_trabajo.unidad_de_trabajo) }})</td>
                    <td>{{ item.importe }}</td>
                    <td>
                        Remito: {{ item.nro_de_remito }} <br>
                        <span v-if="item.persona_que_autoriza != null">Autorizo: {{ item.persona_que_autoriza }} <br></span>
                        <span v-if="item.persona_que_supervisa != null">Superviso: {{ item.persona_que_supervisa }} <br></span>
                    </td>
                    <td>{{ item.observaciones }}</td>
                    <td>{{ item.trabajo_realizado }}</td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Servicio a realizar</span>
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
                    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
                        <label>First Name</label>
                        <Field name="firstName" type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }" />
                        <div class="invalid-feedback">{{errors.firstName}}</div>
                        <button type="submit" class="btn btn-primary mr-1">Register</button>
                    </Form>
                    <v-form
                        ref="formServicios"
                        v-model="validServicio"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete
                                    v-model="trabajo_linea.maquina.id"
                                    :items="maquinas"
                                    :disabled="deshabilitarEdicionCamposABM"
                                    item-title="nombre_de_maquina"
                                    item-value="id"
                                    dense
                                    filled
                                    label="Maquina"
                                    :rules="maquinaRules"
                                    required
                                ></v-autocomplete>      
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="trabajo_linea.lugar_de_trabajo"
                                    :disabled="deshabilitarEdicionCamposABM"
                                    :rules="lugar_de_trabajoRules"
                                    maxlength="150"
                                    counter="150"
                                    label="Lugar de trabajo"
                                ></v-text-field>      
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="trabajo_linea.tipo_de_trabajo.id"
                                    :items="tipos_de_trabajos"
                                    :disabled="deshabilitarEdicionCamposABM"
                                    item-title="tipo_de_trabajo"
                                    item-value="id"
                                    label="Tipo de Trabajo"
                                    return-object
                                    :rules="tipo_de_trabajoRules"
                                    required
                                ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABM"
                                    v-model="trabajo_linea.fecha_inicio_f"
                                    :rules="fecha_inicioRules"
                                    label="Fecha de Inicio"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            <!--v-col cols="12" sm="6" md="4">                   
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Fecha de Inicio</label>
                                    <input v-model="trabajo_linea.fecha_inicio_f" type="date" name="bday" required  class="form-control bg-field" :rules="fecha_inicioRules" :disabled="deshabilitarEdicionCamposABM">
                                </div>     
                            </v-col-->
                            <v-col cols="12" sm="6" md="4">
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Fecha de Fin</label>
                                    <input v-model="trabajo_linea.fecha_fin_f" type="date" name="bday" required  class="form-control bg-field" :disabled="deshabilitarEdicionCamposABM">
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-switch
                                    :disabled="deshabilitarEdicionCamposABM"
                                    v-model="trabajo_realizado"
                                    color="success"
                                    label="Trabajo realizado?"
                                ></v-switch>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="trabajo_linea.unidad_de_trabajo.id"
                                    :disabled="deshabilitarEdicionCamposABM"
                                    :hint="cambiarSufijo(`${trabajo_linea.unidad_de_trabajo}`)"
                                    :items="unidades_de_trabajos"
                                    item-title="unidad_de_trabajo"
                                    item-value="id"
                                    label="Unidad de Trabajo"
                                    return-object
                                    :rules="unidad_de_trabajoRules"
                                    required
                                ></v-select>
                                {{trabajo_linea.unidad_de_trabajo}}
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-my-directive
                                    v-model="trabajo_linea.cantidad_unidades_trabajo"
                                    :disabled="deshabilitarEdicionCamposABM"
                                    :rules="cantidad_unidades_trabajoRules"
                                    min="0"
                                    type="number"
                                    counter="150"
                                    label="Cantidad"
                                    :suffix="sufijo_cant"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABM"
                                    v-model="trabajo_linea.importe"
                                    :rules="importeRules"
                                    label="Importe"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABM"
                                    v-model="trabajo_linea.nro_de_remito"
                                    :rules="nro_de_remitoRules"
                                    counter="15"
                                    label="Nro de Remito"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABM"
                                    v-model="trabajo_linea.persona_que_autoriza"
                                    :rules="persona_que_autorizaRules"
                                    counter="80"
                                    maxlength="80"
                                    label="Persona que autoriza"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABM"
                                    v-model="trabajo_linea.persona_que_supervisa"
                                    :rules="persona_que_supervisaRules"
                                    counter="80"
                                    maxlength="80"
                                    label="Persona que supervisa"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABM"
                                    label="Observaciones"
                                    maxlength="250"
                                    counter="250"
                                    :rules="observacionesRules"
                                    v-model="trabajo_linea.observaciones"
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
                        {{validServicio}}
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
                <small>*indicates required field</small>
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
  import { Form, Field } from 'vee-validate';
  import * as Yup from 'yup';


const schema = Yup.object().shape({
    firstName: Yup.string()
        .required('First Name is required'),
});

function onSubmit(values) {
    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(values, null, 4));
}

  const { ENDPOINT_PATH_API, token, headersAxios, trabajo_encabezado_id, user_id } = useData();
  const error = ref(false);
  const mensaje = ref(null);
  let dialog = ref(false)
  let trabajo_linea = ref(null)
  let trabajo_realizado = ref(false)
  let trabajo_linea_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABM = ref(false)
  let accionABM = ref(null)
  let sufijo_cant = ref('')


  //Variables trabajos_encabezados
  const formServicios = ref(null) 
  let fecha_inicio = ref(null)


  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo las lineas de trabajo
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea-listar", json, {headers: headersAxios.value[0]});
  let listaLineas = ref(body['data']);

  const props = defineProps({

    trabajo_linea2: {
        default: {
            id: 1,
            maquina_id: 1,
            lugar_de_trabajo: 'parque industrial',
            fecha_inicio: '2022-07-08',
            fecha_fin: '2022-07-08'

        }
    },
    valorSeleccionado: {
        default: null
    } 

  });
          
  //Traigo maquinas
  const body_maquinas = await axios.get(ENDPOINT_PATH_API.value + "maquina", {headers: headersAxios.value[0]})
  let maquinas = body_maquinas['data']

  //Traigo tipos de trabajos
  const body_tipos_de_trabajos = await axios.get(ENDPOINT_PATH_API.value + "tipo_de_trabajo", {headers: headersAxios.value[0]})
  let tipos_de_trabajos = body_tipos_de_trabajos['data']

  //Traigo tipos de trabajos
  const body_unidades_de_trabajos = await axios.get(ENDPOINT_PATH_API.value + "unidad_de_trabajo", {headers: headersAxios.value[0]})
  let unidades_de_trabajos = body_unidades_de_trabajos['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

/*
  //Rules de los Campos
  //let validServicio = ref(true);
  const maquinaRules = [
    v => !!v || 'Es requerido'
  ];
  const tipo_de_trabajoRules = [
    v => !!v || 'Es requerido'
  ];
  const fecha_inicioRules = [
    v => !!v || 'Es requerido'
  ];
  const unidad_de_trabajoRules = [
    v => !!v || 'Es requerido'
  ];
  const cantidad_unidades_trabajoRules = [
    v => !!v || 'Es requerido'
  ];
  const importeRules = [
    v => !!v || 'Es requerido'
  ];
  const nro_de_remitoRules = [
    v => (v && v.length <= 15) || 'Maximo 15 caracteres',
  ];
  const lugar_de_trabajoRules = [
    v => (v && v.length <= 15) || 'Maximo 150 caracteres'+v.length,
  ];
  const persona_que_autorizaRules = [
    v => (v && v.length < 80) || 'Maximo 80 caracteres',
  ];
  const persona_que_supervisaRules = [
    v => (v && v.length < 80) || 'Maximo 80 caracteres',
  ];
  const observacionesRules = [
    v => (v && v.length <= 250) || 'Maximo 250 caracteres',
  ];
*/
  //Valido el Formulario
  /*
  const validate = () => {
    console.log('formServicios.value: ')
    console.log(formServicios.value)
    let resul = formServicios.value.validate()
    console.log('resul: ')
    console.log(resul)
    //this.$refs.form.validate()

    // Si el formulario es valido guardo los datos
    if (validServicio) {
      enviarFormEncabazado()
    }
    else {
        console.log('error form validacion: ')
        console.log(resul)
    }

  };
  */

  //Envio el Formulario
  async function enviarFormEncabazado() {

    let tipo_de_trabajo_id = trabajo_linea.value.tipo_de_trabajo.id
    if (typeof(tipo_de_trabajo_id) == 'object') {
      tipo_de_trabajo_id = tipo_de_trabajo_id.id
    }

    let unidad_de_trabajo_id = trabajo_linea.value.unidad_de_trabajo.id
    if (typeof(unidad_de_trabajo_id) == 'object') {
      unidad_de_trabajo_id = unidad_de_trabajo_id.id
    }

    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      maquina_id: trabajo_linea.value.maquina.id,
      lugar_de_trabajo: trabajo_linea.value.lugar_de_trabajo,
      fecha_inicio: trabajo_linea.value.fecha_inicio_f,
      fecha_fin: trabajo_linea.value.fecha_fin_f,
      tipo_de_trabajo_id: tipo_de_trabajo_id,
      unidad_de_trabajo_id: unidad_de_trabajo_id,
      cantidad_unidades_trabajo: trabajo_linea.value.cantidad_unidades_trabajo,
      importe: trabajo_linea.value.importe,
      nro_de_remito: trabajo_linea.value.nro_de_remito,
      persona_que_autoriza: trabajo_linea.value.persona_que_autoriza,
      persona_que_supervisa: trabajo_linea.value.persona_que_supervisa,
      observaciones: trabajo_linea.value.observaciones,
      user_id: user_id.value,
      trabajo_realizado: tf_a_sino(trabajo_linea.value.trabajo_realizado)
    });
    
    let resultadoGuardar = null

    //Si trabajo_linea_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      body_abm = await axios.put(ENDPOINT_PATH_API.value + "trabajo-linea/"+trabajo_linea_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      body_abm = await axios.delete(ENDPOINT_PATH_API.value + "trabajo-linea/"+trabajo_linea_id.value, json, {headers: headersAxios.value[0]})
    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las lineas de trabajo
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea-listar", json, {headers: headersAxios.value[0]})
    listaLineas.value = body['data'];

    getTime()
  }

  function ABMLinea(accion, linea) {
    accionABM.value = accion
    if (accion == 'A') {
        trabajo_linea_id.value = -1
        trabajo_linea.value = {

            trabajo_encabezado_id: trabajo_encabezado_id.value,
            maquina: {
                id: null
            },
            lugar_de_trabajo: null,
            fecha_inicio: null,
            fecha_fin: null,
            tipo_de_trabajo: {
                id: null
            },
            unidad_de_trabajo: {
                id: null
            },
            cantidad_unidades_trabajo: null,
            importe: null,
            nro_de_remito: null,
            persona_que_autoriza: null,
            persona_que_supervisa: null,
            observaciones: null,
            user_id: user_id.value
        }
        trabajo_realizado.value = false

        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABM.value = false    
        
        

        /*
        trabajo_linea.value.id = null
        trabajo_linea.value.maquina.id = null
        trabajo_linea.value.lugar_de_trabajo = null
        trabajo_linea.value.tipo_de_trabajo.id = null
        trabajo_linea.value.fecha_inicio_f = null
        trabajo_linea.value.fecha_fin_f = null
        trabajo_linea.value.unidad_de_trabajo.id = null
        trabajo_linea.value.cantidad = null
        trabajo_linea.value.importe = null
        trabajo_linea.value.nro_de_remito = null
        trabajo_linea.value.persona_que_autoriza = null
        trabajo_linea.value.persona_que_supervisa = null
        trabajo_linea.value.observaciones = null
        trabajo_realizado.value = false
        */

    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        trabajo_linea.value = linea
        trabajo_realizado.value = sino_a_tf(trabajo_linea.value.trabajo_realizado)
        trabajo_linea_id.value = trabajo_linea.value.id        
        deshabilitarEdicionCamposABM.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            trabajo_linea.value = linea
            trabajo_realizado.value = sino_a_tf(trabajo_linea.value.trabajo_realizado)
            trabajo_linea_id.value = trabajo_linea.value.id   
            deshabilitarEdicionCamposABM.value = true       
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

  function cambiarSufijo(sufijo_unidad_de_trabajo) {
    if (sufijo_unidad_de_trabajo.id != null) {
        if (sufijo_unidad_de_trabajo.id.unidad_de_trabajo == 'undefined') {
            sufijo_cant.value = ''
        }
        else {
            sufijo_cant.value = sufijo_unidad_de_trabajo+'S'
        }
    }
  }
  
const vMyDirective = {
  beforeMount: (el) => {
    //sufijo_cant.value = ''
  }
}    

</script>

<script>
/*
  export default {
    data: () => ({
      validServicio: true
    }),

    methods: {
      validate () {
        let resul2 = this.$refs.formServicios.validate()
        console.log('validServicio: ')
        console.log(this.validServicio)
        if (this.validServicio) {
            this.enviarFormEncabazado()
        }
        
      }
    },
  }
  */
</script>