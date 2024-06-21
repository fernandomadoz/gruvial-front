<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <CotizacionesList />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import CotizacionesList from '../components/CotizacionesList.vue';

</script>
