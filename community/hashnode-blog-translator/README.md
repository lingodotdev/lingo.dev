# 🗣️ Hashnode Blog Scrapper and Convertor

![Logo](./static/hashnode-blog-translator.png)

An app to extract and translate blog content from Hashnode and convert to a target language by preserving localization through Lingo.dev. Built in Python and designed for quick local runs and deployments.

---

## 🔎 What it does

- 📝 Fetches blog posts from Hashnode
- 🌐 Translates content using configured translation logic
- 💻 Render the output in markdown previewer

## ⚙️ Configuration & Input

- Example input:

```json
{
  "hashnodePublicationName": "srinikethj.hashnode.dev",
  "hashnodeSlugName": "send-sms-using-twilio-for-g-calendar-events-using-naas-template",
  "targetLocale": "de"
}
```

- Hashnode API key: To generate the token, go to https://hashnode.com/settings/developer and click on "Generate New Token".
- Lingo.dev API key: https://lingo.dev/en/cli/quick-start (Refer #Lingo.dev Engine)

## 🏗️ Working

![Flow Diagram](./static/working.png)

```json
{
  "translated_title": "SMS mit Twilio für G-Calendar-Events über Naas Template versenden",
  "translated_markdown_content": "### Einführung in Naas.ai\n\nNaas (Notebooks as a Service) ist eine Low-Code-Open-Source-Daten- und KI-Plattform, die jedem, der mit Daten arbeitet (Analysten, Wissenschaftler und Ingenieure), ermöglicht, leistungsstarke Datenlösungen zu erstellen, die Automatisierung, Analytik und KI kombinieren – bequem aus ihren Jupyter-Notebooks heraus unter Nutzung der Leistungsfähigkeit von Low-Code-Formeln und Microservices.\n\nUm den Lebenszyklus einfacher und dennoch leistungsfähiger zu gestalten, können Sie aus einer Reihe vorgefertigter Vorlagen wählen, die eine bestimmte Aufgabe erfüllen und die Sie je nach Anwendungsfall frei anpassen können. Eine Liste aller verfügbaren Vorlagen (derzeit mehr als 600) finden Sie hier 👇\n\n[https://github.com/jupyter-naas/awesome-notebooks/](https://github.com/jupyter-naas/awesome-notebooks/)\n\nAlle diese Notebooks ...",
  "title": "Send SMS using Twilio for G-Calendar Events using Naas Template",
  "markdown_content": "### Introduction to Naas.ai\n\nNaas (Notebooks as a service) is a low-code open-source data & AI platform that empowers anyone working with data (analysts, scientists, and engineers) to create powerful data solutions combining automation, analytics, and AI from the comfort of their Jupyter notebooks utilizing the power of low-code formulas and microservices.\n\nTo make the life cycle simpler yet more powerful you can choose from a set of pre-built templates that perform a particular task and are free to modify them as per the use case. You could find a list of all the templates available (currently more than 600)👇\n\n[https://github.com/jupyter-naas/awesome-notebooks/](https://github.com/jupyter-naas/awesome-notebooks/)\n\nAll these notebooks ...",
  "target_language": "de",
  "detected_title_language": "en",
  "detected_content_language": "en"
}
```

## ✅ Note

- If `target_language` and current content language matches, then don't process the request.
- Currently images are not renderable.
