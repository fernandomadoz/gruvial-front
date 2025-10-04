<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">

        <v-icon icon="mdi-magnify" v-bind="activatorProps"></v-icon>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Dialog">
        <v-card-text>
            
              <v-table>
                <thead>
                <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Importe</th>
                    <th class="text-left">Detalle</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in detalle"
                    :key="item.id"
                    v-show="item.mes == mes"
                >
                    <td>{{ item.id }}</td>
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.importe }}</td>
                    <td>{{ item.detalle }}</td>
                </tr>
                </tbody>
            </v-table>
            
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            text="Cerrar"
            @click="isActive.value = false"
            ></v-btn>
        </v-card-actions>
        </v-card>
    </template>
    </v-dialog>
</template>

<script setup>
import { ref } from "vue";

    const props = defineProps({
        periodo: {
            type: String,
            default: null
        },
        detalle: {
            type: Object,
            default: null
        }
    })

const [mesStr, anioStr] = props.periodo.split("/");

// Convertir a números
const mes = ref(parseInt(mesStr, 10));
const anio = ref(parseInt(anioStr, 10));

</script>
<style>
.fila-th {
    background-color: #e5e5e5;
    font-weight:500;
}
</style>