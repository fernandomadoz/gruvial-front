<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <ChequesList :cod_mensaje="props.cod_mensaje"  />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import ChequesList from '../components/ChequesList.vue';

const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })
</script>
