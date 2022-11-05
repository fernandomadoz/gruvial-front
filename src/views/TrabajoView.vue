<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <Trabajo />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import Trabajo from '../components/Trabajo.vue';

</script>
