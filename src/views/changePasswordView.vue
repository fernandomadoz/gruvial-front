<template>

    <!-- MENSAJE -->
    <v-alert :type="error ? 'error' : 'success'" v-show="mensaje != null">{{ mensaje }}</v-alert>
    <hr  v-show="mensaje != null" />  

    <v-card
    class="mx-auto p-1 m-1 pb-10"
    max-width="644"
    >
      <v-toolbar
        color="yellow"
        cards
        dark
        flat
      >
        <v-card-title class="text-h6 font-weight-regular">
          Necesitamos que cambia su password
        </v-card-title>
      </v-toolbar>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        class="pa-4 pt-6"
      >
        <v-text-field
          v-model="password"
          :rules="rulesPassword"
          variant="filled"
          color="deep-purple"
          counter="6"
          label="Password actual"
          style="min-height: 96px"
          @click:append="(show = !show)"
          :type="show ? 'text' : 'password'"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        ></v-text-field>

        <v-text-field
          v-model="newPassword"
          :rules="rulesNewPassword"
          variant="filled"
          color="deep-purple"
          counter="6"
          label="Nuevo Password"
          style="min-height: 96px"
          @click:append="(show1 = !show1)"
          :type="show1 ? 'text' : 'password'"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        ></v-text-field>

        <v-text-field
          v-model="password2"
          :rules="rulesPassword2"
          variant="filled"
          color="deep-purple"
          counter="6"
          label="Confirmación de Nuevo assword"
          style="min-height: 96px"
          @click:append="(show2 = !show2)"
          :type="show2 ? 'text' : 'password'"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        ></v-text-field>

      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          variant="text"
          @click="$refs.form.reset()"
        >
          Limpiar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="deep-purple-accent-4"
          @click="validate"
        >
          Cambiar el Password
        </v-btn>
      </v-card-actions>
      <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
      >

      </v-dialog>
    </v-card>
  </template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useData } from '../composables/useData';
import router from "@/router";

const { user_id, headersAxios } = useData();

const ENDPOINT_PATH_API = ref(import.meta.env.VITE_ENDPOINT_PATH+'api/')

const form = ref(false)
let show = ref(false)
let show1 = ref(false)
let show2 = ref(false)
let dialog = ref(false)
let valid = ref(true);
let password = ref('')
let newPassword = ref('')
let password2 = ref('')
let mensaje = ref(null)
let error = ref(false)



//Valido el Formulario
async function validate () {
  await form.value.validate()
  if (valid.value) {
      enviarForm()
  }    
  else {
    console.log('no valido')

  }
}

//Envio el Formulario
async function enviarForm() {
  
  //construjo el json a enviar a laravel
  let json = JSON.stringify({
    user_id: user_id.value,
    password: password.value,
    newPassword: newPassword.value
  });

  let body_abm = ''
  body_abm = await axios.post(ENDPOINT_PATH_API.value + "change-password", json, {headers: headersAxios.value[0]})
  
  mensaje.value = body_abm['data'].mensaje
  error.value = body_abm['data'].error
  dialog.value = false

  getTime()
}

const rulesPassword = [
v => !!v || 'El password actual es requerido'
]

let rulesNewPassword = [
    value => {
        if (value == '') {
            return 'Este valor es requerido'
        }
        if (value.length < 6) {
            return 'Mínimo 6 caracteres!'
        }
    }
]


let rulesPassword2 = [
    value => {
        if (value != newPassword.value) {
            return 'Los Passwords deben coincidir'
        }
    }
]

function getTime() {
  setTimeout(() => {
    mensaje.value = null
    if (!error.value) {
        console.log('redirigir')
        router.push("/")
    }
  }, 2 * 1000);

}

</script>