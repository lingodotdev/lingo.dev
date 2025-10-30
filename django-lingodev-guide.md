# 🌍 Lingo.dev + Django Integration Guide  
AI-powered localization for Django projects

Lingo.dev helps you automatically extract, translate, manage, and sync i18n text — with AI and translation memory — directly from your Django app.

This guide will take you from **zero → fully localized Django app**, using the Lingo.dev CLI.

> ✅ Works on **Windows, macOS, Linux**  
> ✅ Uses Django's standard `gettext` translation system  
> ✅ Generates and syncs `*.po` files  
> ✅ Supports CI/CD (GitHub Actions)

---

## 🚀 Prerequisites

Make sure you have:

| Requirement | Version |
|------------|---------|
| Python | ≥ 3.9 |
| Django | ≥ 4.x |
| Node.js | ≥ 18 |
| pip | Installed |

Check versions:

```bash
python --version
django-admin --version
node -v


---

📦 Step 1: Create a Django project

Skip if you already have one.

django-admin startproject lingodjango
cd lingodjango
python manage.py startapp core

Add the app in lingodjango/settings.py:

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
]


---

🌐 Step 2: Enable Django i18n

In settings.py:

LANGUAGE_CODE = "en"

USE_I18N = True

LANGUAGES = [
    ('en', 'English'),
    ('es', 'Spanish'),
]
LOCALE_PATHS = [
    BASE_DIR / "locale",
]


---

✍️ Step 3: Mark your strings for translation

core/views.py:

from django.http import HttpResponse
from django.utils.translation import gettext as _

def home(request):
    text = _("Hello, welcome to Lingo.dev Django guide!")
    return HttpResponse(text)


---

🛠️ Step 4: Install Lingo.dev CLI

npm install -g lingo.dev

Login:

lingo.dev login


---

📁 Step 5: Initialize Lingo.dev

Inside your Django project folder:

lingo.dev init

Answer prompts:

Prompt	Answer

Source language	en
Target languages	es
Format	po
Select files	locale/[locale]/LC_MESSAGES/*.po
CI/CD setup	optional (we’ll show GitHub below)


This creates:

i18n.json

GitHub workflow (if selected)



---

🏗️ Step 6: Extract Django strings

Django uses gettext, so run:

django-admin makemessages -a

This generates .po files like:

locale/en/LC_MESSAGES/django.po
locale/es/LC_MESSAGES/django.po


---

🤖 Step 7: Run Lingo.dev AI translation

lingo.dev run

Output example:

✓ Processed translations
✓ locales/es/LC_MESSAGES/django.po updated


---

🧾 Step 8: Compile translations

django-admin compilemessages


---

✅ Step 9: Test in browser

Run Django:

python manage.py runserver

Visit browser:

http://127.0.0.1:8000/?lang=en
http://127.0.0.1:8000/?lang=es

You should now see Spanish translation powered by Lingo.dev.


---

🤝 CI/CD (Optional) — GitHub Action

If you selected GitHub during init, the workflow is already installed.

Otherwise create .github/workflows/lingo.yml:

name: Lingo.dev i18n Pipeline

on:
  push:
    branches:
      - main

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g lingo.dev
      - run: lingo.dev run --ci
        env:
          LINGO_API_KEY: ${{ secrets.LINGO_API_KEY }}


---

📂 File Structure Recap

lingodjango/
 ├─ core/
 ├─ locale/
 │   ├─ en/LC_MESSAGES/django.po
 │   └─ es/LC_MESSAGES/django.po
 ├─ i18n.json
 └─ manage.py


---

🎯 You're done!

You now have:

✅ Django localization
✅ AI translations
✅ Sync & version control
✅ CI automated i18n pipeline





---

📎 Useful Links

Resource	Link

Lingo.dev Docs	https://lingo.dev/en
GitHub	https://github.com/LingoDotDev/lingo.dev


---


