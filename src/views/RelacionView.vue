<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <Relacion :accion="props.accion" :relacion_id="props.relacion_id" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import Relacion from '../components/Relacion.vue';

const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
    relacion_id: {
          type: Number,
          default: null
      }
  })
</script>
