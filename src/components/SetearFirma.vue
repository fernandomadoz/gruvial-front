<template>

<div class="d-flex align-center flex-column bg-grey-lighten-4 pa-6">
    <div class="text-subtitle-2"><h2>Selecciona una empresa</h2></div>
  
    <div
      v-for="firma in getFirmasPorUsuario"
      :key="firma"
    >
          <v-card
            class="mx-auto py-1 my-2"
            width="300"
            v-on:click="setearFirmaRedirigir(firma.id)"
          >
            <v-img
                :src="firma.logo"
                class="my-2 mx-2"
                contain
                height="100"
              />
          </v-card>
      </div>
    

  </div>
        
</template>





<script setup>

  //import { ref } from 'vue';
  import router from "@/router";
  import Cookies from "js-cookie";
  import { useData } from '../composables/useData';
  
  const { getFirmasPorUsuario, setearFirma } = useData();


  const setearFirmaRedirigir = (id) => {
        setearFirma(id);
        Cookies.set("firma_id", id);
        router.push("/centro-de-notificaciones");
        //router.push("/trabajos-list");
        

      }

</script>