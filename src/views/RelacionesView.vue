<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <RelacionesList :cod_mensaje="props.cod_mensaje" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import RelacionesList from '../components/RelacionesList.vue';

const props = defineProps({
    cod_mensaje: {
          type: String,
          default: 'A'
      },
  })
</script>
