<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <Cheque :accion="props.accion" :cheque_id="props.cheque_id" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import Cheque from '../components/Cheque.vue';

const props = defineProps({
    accion: {
          type: String,
          default: 'A'
      },
      cheque_id: {
          type: Number,
          default: null
      }
  })
</script>
