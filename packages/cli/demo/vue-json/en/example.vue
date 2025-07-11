<template>
  <!-- Template content is not localized -->
  <div class="container">
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('description') }}</p>
    <button @click="handleClick">{{ $t('button.submit') }}</button>
  </div>
</template>

<script>
// Script content is not localized
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
/* Style content is not localized */
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
    "welcome": "Welcome to our application",
    "description": "This description text is localized",
    "button": {
      "submit": "Submit Form",
      "cancel": "Cancel Action"
    },
    "messages": [
      "First localized message",
      "Second localized message"
    ],
    "metadata": {
      "active": true,
      "maxItems": 10,
      "note": null
    }
  }
}
</i18n>