<template>
  <v-expansion-panels>

    <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon :icon="props.icon" class="mr-2"></v-icon>
          {{ props.titulo }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card>
              <v-tabs v-model="tab" bg-color="primary">
                <v-tab value="vencidos">{{ tituloVencidos }}</v-tab>
                <v-tab value="hoy">{{ tituloHoy }}</v-tab>
                <v-tab value="proximos">{{ tituloProximos }}</v-tab>
              </v-tabs>

              <v-card-text class="ma-0 pa-0">

                <v-window v-model="tab">

                  <!-- VENCIDOS -->
                  <v-window-item value="vencidos">
                    <ListaDeNotificaciones 
                      :tipo="props.tipo" 
                      :lista="listaVencidos" 
                      :textoVacio="'No hay '+props.titulo+' vencidos'"
                      tiempo="vencidos"
                      />
                  </v-window-item>

                  <!-- HOY -->
                  <v-window-item value="hoy">
                    <ListaDeNotificaciones 
                      :tipo="props.tipo" 
                      :lista="listaHoy" 
                      :textoVacio="'No hay '+props.titulo+' para hoy'"
                      tiempo="hoy"
                      />
                  </v-window-item>

                  <!-- PROXIMOS -->
                  <v-window-item value="proximos">
                    <ListaDeNotificaciones 
                      :tipo="props.tipo" 
                      :lista="listaProximos" 
                      :textoVacio="'No hay '+props.titulo+' registrados para los proximos dias'"
                      tiempo="proximos"
                    />              
                  </v-window-item>

                </v-window>
              </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    
  </v-expansion-panels>
</template>

<script setup>
    import { ref } from "vue"
    import ListaDeNotificaciones from '../components/ListaDeNotificaciones.vue';
    
    const tab = ref('vencidas')

    const props = defineProps({
        tipo: {
            type: String,
            default: null
        },
        titulo: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: null
        },
        listaVencidos: {
            type: Object,
            default: null
        },
        listaHoy: {
            type: Object,
            default: null
        },
        listaProximos: {
            type: Object,
            default: null
        },
        tituloVencidos: {
            type: String,
            default: 'Vencidos'
        },
        tituloHoy: {
            type: String,
            default: 'Hoy'
        },
        tituloProximos: {
            type: String,
            default: 'Proximos'
        },
    })

</script>


<style>

</style>