<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          @click="irA(item.link)"
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
      <v-toolbar-title>Application</v-toolbar-title>


      <v-toolbar-title v-if="DataStore.firma_id>0">{{ DataStore.firmas[DataStore.firma_id-1].firma }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <BtnAccount />

    </v-app-bar>

    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
      </v-container>
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
          title: 'Trabajos',
          link: '/trabajos-list',
        },
        {
          title: 'Cambiar Firma',
          link: '/',
        },
      ],
    }),

    methods: {
      irapage: function(link) {
						console.log(link);
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