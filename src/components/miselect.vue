<template>
    valor: {{ valorSeleccionado }}
  <select  class="form-select" v-model="valorSeleccionado">
    <option  v-for="opcion in props.opciones" :key="opcion" v-bind:value="opcion[0]" > {{opcion[1]}}</option>
  </select>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css"

    const props = defineProps({
        opciones: {
            default444: [
                [1, 'opcion 1'],
                [2, 'opcion 2'],
                [3, 'opcion 3']
            ]
        },
        valorSeleccionado: {
            default: null
        } 

    });
</script>

<style>

</style>