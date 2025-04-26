<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <MaquinaInfo  :modo="props.modo" :maquina_id="props.maquina_id"/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineProps } from 'vue';

// Components
import MaquinaInfo from '../components/MaquinaInfo.vue';


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
