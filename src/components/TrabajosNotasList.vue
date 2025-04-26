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
                    <th class="text-left">Nota</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in listaNotas"
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
                    <td>{{ item.nota }}  <i class="txt_fecha"> | {{ item.created_at }}</i></td>
                </tr>
                </tbody>
            </v-table>
        </template>
  

        <v-card>
            <v-card-title>
                <v-col cols="12" sm="11" md="11">
                    <span class="text-h5">Nota</span>
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
                        ref="formNotas"
                        v-model="validNota"
                        lazy-validation
                    >
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                    :disabled="deshabilitarEdicionCamposABMNotas"
                                    :rules="notaRules"
                                    label="Nota *"
                                    counter="150"
                                    maxlength="150"
                                    v-model="nota.nota"
                                    required
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
                <small>*Campos obligatorios</small>
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

  const { token, headersAxios, trabajo_encabezado_id, user_id } = useData();
  const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')
  const error = ref(false);
  const mensaje = ref(null);
  const loading = ref(false)
  let dialog = ref(false)
  let nota = ref(null)
  let nota_id = ref(null)
  let botonABM = ref(null)
  let deshabilitarEdicionCamposABMNotas = ref(false)
  let accionABM = ref(null)

  //Variables trabajos_encabezados
  const formNotas = ref(null) 
  let fecha_de_nota = ref(null)


  let json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value
  });

  //Traigo las lineas de trabajo
  let body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-nota-listar", json, {headers: headersAxios.value[0]});
  let listaNotas = ref(body['data']);
          
  // ----- Inicio: Validación y envio del Formulario Encabezado

  //Rules de los Campos
  let validNota = ref(true);
  const notaRules = [
    v => !!v || 'Es requerido'
  ];

  //Valido el Formulario
  async function validate () {
    await formNotas.value.validate()
    if (validNota.value || accionABM.value == 'B') {
        enviarFormNota()
    }    
  }

  //Envio el Formulario
  async function enviarFormNota() {

    loading.value = true

    //construjo el json a enviar a laravel
    json = JSON.stringify({ 
      trabajo_encabezado_id: trabajo_encabezado_id.value,
      nota: nota.value.nota,
    });
    
    //Si nota_id = -1 creo la linea de trabajo sino actualizo
    let body_abm = ''
    if (accionABM.value == 'A') {
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "nota", json, {headers: headersAxios.value[0]})
    }
    if (accionABM.value == 'M') {
      //body_abm = await axios.put(ENDPOINT_PATH_API.value + "nota/"+nota_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "nota-update/"+nota_id.value, json, {headers: headersAxios.value[0]})
    }  
    
    if (accionABM.value == 'B') {
      //body_abm = await axios.delete(ENDPOINT_PATH_API.value + "nota/"+nota_id.value, json, {headers: headersAxios.value[0]})
      body_abm = await axios.post(ENDPOINT_PATH_API.value + "nota-delete/"+nota_id.value, json, {headers: headersAxios.value[0]})

    }      
    mensaje.value = body_abm['data'].mensaje

    //Traigo las notas
    json = JSON.stringify({ 
        trabajo_encabezado_id: trabajo_encabezado_id.value
    });
    dialog.value = false

    
    body = await axios.post(ENDPOINT_PATH_API.value + "trabajo-nota-listar", json, {headers: headersAxios.value[0]})
    listaNotas.value = body['data'];

    getTime()
    loading.value = false
  }

  function ABMLinea(accion, item) {
    accionABM.value = accion
    if (accion == 'A') {
        nota_id.value = -1
        nota.value = {
            trabajo_encabezado_id: trabajo_encabezado_id.value,
            nota: null
        }
        
        botonABM.value = 'Insertar';
        deshabilitarEdicionCamposABMNotas.value = false    
        
    }
    if (accion == 'M') {
        botonABM.value = 'Modificar';
        nota.value = item
        nota_id.value = nota.value.id        
        deshabilitarEdicionCamposABMNotas.value = false       
    }
    if (accion == 'B') {
            botonABM.value = 'Eliminar';     
            nota.value = item
            nota_id.value = nota.value.id   
            deshabilitarEdicionCamposABMNotas.value = true       
    }
  }


  function getTime() {
    setTimeout(() => {
      mensaje.value = null
    }, 2 * 1000);

  }


</script>


<style scoped>
.txt_fecha {
  text-align: right;
  float: right;
}
</style>