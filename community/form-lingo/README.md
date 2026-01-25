# FormLingo --- Multilingual Form Builder powered by Lingo.dev

FormLingo is a modern multilingual form builder that allows you to
create dynamic forms with real-time validation, automatic localization,
and reverse translation of submitted data --- all powered by
**Lingo.dev**.

------------------------------------------------------------------------

## Demo: Multilingual Form Builder

![FormLingo Demo](./public/demo.mp4)

------------------------------------------------------------------------

## ✨ What This App Does

FormLingo enables you to:

-   🏗️ Build dynamic forms using an intuitive UI\
-   🌍 Translate form labels, placeholders, and validation messages into
    multiple languages\
-   🔁 Automatically convert submitted user data back into the form
    owner's language\
-   ✅ Validate user input using dynamic Zod-based schema generation\
-   💾 Persist forms and submissions locally for fast testing\
-   🧪 Preview forms live with real-time language switching

------------------------------------------------------------------------

## 🚀 Features

-   Multi-form management\
-   Dynamic field builder\
-   Real-time language switching\
-   Reverse translation on submission\
-   Validation using Zod + React Hook Form\
-   Modern UI using Tailwind CSS + Framer Motion\
-   Local persistence using Zustand

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Next.js 16**
-   **React 19**
-   **TypeScript**
-   **Tailwind CSS**
-   **Zustand**
-   **Zod**
-   **React Hook Form**
-   **Framer Motion**
-   **Lingo.dev SDK**

------------------------------------------------------------------------

## 🧩 Lingo.dev Features Used

This demo highlights several powerful capabilities of **Lingo.dev**:

### 1. Object Translation

Used to translate form UI dynamically:

``` ts
lingoDotDev.localizeObject()
```

This allows us to translate: - Field labels - Placeholders - Validation
messages

### 2. Reverse Translation

On form submission, user input is translated back into the form owner's
language --- enabling global data collection while maintaining internal
consistency.

### 3. Real-time Localization

The UI dynamically updates based on the selected language, demonstrating
how easy it is to build multilingual experiences using Lingo.dev.

------------------------------------------------------------------------

## 🏃‍♂️ How To Run Locally

### 1. Clone the Repository

``` bash
git clone https://github.com/GuptaShubham-11/lingo.dev.git
cd lingo.dev/community/form-lingo
```

### 2. Install Dependencies

``` bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add your Lingo.dev API key:

``` env
LINGO_API_KEY=your_api_key_here
```

### 4. Start Development Server

``` bash
pnpm dev
```

Now open:

    http://localhost:3000

------------------------------------------------------------------------

## 📂 Project Structure

    community/form-lingo
     ├── app/
     ├── components/
     ├── lib/
     ├── store/
     ├── public/
     └── README.md

------------------------------------------------------------------------

## 🎯 Demo Use Case

This demo shows how developers can:

-   Build localized forms
-   Validate user input dynamically
-   Collect multilingual submissions
-   Translate structured data easily

Perfect for:

-   SaaS onboarding forms
-   Surveys
-   Registration flows
-   Feedback collection
-   Multi-region products

------------------------------------------------------------------------

Built using **Lingo.dev** 💚\
Demo by **Shubham Gupta**

-   GitHub: https://github.com/guptashubham-11
-   Portfolio: https://gupta-shubham-11.vercel.app

------------------------------------------------------------------------

