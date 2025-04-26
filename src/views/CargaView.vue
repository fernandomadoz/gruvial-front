<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <Carga/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import Carga from '../components/Carga.vue';
</script>
