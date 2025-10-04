<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <TareasList :cod_mensaje="props.cod_mensaje"  />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import TareasList from '../components/TareasList.vue';

const props = defineProps({
    cod_mensaje: {
          type: String,
          default: null
      },
  })
</script>
