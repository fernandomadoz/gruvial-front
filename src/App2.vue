<template>
  <v-app>
    <v-main>
          <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->

          <v-app-bar
            color="yellow"
            prominent
          >
            <v-app-bar-nav-icon variant="text" v-on:click="showhide" v-if="DataStore.isLogged"></v-app-bar-nav-icon>

            <v-toolbar-title>Gestión</v-toolbar-title>

            <v-spacer></v-spacer>
            <BtnAccount />
          </v-app-bar>

          <v-navigation-drawer
            v-model="drawer"
            bottom
            temporary
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

          <router-view/>

      
    </v-main>
  </v-app>
</template>

<script setup>
  import auth from "@/logic/auth";
  import BtnAccount from "./components/BtnAccount.vue";
  import router from "@/router";
  import { useDataStore } from "@/stores/DataStore";
  const DataStore = useDataStore();
  const name = 'App';
  let drawer = true;
  let items = [
        {
          title: 'Cambiar Firma',
          link: '/',
        },
        {
          title: 'Trabajos',
          link: '/trabajos-list',
        },
      ];

  let irA = (link) => {
        router.push(link);
      };

  const showhide = () => {
        console.log(drawer);
        if (drawer) {
          drawer = false;
        } 
        else {
          drawer = true;
        }
      };

  const userLogged = () => {
        var getLogged = auth.getUserLogged();
        return getLogged[0];
      }
  
</script>