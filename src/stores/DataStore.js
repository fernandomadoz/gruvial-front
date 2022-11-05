import { defineStore } from "pinia";
import auth from "@/logic/auth";
import Cookies from "js-cookie";

import logoGruvial from '../assets/logo-gruvial.jpg'
import logoElVascoDesagotadora from '../assets/logo-elvasco-desagotadora.jpg'
import logoElVascoBanios from '../assets/logo-elvasco-banios.jpg'

export const useDataStore = defineStore("DataStore", {

    //state
    state: () =>{
        
        return {
            //ENDPOINT_PATH_API: "http://localhost:1010/gruvial/back/public_html/back/api/",
            ENDPOINT_PATH_API: "https://back.gruvial.com.ar/api/",
            isLogged: Cookies.get("logged"),
            user: Cookies.get("userLogged"),
            token: Cookies.get("token"),
            firma_id: Cookies.get("firma_id"),
            user_id: Cookies.get("user_id"),
            mensajeStore: null,
            trabajo_encabezado_id: null,
            firmas: [
                {id: 1, firma: 'Gruvial', logo: logoGruvial},
                {id: 2, firma: 'Desagotadora', logo: logoElVascoDesagotadora},
                {id: 3, firma: 'Baños Quimicos', logo: logoElVascoBanios},
              ]
            
        };
    },

    getters: {
        headersAxios: (state) => [{
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": 'Bearer ' + state.token
        }]
    },

    actions: {
        setearUser(email, isLogged, token, user_id) {
            this.user = email;
            this.isLogged = isLogged;
            this.token = token;
            this.user_id = user_id;
        },
        setearFirma(id) {
            this.firma_id = id;
        },
        setearMensajeStore(mensaje) {
            this.mensajeStore = mensaje;
        },
        setearTrabajoEncabezadoId(id) {
            this.trabajo_encabezado_id = id;
        }
    }

})

