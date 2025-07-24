<template>
  <div class="container">
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('description') }}</p>
    <button @click="handleClick">{{ $t('button.submit') }}</button>
  </div>
</template>

<script>
export default {
  name: 'ExampleComponent',
  methods: {
    handleClick() {
      console.log('Button clicked');
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}
</style>

<i18n>
{
  "en": {
    "welcome": "Hello, world!",
    "description": "A simple demo app",
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    },
    "messages": [
      "Hello from MyApp",
      "Welcome message"
    ],
    "metadata": {
      "active": true,
      "maxItems": 10,
      "note": null
    }
  },
  "es": {
    "welcome": "¡Hola, mundo!",
    "description": "Una aplicación de demostración simple",
    "button": {
      "submit": "Enviar",
      "cancel": "Cancelar"
    },
    "messages": [
      "Hola desde MyApp",
      "Mensaje de bienvenida"
    ],
    "metadata": {
      "active": true,
      "maxItems": 10,
      "note": null
    }
  }
}
</i18n>