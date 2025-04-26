<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <ComprasList />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import ComprasList from '../components/ComprasList.vue';

</script>
