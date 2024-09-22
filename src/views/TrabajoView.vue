<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <Trabajo  :tab="props.tab" :trabajo_id="props.trabajo_id"/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineProps } from 'vue';

// Components
import Trabajo from '../components/Trabajo.vue';


const props = defineProps({
  trabajo_id: {
          type: Number,
          default: null
    },
  tab: {
        type: String,
        default: null
    },
  })
</script>
