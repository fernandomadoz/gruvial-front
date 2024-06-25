<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      
      <v-list>
        <v-list-item
          v-for="(item, index) in DataStore.getOpcionesMenuPrincipal"
          :key="index"
          :value="index"
          :to="item.link"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


    <!-- APPVAR SIN LOGUEO-->
    <v-app-bar app
            color="yellow"
            prominent>

      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" v-if="DataStore.isLogged"></v-app-bar-nav-icon>
      <v-toolbar-title>Opciones</v-toolbar-title>


      <v-toolbar-title v-if="DataStore.firma_id>0">{{ DataStore.firmas[DataStore.firma_id-1].firma }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <BtnAccount />

    </v-app-bar>

    <v-main>
      <!-- Provides the application the proper gutter -->

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-main>
  </v-app>

</template>

<script>
  import auth from "@/logic/auth";
  import BtnAccount from "./components/BtnAccount.vue";
  import { useDataStore } from "@/stores/DataStore";
  import router from "@/router";
  

  

  export default {
    
    name: 'App',

    setup() {
      const DataStore = useDataStore()

      return {
        // you can return the whole store instance to use it in the template
        DataStore,
      }
    },

    components: {
      BtnAccount
    },

    data: () => ({
      drawer: false,
      group: null,
      items: [
        {
          title: 'Notificaciones',
          link: '/centro-de-notificaciones',
        },
        {
          title: 'Trabajos',
          link: '/trabajos-list',
        },
        {
          title: 'Cotizaciones',
          link: '/cotizaciones-list',
        },
        {
          title: 'Compras y Gastos',
          link: '/compras-list',
        },
        {
          title: 'Cheques',
          link: '/cheques-list',
        },
        {
          title: 'Facturas',
          link: '/facturas-list',
        },
        {
          title: 'Relaciones',
          link: '/relaciones-list',
        },
        {
          title: 'Recordatorios',
          link: '/recordatorios-list',
        },
        {
          title: 'Clientes',
          link: '/clientes-list',
        },
        {
          title: 'Proveedores',
          link: '/proveedores-list',
        },
        {
          title: 'Cambiar Firma',
          link: '/',
        },
        {
          title: 'Cambiar Contraseña',
          link: '/change-password',
        },
        {
          title: 'Reportes',
          link: '/reportes',
        },
        
      ],
    }),

    methods: {
      irapage: function(link) {
					},
      logout: function() {
        auth.deleteUserLogged();
      },
      irA: function(link) {
        router.push(link);
      }
    },

    watch: {
      group () {
        this.drawer = false
      },
      
    },
    
    computed: {
      userLogged() {
        var getLogged = auth.getUserLogged();
        return getLogged[0];
      }
    }

  }
  
</script>