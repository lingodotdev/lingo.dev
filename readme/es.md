<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ CLI de código abierto con IA para localización web y móvil.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Documentación</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuir</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Marcar con estrella</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Lanzamiento" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licencia" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Último commit" />
  </a>
</p>

<br />

Lingo.dev es una CLI de código abierto impulsada por la comunidad para la localización de aplicaciones web y móviles con IA.

Lingo.dev está diseñado para producir traducciones auténticas al instante, eliminando el trabajo manual y la sobrecarga de gestión. Como resultado, los equipos realizan localizaciones precisas 100 veces más rápido, lanzando funcionalidades a más usuarios satisfechos en todo el mundo. Puede utilizarse con tu propio LLM o con el Motor de Localización gestionado por Lingo.dev.

> **Dato poco conocido:** ¡Lingo.dev comenzó como un pequeño proyecto en un hackathon estudiantil en 2023! Muchas iteraciones después, fuimos aceptados en Y Combinator en 2024, ¡y ahora estamos contratando! ¿Interesado en construir las herramientas de localización de próxima generación? ¡Envía tu CV a careers@lingo.dev! 🚀

## 📑 En esta guía

- [Inicio rápido](#-quickstart) - Comienza en minutos
- [Caché](#-caching-with-i18nlock) - Optimiza las actualizaciones de traducción
- [GitHub Action](#-github-action) - Automatiza la localización en CI/CD
- [Características](#-supercharged-features) - Lo que hace potente a Lingo.dev
- [Documentación](#-documentation) - Guías detalladas y referencias
- [Contribuir](#-contribute) - Únete a nuestra comunidad

## 💫 Inicio rápido

La CLI de Lingo.dev está diseñada para funcionar tanto con tu propio LLM como con el Motor de Localización gestionado por Lingo.dev construido sobre los últimos LLMs de vanguardia (SOTA).

### Usando tu propio LLM (BYOK o Trae Tu Propia Clave)

1. Crea un archivo de configuración `i18n.json`:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Configura tu clave API como variable de entorno:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# o para OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. Ejecuta la localización:

```bash
npx lingo.dev@latest i18n
```

### Usando Lingo.dev Cloud

A menudo, las aplicaciones de nivel profesional requieren funciones como memoria de traducción, soporte de glosario y control de calidad de localización. Además, a veces quieres que un experto decida por ti qué proveedor y modelo de LLM usar, y que actualice el modelo automáticamente cuando se lancen nuevos. Lingo.dev es un Motor de Localización gestionado que proporciona estas funciones:

1. Crea un archivo de configuración `i18n.json` (sin el nodo provider):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Autentícate con Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Ejecuta la localización:

```bash
npx lingo.dev@latest i18n
```

## 📖 Documentación

Para guías detalladas y referencias de API, visita la [documentación](https://lingo.dev/go/docs).

## 🔒 Caché con `i18n.lock`

Lingo.dev utiliza un archivo `i18n.lock` para rastrear las sumas de verificación del contenido, asegurando que solo el texto modificado sea traducido. Esto mejora:

- ⚡️ **Velocidad**: Omite contenido ya traducido
- 🔄 **Consistencia**: Previene retraducciones innecesarias
- 💰 **Costo**: Sin facturación por traducciones repetidas

## 🤖 GitHub Action

Lingo.dev ofrece una GitHub Action para automatizar la localización en tu pipeline de CI/CD. Aquí tienes una configuración básica:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Esta acción ejecuta `lingo.dev i18n` en cada push, manteniendo tus traducciones actualizadas automáticamente.

Para el modo de pull request y otras opciones de configuración, visita nuestra [documentación de GitHub Action](https://docs.lingo.dev/setup/gha).

## ⚡️ Superpoderes de Lingo.dev

- 🔥 **Integración instantánea**: Funciona con tu código en minutos
- 🔄 **Automatización CI/CD**: Configúralo y olvídate
- 🌍 **Alcance global**: Llega a usuarios en todas partes
- 🧠 **Impulsado por IA**: Utiliza los últimos modelos de lenguaje para traducciones naturales
- 📊 **Agnóstico de formato**: JSON, YAML, CSV, Markdown, Android, iOS y muchos más
- 🔍 **Diffs limpios**: Preserva exactamente la estructura de tus archivos
- ⚡️ **Ultrarrápido**: Traducciones en segundos, no días
- 🔄 **Siempre sincronizado**: Se actualiza automáticamente cuando el contenido cambia
- 🌟 **Calidad humana**: Traducciones que no suenan robóticas
- 👨‍💻 **Creado por desarrolladores, para desarrolladores**: Lo usamos nosotros mismos a diario
- 📈 **Crece contigo**: Desde proyectos pequeños hasta escala empresarial

## 🤝 Contribuir

Lingo.dev está impulsado por la comunidad, ¡así que damos la bienvenida a todas las contribuciones!

¿Tienes una idea para una nueva función? ¡Crea un issue en GitHub!

¿Quieres contribuir? ¡Crea un pull request!

## 🌐 Readme en otros idiomas

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

¿No ves tu idioma? Simplemente añade un nuevo código de idioma al archivo [`i18n.json`](./i18n.json) y abre un PR.
