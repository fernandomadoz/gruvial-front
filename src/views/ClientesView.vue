<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <ClientesList :cod_mensaje="props.cod_mensaje" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import ClientesList from '../components/ClientesList.vue';

const props = defineProps({
    cod_mensaje: {
          type: String,
          default: 'A'
      },
  })
</script>
