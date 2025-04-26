<template>
  <v-main>
    <v-container fluid>
      <suspense timeout="0">
            <Compra  :tab="props.tab" :compra_encabezado_id="props.compra_encabezado_id"/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import Compra from '../components/Compra.vue';


const props = defineProps({
  compra_encabezado_id: {
          type: Number,
          default: null
    },
  tab: {
        type: String,
        default: null
    },
  })
</script>
