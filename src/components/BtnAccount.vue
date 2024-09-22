<template>
    <v-img
         v-if="firma_id>0"
        :src="firmas[firma_id-1].logo"
        class="my-3"
        contain
        height="150"
        @click="router.push('/');"
    />
    <a href="/login"><v-btn v-if="!isLogged">Login</v-btn></a>

    <div class="text-center" v-if="isLogged">
        <v-menu
            open-on-hover
             :location="location"
            
        >
            <template v-slot:activator="{ props }">
                <v-btn
                color=""
                v-bind="props"
                >
                Salir
                </v-btn>
            </template>

            <v-list>
                <v-list-item lines="two" v-on:click="logout">
                <v-list-item-header>
                    <v-list-item-title><v-icon>mdi-power</v-icon> Salir</v-list-item-title>
                    <v-list-item-subtitle>{{ user }}</v-list-item-subtitle>
                </v-list-item-header>
                </v-list-item>       
            </v-list>
        </v-menu>
    </div>
</template>

<script setup>
  import auth from "@/logic/auth";
  import { useData } from '../composables/useData';
  import router from "@/router";
  
  const { firmas, firma_id, user, isLogged } = useData();
  const locations = [
            'top',
            'bottom',
            'start',
            'end',
            'center',
        ];
  const location = locations[2];
  const logout = () => {
    auth.deleteUserLogged();
  };
</script>