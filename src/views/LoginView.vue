<template>
    <suspense timeout="0">
        <Login />
    </suspense>
</template>

<script setup>
import { defineComponent } from 'vue';

// Components
import Login from '../components/Login.vue';

</script>
