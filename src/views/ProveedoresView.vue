<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <ProveedoresList :cod_mensaje="props.cod_mensaje" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import ProveedoresList from '../components/ProveedoresList.vue';

const props = defineProps({
    cod_mensaje: {
          type: String,
          default: 'A'
      },
  })
</script>
