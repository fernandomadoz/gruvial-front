<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <Reportes/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import Reportes from '../components/Reportes.vue';
</script>
