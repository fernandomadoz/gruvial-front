<template>
  <v-main>
    <v-container>
      <v-hover 
        v-slot="{ isHovering, props }"
        v-for="firma in firmas"
        :key="firma"
      >
        <v-card
          class="mx-auto"
          max-width="344"
          v-bind="props"
          v-on:click="setearFirmaRedirigir(firma.id)"
        >
          <v-img
              :src="firma.logo"
              class="my-3"
              contain
              height="150"
            />
          <v-overlay
            :model-value="isHovering"
            contained
            scrim="#036358"
            class="align-center justify-center"
          >
            <v-btn flat>Seleccionar</v-btn>
          </v-overlay>
        </v-card>
      </v-hover>
    </v-container>
  </v-main>
</template>





<script setup>

  //import { ref } from 'vue';
  import router from "@/router";
  import Cookies from "js-cookie";
  import { useData } from '../composables/useData';
  
  const { firmas, setearFirma } = useData();


  const setearFirmaRedirigir = (id) => {
        setearFirma(id);
        Cookies.set("firma_id", id);
        router.push("/trabajos-list");

      }

</script>