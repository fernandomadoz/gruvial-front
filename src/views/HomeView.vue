<template>
  <SetearFirma />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import SetearFirma from '../components/SetearFirma.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    SetearFirma,
  },
});
</script>
