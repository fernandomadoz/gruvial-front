<template>
    <v-main>
      <v-container>
          <suspense timeout="0">
              <Recordatorio :accion="props.accion" :recordatorio_id="props.recordatorio_id" />
          </suspense>
      </v-container>
    </v-main>
  </template>
  
  <script setup>
  
  // Components
  import Recordatorio from '../components/Recordatorio.vue';
  
  const props = defineProps({
      accion: {
            type: String,
            default: 'A'
        },
        recordatorio_id: {
            type: Number,
            default: null
        }
    })
  </script>
  