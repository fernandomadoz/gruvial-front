<template>
  <v-main>
    <v-container>
        <suspense timeout="0">
            <RecordatoriosList :cod_mensaje="props.cod_mensaje" />
        </suspense>
    </v-container>
  </v-main>
</template>

<script setup>

// Components
import RecordatoriosList from '../components/RecordatoriosList.vue';

const props = defineProps({
    cod_mensaje: {
          type: String,
          default: 'A'
      },
  })
</script>
