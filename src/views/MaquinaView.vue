<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <Maquina  :tab="props.tab" :maquina_id="props.maquina_id"/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineProps } from 'vue';

// Components
import Maquina from '../components/Maquina.vue';


const props = defineProps({
  maquina_id: {
          type: Number,
          default: null
    },
  tab: {
        type: String,
        default: null
    },
  })
</script>
