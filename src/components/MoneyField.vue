<script setup>
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    },
    label: {
        type: String
    },
    hint: {
        type: String
    },
    required: {
        type: Boolean
    },
    disabled: {
        type: Boolean,
        default: false
    },
    typeMgm: {
        type: String
    },
    rules: {
        type: Object
    },
    options: {
        type: Object
    },
    errorMessage: {
        String,
        default: null
    },
    density: {
        String,
        default: 'default'
    }
})
const { inputRef, formattedValue, setOptions, setValue } = useCurrencyInput(props.options)


watch(
    () => props.modelValue, 
    (value) => {
    setValue(value)
    }
)

watch(
    () => props.options,
    (options) => {
    setOptions(options)
    }
)

</script>

<template>
    <!-- CAMPO MONEDA -->    
    <v-text-field
        v-model="formattedValue"
        :disabled="disabled"                        
        :label="label"
        :hint="hint"
        type="text"
        :required="required"
        class="without-ring"
        :rules="rules"
        ref="inputRef"
        :density="density"
    ></v-text-field> 
    <div v-show="errorMessage!=null" class="text-red pb-10">Error: {{ errorMessage }}</div>
</template>