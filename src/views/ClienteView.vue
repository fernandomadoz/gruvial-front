<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <Cliente :accion="props.accion" :cliente_id="props.cliente_id" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import Cliente from '../components/Cliente.vue';

const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
      cliente_id: {
          type: Number,
          default: null
      }
  })
</script>
