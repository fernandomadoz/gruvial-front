<template>
  <v-main>
    <v-container fluid>
        <suspense timeout="0">
            <Notificaciones />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import Notificaciones from '../components/Notificaciones.vue';
</script>
