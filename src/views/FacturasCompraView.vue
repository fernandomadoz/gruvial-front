<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <FacturasCompraList />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import FacturasCompraList from '../components/FacturasCompraList.vue';

</script>
