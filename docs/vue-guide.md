# Vue.js - Lingo.dev CLI

## What is Vue.js?

Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable and can easily scale between a library and a full-featured framework.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in a Vue.js application. You'll learn how to scaffold a project with Vue.js, configure a translation pipeline using vue-i18n, and implement language switching in your application.

## Step 1. Set up a Vue.js project

1. **Create a new Vue.js project using Vue CLI:**

```bash
# Install Vue CLI if you haven't already
npm install -g @vue/cli

# Create a new project
vue create i18n-example

# When prompted for a preset, choose "Manually select features"
# Select the following features:
# - Babel
# - Router
# - Vuex (optional)
# - CSS Pre-processors (optional)
# - Linter / Formatter

# Choose Vue version 3.x
# Choose history mode for router
# Choose your preferred CSS pre-processor (or skip)
# Choose ESLint with your preferred configuration
# Choose to save this as a preset for future projects (optional)

# Navigate into the project directory
cd i18n-example
```

2. **Install vue-i18n for internationalization:**

```bash
npm install vue-i18n@9
```

## Step 2. Create source content

1. **Create a directory for storing localizable content:**

```bash
mkdir -p src/locales
```

2. **Create a file that contains some localizable content (e.g., `src/locales/en.json`):**

```json
{
  "welcome": "Welcome to Your Vue.js App",
  "description": "This text is translated by Lingo.dev",
  "greeting": "Hello, {name}!",
  "toggle": "Switch Language",
  "counter": "You clicked {count} times"
}
```

## Step 3. Configure the CLI

In the root of the project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "ja"]
  },
  "buckets": {
    "json": {
      "include": ["src/locales/[locale].json"]
    }
  }
}
```

This file defines:

- the files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates JSON files from English to Spanish, French, German, and Japanese.

It's important to note that:

- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `src/locales/en.json`) and written to a different location (e.g., `src/locales/es.json`).
- Lingo.dev CLI supports various file formats including JSON, MDX, and more.

To learn more, see [i18n.json configuration](https://lingo.dev/en/cli/configuration).

## Step 4. Translate the content

1. **Sign up for a Lingo.dev account.**

2. **Log in to Lingo.dev via the CLI:**

```bash
npx lingo.dev@latest login
```

3. **Run the translation pipeline:**

```bash
npx lingo.dev@latest run
```

The CLI will create translation files (e.g., `src/locales/es.json`, `src/locales/fr.json`, etc.) for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 5. Set up vue-i18n in your application

1. **Create an i18n configuration file (`src/i18n.js`):**

```javascript
import { createI18n } from 'vue-i18n';

// Import all locale messages
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';

const messages = {
  en,
  es,
  fr,
  de,
  ja
};

// Create i18n instance
export default createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set them here
});
```

2. **Update your main.js file to use i18n:**

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app');
```

## Step 6. Implement language switching in your Vue components

1. **Create a language switcher component (`src/components/LanguageSwitcher.vue`):**

```vue
<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLocale">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="ja">日本語</option>
    </select>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n();
    const currentLocale = ref(locale.value);

    const changeLocale = () => {
      locale.value = currentLocale.value;
    };

    watch(locale, (newLocale) => {
      currentLocale.value = newLocale;
    });

    return {
      currentLocale,
      changeLocale
    };
  }
};
</script>

<style scoped>
.language-switcher {
  margin: 1rem 0;
}
</style>
```

2. **Update your `App.vue` to use translations:**

```vue
<template>
  <div id="app">
    <header>
      <h1>{{ $t('welcome') }}</h1>
      <p>{{ $t('description') }}</p>
      <p>{{ $t('greeting', { name: 'Vue.js' }) }}</p>
      <LanguageSwitcher />
      <Counter />
    </header>
    <router-view />
  </div>
</template>

<script>
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import Counter from './components/Counter.vue';

export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    Counter
  }
};
</script>
```

3. **Create a Counter component to demonstrate dynamic content (`src/components/Counter.vue`):**

```vue
<template>
  <div class="counter">
    <p>{{ $t('counter', { count }) }}</p>
    <button @click="increment">+</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Counter',
  setup() {
    const count = ref(0);
    
    const increment = () => {
      count.value++;
    };
    
    return {
      count,
      increment
    };
  }
};
</script>

<style scoped>
.counter {
  margin: 1rem 0;
}
button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
}
</style>
```

## Step 7. Test the application

1. **Start the development server:**

```bash
npm run serve
```

2. **Open your browser and navigate to `http://localhost:8080`.**

3. **Verify that the language switching works:**
   - The application should display content in English by default
   - Selecting a different language from the dropdown should update all translated text
   - The counter should continue to function in all languages

## Using Composition API (Optional)

If you prefer using the Composition API in your components, you can access translations like this:

```vue
<template>
  <div>
    <p>{{ t('welcome') }}</p>
    <p>{{ t('greeting', { name: 'Vue.js' }) }}</p>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    
    return {
      t
    };
  }
};
</script>
```

## Known limitations

- For production applications, you might want to consider lazy-loading translations to reduce the initial bundle size.
- The vue-i18n library has many advanced features not covered in this guide, such as pluralization, datetime localization, and number formatting.

## Next steps

To learn more about Vue.js and internationalization:

- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)
- [vue-i18n Documentation](https://vue-i18n.intlify.dev/)
- [Lingo.dev CLI Configuration](https://lingo.dev/en/cli/configuration)