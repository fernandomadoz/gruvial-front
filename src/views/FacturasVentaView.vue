<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <FacturasVentaList />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import FacturasVentaList from '../components/FacturasVentaList.vue';

</script>
