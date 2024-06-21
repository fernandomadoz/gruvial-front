<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <FacturasList />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import FacturasList from '../components/FacturasList.vue';

</script>
