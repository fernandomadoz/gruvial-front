<template>
    <v-tooltip interactive>
      <template v-slot:activator="{ props: activatorProps }">
        <v-icon icon="mdi-information-outline" v-bind="activatorProps"></v-icon>
      </template>
      <div v-for="texto in info" :key="texto">
        {{ texto }}<br />
      </div>
    </v-tooltip>
</template>

<script setup>

    const props = defineProps({
        info: {
            type: Object,
            default: null
        }
    })

</script>
<style>
.fila-th {
    background-color: #e5e5e5;
    font-weight:500;
}
</style>