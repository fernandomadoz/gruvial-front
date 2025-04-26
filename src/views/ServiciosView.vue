<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <ServiciosList />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import ServiciosList from '../components/ServiciosList.vue';

</script>
