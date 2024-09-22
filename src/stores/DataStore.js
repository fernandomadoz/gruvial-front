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
            //ENDPOINT_PATH_API: "https://back.gruvial.com.ar/api/",
            isLogged: Cookies.get("logged"),
            user: Cookies.get("userLogged"),
            token: Cookies.get("token"),
            firma_id: Cookies.get("firma_id"),
            user_id: Cookies.get("user_id"),
            rol_de_usuario_id: Cookies.get("rol_de_usuario_id"),
            mensajeStore: null,
            trabajo_encabezado_id: null,
            compra_encabezado_id: null,
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
            "Authorization": 'Bearer ' + state.token,
        }],
        headersAxiosFiles: (state) => [{
            "Content-type": "application/x-www-form-urlencoded",
            "Authorization": 'Bearer ' + state.token,
        }],
        getRolDeUsusarioId: (state) => state.rol_de_usuario_id,
        getFirmas: (state) => state.firmas,

        getPermisosPorUsuario: (state) => {
            let firmas = []
            let permisos = []
            let notificaciones = []
            let reportes = []
            if (state.rol_de_usuario_id == 1) {
                firmas = ['*']
                permisos = ['*']
                notificaciones = ['*'] 
                reportes = ['*'] 
            }
            //ADM SANIBOX
            if (state.rol_de_usuario_id == 2 ) {
                firmas = [3]
                notificaciones = ['*'] 
                reportes = ['administrativos'] 
            }
            //ADM GRUVIAL
            if (state.rol_de_usuario_id == 3 ) {
                firmas = [1,2]
                notificaciones = [
                    'trabajos', 
                    'recordatorios', 
                ]
                reportes = ['administrativos'] 
            }
            if (state.rol_de_usuario_id == 2 ||  state.rol_de_usuario_id == 3) {
                permisos = [
                    'notificaciones', 
                    'trabajos', 
                    'cotizaciones', 
                    'compras', 
                    'cheques', 
                    'facturas', 
                    'recordatorios', 
                    'clientes', 
                    'proveedores', 
                    'reportes', 
                    'cambiar-contraseña',
                ]
            }

            return { 
                    firmas: firmas,
                    permisos: permisos,
                    notificaciones: notificaciones,
                    reportes: reportes,
                }

        },

        getFirmasPorUsuario: (state) => {
            let firmas_final = []
            let firmas = state.getFirmas
            firmas.forEach(function(firma, indice) {
                if (state.getPermisosPorUsuario.firmas.includes(firma.id) || state.getPermisosPorUsuario.firmas.includes('*')) {
                    firmas_final.push(firmas[indice])
                }
            })
            return firmas_final
        },

        getNotificacionesPorUsuario: (state) => {
            let notificaciones_final = []
            let notificaciones = [
                'cheques', 
                'mensuales', 
                'sueldos', 
                'trabajos', 
                'recordatorios', 
            ] 
            notificaciones.forEach(function(notificacion, indice) {
                if (state.getPermisosPorUsuario.notificaciones.includes(notificacion) || state.getPermisosPorUsuario.notificaciones.includes('*')) {
                    notificaciones_final.push(notificaciones[indice])
                }
            })
            return notificaciones_final
        },
        
        getOpcionesMenuPrincipal: (state) => {
            let opciones_rol = [
                {title: 'Notificaciones', link: '/centro-de-notificaciones'},
                {title: 'Trabajos', link: '/trabajos-list'},
                {title: 'Cotizaciones', link: '/cotizaciones-list'},
                {title: 'Compras y Gastos', link: '/compras-list'},
                {title: 'Cheques', link: '/cheques-list'},
                {title: 'Facturas', link: '/facturas-list'},
                {title: 'Relaciones', link: '/relaciones-list'},
                {title: 'Recordatorios', link: '/recordatorios-list'},
                {title: 'Clientes', link: '/clientes-list'},
                {title: 'Proveedores', link: '/proveedores-list'},
                {title: 'Cambiar Firma', link: '/'},
                {title: 'Cambiar Contraseña', link: '/change-password'},
                {title: 'Reportes', link: '/reportes'},
              ]

            let permisos = [
                'notificaciones', 
                'trabajos', 
                'cotizaciones', 
                'compras', 
                'cheques', 
                'facturas', 
                'relaciones', 
                'recordatorios', 
                'clientes', 
                'proveedores', 
                'cambiar-firma', 
                'cambiar-contraseña', 
                'reportes', 
            ]

            let opciones_rol_final = []
            permisos.forEach(function(permiso, indice) {
                if (state.getPermisosPorUsuario.permisos.includes(permiso) || state.getPermisosPorUsuario.permisos.includes('*')) {
                    opciones_rol_final.push(opciones_rol[indice])
                }
            })

            return opciones_rol_final

        },
    },

    actions: {
        setearUser(email, isLogged, token, user_id, rol_de_usuario_id) {
            this.user = email;
            this.isLogged = isLogged;
            this.token = token;
            this.user_id = user_id;
            this.rol_de_usuario_id = rol_de_usuario_id;
        },
        setearFirma(id) {
            this.firma_id = id;
        },
        setearMensajeStore(mensaje) {
            this.mensajeStore = mensaje;
        },
        setearTrabajoEncabezadoId(id) {
            this.trabajo_encabezado_id = id;
        },
        setearCompraEncabezadoId(id) {
            this.compra_encabezado_id = id;
        },
        setearRolDeUsusarioId(id) {
            this.rol_de_usuario_id = id;
        },
    }

})

