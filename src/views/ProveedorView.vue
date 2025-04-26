<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <Proveedor :accion="props.accion" :proveedor_id="props.proveedor_id" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import Proveedor from '../components/Proveedor.vue';

const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
      proveedor_id: {
          type: Number,
          default: null
      }
  })
</script>
