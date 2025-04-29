<template>
  <div>
    <h1>{{ $t('greeting') }}</h1>
    <p>{{ $t('welcome_user', { 0: username }) }}</p>
    
    <div>
      <h2>{{ $t('items_count', { 0: itemCount }) }}</h2>
      <p>{{ $t('days_until_event', { 0: daysUntilEvent }) }}</p>
    </div>

    <div>
      <p>{{ $t('complex_format', { 0: username, 1: points, 2: balance }) }}</p>
      <p>{{ $t('date_format', { 0: currentDate }) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'I18nDemo',
  data() {
    return {
      username: 'John',
      itemCount: 5,
      daysUntilEvent: 3,
      points: 100,
      balance: 50.25,
      currentDate: new Date().toLocaleDateString()
    }
  }
}
</script>

<i18n>
{
  "en": {
    "greeting": "Hello!",
    "welcome_user": "Welcome, {0}!",
    "items_count": {
      "zero": "No items",
      "one": "One item",
      "two": "Two items",
      "few": "{0} items",
      "many": "{0} items",
      "other": "{0} items"
    },
    "days_until_event": {
      "zero": "The event is today!",
      "one": "The event is tomorrow!",
      "two": "The event is in two days",
      "few": "The event is in {0} days",
      "many": "The event is in {0} days",
      "other": "The event is in {0} days"
    },
    "complex_format": "User {0} has {1} points and ${2} balance",
    "date_format": "Today is {0}"
  },
  "es": {
    "greeting": "¡Hola!",
    "welcome_user": "¡Bienvenido/a, {0}!",
    "items_count": {
      "zero": "Sin elementos",
      "one": "Un elemento",
      "two": "Dos elementos",
      "few": "{0} elementos",
      "many": "{0} elementos",
      "other": "{0} elementos"
    },
    "days_until_event": {
      "zero": "¡El evento es hoy!",
      "one": "¡El evento es mañana!",
      "two": "El evento es en dos días",
      "few": "El evento es en {0} días",
      "many": "El evento es en {0} días",
      "other": "El evento es en {0} días"
    },
    "complex_format": "El usuario {0} tiene {1} puntos y ${2} de saldo",
    "date_format": "Hoy es {0}"
  },
  "ru": {
    "greeting": "Привет!",
    "welcome_user": "Добро пожаловать, {0}!",
    "items_count": {
      "zero": "Нет элементов",
      "one": "Один элемент",
      "two": "Два элемента",
      "few": "{0} элемента",
      "many": "{0} элементов",
      "other": "{0} элементов"
    },
    "days_until_event": {
      "zero": "Событие сегодня!",
      "one": "Событие завтра!",
      "two": "Событие через два дня",
      "few": "Событие через {0} дня",
      "many": "Событие через {0} дней",
      "other": "Событие через {0} дней"
    },
    "complex_format": "Пользователь {0} имеет {1} очков и баланс ${2}",
    "date_format": "Сегодня {0}"
  }
}
</i18n>
