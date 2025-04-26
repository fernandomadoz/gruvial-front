<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <MaquinasList/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import MaquinasList from '../components/MaquinasList.vue';
</script>
