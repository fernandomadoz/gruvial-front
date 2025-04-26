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
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('id')">Orden de Servicio</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('id')">id</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('maquina.nombre_de_maquina')">Maquina</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('fecha_inicio_f')">Fecha Inicio</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('fecha_fin_f')">Fecha Fin</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('tipo_de_trabajo.tipo_de_trabajo')">Tipo de Trabajo</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('importe')">Importe</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('importe_cobrado')">Importe Cobrado</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('observaciones')">observaciones</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('trabajo_confirmado')">Confirmado</th>
                    <th class="text-left pointer"  @click="cambiarOrdenLineas('trabajo_realizado')">Realizado</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaLineas"
                    :key="item.id"
                    v-bind:class="{ 
                        realizado: item.trabajo_realizado == 'SI', 
                        norealizado: item.trabajo_realizado == 'NO', 
                        }"
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
                    <td>
                         <a :href="ENDPOINT_PATH+'remito-de-servicio/'+item.id " target="_blank">
                        <v-btn
                            size="small"
                            icon="mdi-file-document-edit"
                            color="blue"
                        ></v-btn>
                        </a>
                    </td>
                    <td>{{ (item.id) }}</td>
                    <td>{{ (item.maquina?.nombre_de_maquina) }}</td>
                    <td>{{ item.fecha_inicio }}</td>
                    <td>{{ item.fecha_fin }}</td>
                    <td>{{ (item.tipo_de_trabajo?.tipo_de_trabajo) }}</td>
                    <td valign="top" class="text-h6">${{ formatoNumero(item.importe) }}</td>
                    <td valign="top" class="text-h6">${{ formatoNumero(item.importe_cobrado) }}<br>
                        <v-expansion-panels v-if="item.cobros.length>4">
                            <v-expansion-panel v-bind:class="classFactura(item)" >
                                <v-expansion-panel-title>Cobros asociados</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-chip
                                        size="small"
                                        v-for="cobro in item.cobros"
                                        :key="cobro"
                                        class="m-1"
                                        >
                                        ${{ formatoNumero(cobro.importe_total_con_retenciones) }}&nbsp; (Cobro id: {{ cobro.id }})
                                    </v-chip>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        
                        <v-chip v-else
                            size="small"
                            v-for="cobro in item.cobros"
                            :key="cobro"
                            class="m-1"
                            >
                            ${{ formatoNumero(cobro.importe_total_con_retenciones) }}&nbsp; (Cobro id: {{ cobro.id }})
                        </v-chip>

                    </td>
                    <td>{{ item.observaciones }}</td>
                    <td>{{ item.trabajo_confirmado }}</td>
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
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    item-title="nombre_de_maquina"
                                    item-value="id"
                                    dense
                                    filled
                                    label="Maquina"
                                    :rules="maquinaRules"
                                    required
                                ></v-autocomplete>      
                            </v-col>
                            <!--v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="trabajo_linea.lugar_de_trabajo"
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    maxlength="150"
                                    counter="150"
                                    label="Lugar de trabajo"
                                ></v-text-field>      
                            </v-col-->
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="trabajo_linea.tipo_de_trabajo.id"
                                    :items="tipos_de_trabajos"
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    item-title="tipo_de_trabajo"
                                    item-value="id"
                                    label="Tipo de Trabajo"
                                    :rules="tipo_de_trabajoRules"
                                    required
                                ></v-select>     
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="trabajo_linea.fecha_inicio_f"
                                    :rules="fecha_inicioRules"
                                    label="Fecha de Inicio"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="trabajo_linea.fecha_fin_f"
                                    label="Fecha de Fin"
                                    type="date"
                                ></v-text-field>  
                            </v-col>
                            <!--v-col cols="12" sm="6" md="4">                   
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Fecha de Inicio</label>
                                    <input v-model="trabajo_linea.fecha_inicio_f" type="date" name="bday" required  class="form-control bg-field" :rules="fecha_inicioRules" :disabled="deshabilitarEdicionCamposABMEncabezado">
                                </div>     
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Fecha de Fin</label>
                                    <input v-model="trabajo_linea.fecha_fin_f" type="date" name="bday" required  class="form-control bg-field" :disabled="deshabilitarEdicionCamposABMEncabezado">
                                </div>
                            </v-col-->
                            <v-col cols="12" sm="6" md="4">
                                <v-switch
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="trabajo_confirmado"
                                    color="success"
                                    label="Trabajo confirmado?"
                                ></v-switch>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-switch
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="trabajo_realizado"
                                    color="success"
                                    label="Trabajo realizado?"
                                ></v-switch>
                            </v-col>
                            <!--v-col cols="12" sm="6" md="4">
                                <v-select
                                    v-model="trabajo_linea.unidad_de_trabajo.id"
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    :hint="cambiarSufijo(`${trabajo_linea.unidad_de_trabajo}`)"
                                    :items="unidades_de_trabajos"
                                    item-title="unidad_de_trabajo"
                                    item-value="id"
                                    label="Unidad de Trabajo"
                                    return-object
                                    :rules="unidad_de_trabajoRules"
                                    
                                ></v-select>
                            </v-col-->
                            <!--v-col cols="12" sm="6" md="4">
                                <v-text-field v-my-directive
                                    v-model="trabajo_linea.cantidad_unidades_trabajo"
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    :rules="cantidad_unidades_trabajoRules"
                                    type="number"
                                    min="0"
                                    label="Cantidad"
                                    :suffix="sufijo_cant"
                                ></v-text-field>  
                            </v-col-->
                            <v-col cols="12" sm="6" md="4">
                                <!--v-text-field
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="trabajo_linea.importe"
                                    :rules="importeRules"
                                    label="Importe"
                                    type="number"
                                    min="0"
                                    prefix="$"
                                ></v-text-field-->  
                                
                                <MoneyField
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    v-model="trabajo_linea.importe"
                                    :rules="importeRules"
                                    :options="currencyOptions_general"
                                    label="Importe"
                                >
                                </MoneyField> 
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMEncabezado"
                                    label="Observaciones"
                                    counter="500"
                                    maxlength="500"
                                    v-model="trabajo_linea.observaciones"
                                ></v-textarea>
                            </v-col>
                        </v-row>       


                        <v-spacer></v-spacer>
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
                            {{ botonABM }}  
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            color="grey"
                            @click="dialog = false"
                            :disabled="loading"
                        >
                            <v-icon
                            start
                            icon="mdi-content-save"
                            ></v-icon>
                            Cerrar  
                        </v-btn>

                        <v-progress-circular
                        indeterminate
                        color="amber"
                        v-show="loading"
                        ></v-progress-circular>

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
  import MoneyField from '../components/MoneyField.vue';
  import { cambiarOrden, crearOrdenActual } from '@/utils/sortUtils';

  const { token, headersAxios, trabajo_encabezado_id, user_id, firma_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const ENDPOINT_PATH = ref(import.meta.env.VITE_ENDPOINT_PATH)
  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  let trabajo_linea = ref(null)
  let trabajo_confirmado = ref(false)
  let trabajo_realizado = ref(false)
  let trabajo_linea_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMEncabezado = ref(false)
  let accionABM = ref(null)
  let sufijo_cant = ref('')

  const currencyOptions_general = ref({
    locale: 'es-AR', 
    currency: 'ARS', 
    distractionFree: false, 
    precision: 2, 
    //valueRange: {min: 1}, 
    autoDecimalMode: true, 
  })

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
  let jsonMaquinas = JSON.stringify({ 
      firma_id: firma_id.value
  });
  const body_maquinas = await axios.post(ENDPOINT_PATH_API.value + "maquinas-por-firma", jsonMaquinas, {headers: headersAxios.value[0]})
  let maquinas = body_maquinas['data']

  //Traigo tipos de trabajos
  const body_tipos_de_trabajos = await axios.post(ENDPOINT_PATH_API.value + "tipo-de-trabajo-por-firma", jsonMaquinas, {headers: headersAxios.value[0]})
  let tipos_de_trabajos = body_tipos_de_trabajos['data']

  //Traigo tipos de trabajos
  const body_unidades_de_trabajos = await axios.get(ENDPOINT_PATH_API.value + "unidad_de_trabajo", {headers: headersAxios.value[0]})
  let unidades_de_trabajos = body_unidades_de_trabajos['data']

  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validServicio = ref(true);


  const maquinaRules = [
        value => {
            if (!value && (accionABM.value != 'B')) {
                return 'Maquina es requerido'
            }
            else {
                return true
            }
        }
    ]

    const tipo_de_trabajoRules = [
        value => {
            if (!value && (accionABM.value != 'B')) {
                return 'Tipo de Trabajo es requerido'
            }
            else {
                return true
            }
        }
    ]

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

  //Valido el Formulario
  async function validate () {
    await formServicios.value.validate()
    if (validServicio.value || accionABM.value == 'B') {
        enviarFormServicio()
    }    
  }

  //Envio el Formulario
  async function enviarFormServicio() {

    loading.value = true
    /*
    let tipo_de_trabajo_id = trabajo_linea.value.tipo_de_trabajo.id
    if (typeof(tipo_de_trabajo_id) == 'object') {
      tipo_de_trabajo_id = tipo_de_trabajo_id.id
    }

    let unidad_de_trabajo_id = trabajo_linea.value.unidad_de_trabajo.id
    if (typeof(unidad_de_trabajo_id) == 'object') {
      unidad_de_trabajo_id = unidad_de_trabajo_id.id
    }
    */

    let trabajo_confirmado_sino = tf_a_sino(trabajo_confirmado.value)
    let trabajo_realizado_sino = tf_a_sino(trabajo_realizado.value)
    console.log(trabajo_realizado_sino)

    
    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      maquina_id: trabajo_linea.value.maquina.id,
      lugar_de_trabajo: trabajo_linea.value.lugar_de_trabajo,
      fecha_inicio: trabajo_linea.value.fecha_inicio_f,
      fecha_fin: trabajo_linea.value.fecha_fin_f,
      tipo_de_trabajo_id: trabajo_linea.value.tipo_de_trabajo.id,
      //unidad_de_trabajo_id: unidad_de_trabajo_id,
      cantidad_unidades_trabajo: trabajo_linea.value.cantidad_unidades_trabajo,
      importe: trabajo_linea.value.importe,
      observaciones: trabajo_linea.value.observaciones,
      user_id: user_id.value,
      trabajo_confirmado: trabajo_confirmado_sino,
      trabajo_realizado: trabajo_realizado_sino,
    });
    
    let resultadoGuardar = null

    //Si trabajo_linea_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      //body_abm = await axios.put(ENDPOINT_PATH_API.value + "trabajo-linea/"+trabajo_linea_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea-update/"+trabajo_linea_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "trabajo-linea/"+trabajo_linea_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "trabajo-linea-delete/"+trabajo_linea_id.value, json, {headers: headersAxios.value[0]})
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
    loading.value = false
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
            observaciones: null,
            user_id: user_id.value
        }
        trabajo_confirmado.value = false
        trabajo_realizado.value = false

        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMEncabezado.value = false    
        
        

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
        deshabilitarEdicionCamposABMEncabezado.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';  
            deshabilitarEdicionCamposABMEncabezado.value = true       
    }
    if (accion == 'M' || accion == 'B') {
        
        trabajo_linea.value = linea
        if (trabajo_linea.value.maquina === null) {
            trabajo_linea.value.maquina = {
                id: null
            }
        }
        if (trabajo_linea.value.unidad_de_trabajo === null) {
            trabajo_linea.value.unidad_de_trabajo = {
                id: null
            }
        }
        if (trabajo_linea.value.tipo_de_trabajo === null) {
            trabajo_linea.value.tipo_de_trabajo = {
                id: null
            }
        }
        trabajo_confirmado.value = sino_a_tf(trabajo_linea.value.trabajo_confirmado)
        trabajo_realizado.value = sino_a_tf(trabajo_linea.value.trabajo_realizado)
        trabajo_linea_id.value = trabajo_linea.value.id        
    }
  }


  function sino_a_tf(sino) {
    return sino == 'SI' ? true : false
  }

  function tf_a_sino(tf) {
    console.log('tf')
    console.log(tf)
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
            sufijo_cant.value = sufijo_unidad_de_trabajo.id.unidad_de_trabajo+'S'
        }
    }
  }
  
const vMyDirective = {
  beforeMount: (el) => {
    //sufijo_cant.value = ''
  }
}    
    
  function formatoNumero(numero) {
        let decimal = {useGrouping: false }
        let moneda = { style: "currency", minimumFractionDigits: 2, maximumFractionDigits: 2 }
        //return Number(numero).toLocaleString("ARS", decimal)
        return Number(numero).toLocaleString("es-AR", 'ARS')

    }



    // Crear una instancia de `ordenActual` utilizando la función de utilidades
    const ordenActual = crearOrdenActual();

    // Usar la función importada para cambiar el orden de `cobros`
    const cambiarOrdenLineas = (propiedad) => {
    cambiarOrden(listaLineas.value, ordenActual.value, propiedad);
    };
</script>


<style scoped>
.norealizado {
  background-color: #ffbdc3;
}
.realizado {
  background-color: #c4ffbd;
}


.pointer {
  cursor: pointer;
}
</style>