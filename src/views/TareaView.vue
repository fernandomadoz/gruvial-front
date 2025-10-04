<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <Tarea :accion="props.accion" :tarea_id="props.tarea_id" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import Tarea from '../components/Tarea.vue';

const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
      tarea_id: {
          type: Number,
          default: null
      }
  })
</script>
