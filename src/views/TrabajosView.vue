<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <TrabajosList/>
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import TrabajosList from '../components/TrabajosList.vue';
</script>
