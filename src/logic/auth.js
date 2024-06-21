import axios from "axios";
import Cookies from "js-cookie";
import { useDataStore } from "@/stores/DataStore";
import router from "@/router";


// https://codingpotions.com/vue-login

// Con Login Laravel 5.4 (Laravel Passport)
//const ENDPOINT_PATH = "http://localhost:1010/mgm2/gruvial/public_html/cotizador/api/";

// Con Login Laravel 9 (Sanctum)
//const ENDPOINT_PATH = "http://localhost:1010/gruvial/back/public_html/back/";
//const ENDPOINT_PATH_API = "http://localhost:1010/gruvial/back/public_html/back/api/";
//const ENDPOINT_PATH = "https://back.gruvial.com.ar/";
//const ENDPOINT_PATH_API = "https://back.gruvial.com.ar/api/";
const ENDPOINT_PATH = import.meta.env.VITE_ENDPOINT_PATH
const ENDPOINT_PATH_API = ENDPOINT_PATH+'api/'




export default {
    setup() {
        const DataStore = useDataStore()
  
        return {
          // you can return the whole store instance to use it in the template
          DataStore,
        }
    },

    setUserLogged(userLogged, logged, token, name, user_id, rol_de_usuario_id) {
        const DataStore = useDataStore();
        DataStore.setearUser(userLogged, true, token, user_id, rol_de_usuario_id);
        Cookies.set("userLogged", userLogged);
        Cookies.set("logged", logged);
        Cookies.set("token", token);
        Cookies.set("name", name);
        Cookies.set("user_id", user_id);
        Cookies.set("rol_de_usuario_id", rol_de_usuario_id);
    },
    
    /*
    getUserLogged() {
        var userLogged = Cookies.get("userLogged"); 
        var logged = Cookies.get("logged");
        var token = Cookies.get("token");
        if (typeof logged == 'undefined') {
            logged = false;
            
        }

        return [userLogged, logged, token];
    },
    */

    login(email, password) {
        
        // Con Login Laravel 5.4 (Laravel Passport)
        //const user = { email, password};
        //return axios.post(ENDPOINT_PATH + "login", user);

        // Con Login Laravel 9 (Sanctum)
        const json = JSON.stringify({ 
            email: email,
            password: password
        });
        axios.get(ENDPOINT_PATH + 'sanctum/csrf-cookie').then(response => {
            // Login...
        });
        return axios.post(ENDPOINT_PATH_API + "login", json, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
    },

    laravelUser() {
        const DataStore = useDataStore();
        let headers = {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": 'Bearer ' + DataStore.token
         };
        const resultado = axios.get(ENDPOINT_PATH_API + "user-profile", {
            withCredentials: true,
            headers: headers
          });

        return resultado;
        
    },

    deleteUserLogged() {
        const DataStore = useDataStore();
        let token2 = DataStore.token
        let headers = {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": 'Bearer ' + token2
        };
        const resultado = axios.get(ENDPOINT_PATH_API + "logout", {
            withCredentials: true,
            headers: headers
        });        
        Cookies.remove('logged');
        Cookies.remove('userLogged');
        Cookies.remove('token');
        Cookies.remove('firma_id');
        Cookies.remove('user_id');
        Cookies.remove('rol_de_usuario_id');
        DataStore.$reset();
        router.push("/login-view");
        

    },
    
    checkChangePassword() {
        const DataStore = useDataStore();
        const json = JSON.stringify({});

        return axios.post(ENDPOINT_PATH_API + "check-change-password", json, {headers: DataStore.headersAxios[0]});
    },
};