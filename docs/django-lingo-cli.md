## Django + Lingo.dev CLI: Build a multilingual app end-to-end

This guide shows how to integrate the Lingo.dev CLI with a Django project to extract copy, manage translations, and render localized content in templates and Python code.

You will start from a fresh Django app and finish with a working multilingual site backed by Lingo.dev. The flow mirrors other framework guides and uses only standard Django + a tiny integration layer.

### What you will build
- Extract strings from Python views and Django templates
- Sync messages with Lingo.dev and generate language bundles
- Render translations in templates via a custom template tag/filter
- Translate content server-side in Python
- Add per-request language detection and a language switcher

### Prerequisites
- Python 3.10+
- Node 18+ (for the CLI)
- Django 4.2+ or 5.x
- A Lingo.dev account (free) and the CLI installed

### Repo layout used in this guide
```
your-project/
  manage.py
  pyproject.toml or requirements.txt
  your_project/            # Django project
  app/                     # Your Django app
  templates/               # Global templates (or app/templates)
  static/
  lingo/                   # Created by the CLI for messages and bundles
```

---

## 1) Create a new Django project (or use an existing one)

```bash
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install django
django-admin startproject your_project .
python manage.py startapp app
```

Add `app` to `INSTALLED_APPS` in `your_project/settings.py` and configure templates to include `templates/`.

Create a simple view and template with some user-facing text:

Create `app/views.py`:
```python
from django.shortcuts import render


def home(request):
    return render(request, "home.html", {
        "user_name": "Alex",
    })
```

Create `templates/home.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Welcome</title>
  </head>
  <body>
    <h1>Welcome to our site</h1>
    <p>Hello, {{ user_name }}! Thanks for visiting.</p>
    <a href="/">Go home</a>
  </body>
  </html>
```

Wire the route in `your_project/urls.py`:
```python
from django.contrib import admin
from django.urls import path
from app.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),
]
```

Run the server to confirm it works:
```bash
python manage.py runserver
```

---

## 2) Install and initialize Lingo.dev CLI

Install the CLI locally in your repo (recommended):
```bash
npm install -D @lingo.dev/cli
```

Authenticate and initialize:
```bash
npx lingo login
npx lingo init
```

This creates a `lingo/` directory and a config file (e.g. `lingo.config.json` or `lingo.config.ts`).

---

## 3) Configure extraction for Django

Update your `lingo.config` to scan both Python and HTML templates.

Example `lingo.config.json`:
```json
{
  "$schema": "https://lingo.dev/schema/lingo.config.schema.json",
  "project": "your-lingo-project-id", 
  "sourceLocale": "en",
  "targetLocales": ["es", "fr"],
  "paths": [
    "app/**/*.py",
    "templates/**/*.html"
  ],
  "extract": {
    "matchers": [
      { "language": "python", "functions": ["_", "gettext"] },
      { "language": "html", "django": { "trans": true } }
    ]
  },
  "output": {
    "messages": "lingo/messages.json",
    "bundles": "lingo/locales/{locale}.json"
  }
}
```

Notes:
- Python: We’ll extract strings wrapped by `_("...")` or `gettext("...")` in Python files.
- Templates: We’ll extract strings inside `{% trans "..." %}` or `{% blocktrans %}...{% endblocktrans %}` in HTML templates when `django.trans` is enabled.

Update your code to mark translatable strings.

`app/views.py`:
```python
from django.shortcuts import render

# Alias for readability; in real apps you might wire Django's gettext too
def _(s: str) -> str:
    return s


def home(request):
    return render(request, "home.html", {
        "page_title": _("Welcome"),
        "greeting": _("Hello, {name}! Thanks for visiting.").format(name="Alex"),
        "cta_home": _("Go home"),
    })
```

`templates/home.html` (mark literal strings):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{% trans page_title %}</title>
  </head>
  <body>
    <h1>{% trans "Welcome to our site" %}</h1>
    <p>{% trans greeting %}</p>
    <a href="/">{% trans "Go home" %}</a>
  </body>
  </html>
```

Extract messages:
```bash
npx lingo extract
```

You’ll see a canonical `lingo/messages.json` with all discovered strings.

---

## 4) Sync with Lingo.dev and generate bundles

Push your messages to Lingo.dev, machine-translate as a starting point, and pull down bundles:
```bash
# Push source messages
npx lingo push

# (Optional) Pre-translate into target locales (requires project permissions)
npx lingo translate --locales es,fr

# Pull reviewed translations back into your repo as JSON bundles
npx lingo pull

# Build locale bundles (if your config separates build from pull)
npx lingo build
```

You should now have per-locale bundles like:
```
lingo/locales/en.json
lingo/locales/es.json
lingo/locales/fr.json
```

---

## 5) Integrate bundles into Django

We’ll use a tiny helper to load the right bundle per request, plus a template filter to translate keys or source strings. This avoids changing your app to use Django’s `.po` flow and keeps Lingo.dev as the source of truth.

Create `app/lingo_loader.py`:
```python
import json
import os
from functools import lru_cache
from typing import Any, Dict


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUNDLES_DIR = os.path.join(BASE_DIR, "lingo", "locales")


@lru_cache(maxsize=64)
def load_bundle(locale: str) -> Dict[str, Any]:
    path = os.path.join(BUNDLES_DIR, f"{locale}.json")
    if not os.path.exists(path):
        # Fallback to English
        path = os.path.join(BUNDLES_DIR, "en.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def translate(message_or_key: str, locale: str, **kwargs: Any) -> str:
    bundle = load_bundle(locale)
    value = bundle.get(message_or_key, message_or_key)
    try:
        return value.format(**kwargs) if isinstance(value, str) else str(value)
    except Exception:
        return value if isinstance(value, str) else str(value)
```

Create a language middleware `app/middleware.py` to resolve the active locale:
```python
from typing import Callable
from django.http import HttpRequest, HttpResponse


def language_middleware(get_response: Callable[[HttpRequest], HttpResponse]):
    def middleware(request: HttpRequest) -> HttpResponse:
        # Priority: explicit query (?lang=), then session, then Accept-Language
        lang = request.GET.get("lang")
        if lang:
            request.session["lang"] = lang
        locale = request.session.get("lang")
        if not locale:
            header = request.headers.get("Accept-Language", "en")
            locale = header.split(",")[0].split("-")[0] or "en"
        request.active_locale = locale
        return get_response(request)

    return middleware
```

Register the middleware in `your_project/settings.py` after session middleware:
```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # ...
    "app.middleware.language_middleware",
    # ...
]
```

Create a template filter `app/templatetags/lingo.py`:
```python
from django import template
from django.template.defaultfilters import stringfilter
from app.lingo_loader import translate


register = template.Library()


@register.filter(name="lingo")
@stringfilter
def lingo_filter(message_or_key: str, request):
    locale = getattr(request, "active_locale", "en")
    return translate(message_or_key, locale)
```

Ensure Django sees `templatetags` by creating the package directory:
```
app/
  templatetags/
    __init__.py
    lingo.py
```

Use the filter in templates. Update `templates/home.html`:
```html
{% load lingo %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{{ page_title|lingo:request }}</title>
  </head>
  <body>
    <h1>{{ "Welcome to our site"|lingo:request }}</h1>
    <p>{{ greeting|lingo:request }}</p>
    <a href="/">{{ "Go home"|lingo:request }}</a>
    <hr />
    <p>
      Switch language:
      <a href="?lang=en">EN</a> | <a href="?lang=es">ES</a> | <a href="?lang=fr">FR</a>
    </p>
  </body>
  </html>
```

Translate in Python (server-side) using the same bundles:
```python
from app.lingo_loader import translate


def home(request):
    locale = getattr(request, "active_locale", "en")
    greeting = translate("Hello, {name}! Thanks for visiting.", locale, name="Alex")
    return render(request, "home.html", {
        "page_title": translate("Welcome", locale),
        "greeting": greeting,
        "cta_home": translate("Go home", locale),
    })
```

Start the server and test language switching with `?lang=es` and `?lang=fr`.

---

## 6) Keep translations fresh during development

Extract on each change, update remote, and rebuild bundles:
```bash
npx lingo extract
npx lingo push
npx lingo pull
npx lingo build
```

Tip: Add NPM scripts to simplify:
```json
{
  "scripts": {
    "i18n:extract": "lingo extract",
    "i18n:push": "lingo push",
    "i18n:pull": "lingo pull",
    "i18n:build": "lingo build",
    "i18n": "npm run i18n:extract && npm run i18n:push && npm run i18n:pull && npm run i18n:build"
  }
}
```

---

## 7) CI/CD example (GitHub Actions)

Create `.github/workflows/i18n.yml`:
```yaml
name: i18n
on:
  push:
    branches: [ main ]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx lingo extract
      - run: npx lingo push
      - run: npx lingo pull
      - run: npx lingo build
      - name: Commit updated bundles
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@users.noreply.github.com"
          git add lingo/locales/*.json
          git commit -m "chore(i18n): update locale bundles" || echo "No changes"
          git push || echo "No push"
```

Store any required Lingo.dev tokens as repository secrets if your project requires auth beyond `lingo login`.

---

## 8) Testing the full flow
1. Mark strings in Python and templates
2. `npx lingo extract` → verify `lingo/messages.json`
3. `npx lingo push` → check messages appear in Lingo.dev
4. Add or approve translations in Lingo.dev
5. `npx lingo pull && npx lingo build` → verify bundles in `lingo/locales/`
6. Load the app with `?lang=es` and confirm localized UI

---

## 9) Troubleshooting
- Strings not extracted: Confirm your `paths` and `matchers` cover `app/**/*.py` and `templates/**/*.html`. Ensure strings are inside `_()`/`gettext()` or `{% trans %}`/`{% blocktrans %}`.
- Fallback shows English: Verify the requested bundle exists and keys match exactly. Check `lingo/locales/<lang>.json`.
- Formatting placeholders: Use Python-style `.format()` with named arguments and ensure the translated strings keep `{name}` tokens intact.
- Missing `templatetags`: Ensure `app/templatetags/__init__.py` exists and Django finds the app.

---

## 10) What’s next
- Add ICU-style plurals via message keys and format logic in your app
- Localize dates, numbers, and currencies using `babel` or Django format utilities
- Expand `targetLocales` and wire language selection into your navbar

---

## Contributing
This document is part of an external PR workflow. If published on the Lingo.dev website, the documentation will include a byline linking to your GitHub profile. Once published, the PR will be closed referencing the final document.


