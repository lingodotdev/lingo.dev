# Campus Connect

A multilingual campus events discovery app built with [Lingo.dev](https://lingo.dev)

## Overview

Campus Connect is a web application designed to help university students discover campus workshops, hackathons, and placement-related events in one centralized platform.

Large campuses often struggle with fragmented communication. Important event information is spread across posters, social groups, and informal channels, causing students to miss opportunities. Campus Connect solves this by providing a single, clear, and accessible interface for campus events.

The project also demonstrates how Lingo.dev can be used to implement scalable multilingual support in a real-world educational application.

## Problem Statement

Students on large and diverse campuses often face:

- **Scattered event information** across multiple channels
- **Unclear timing and venue details**
- **Language barriers** that reduce accessibility

Campus Connect addresses these issues by:

- Centralizing all events in one place
- Presenting clear, structured event details
- Supporting multiple languages without disrupting usability

## Key Features

### Event Discovery
- Centralized list of campus workshops, hackathons, and placement talks
- Clean event cards with title, description, time, and venue
- Category-based filtering for quick navigation

### Event Detail View
- Dedicated detail view for each event
- Extended descriptions explaining the purpose of the event
- Clearly separated static data (venue, time) and localized content

### User Interaction
- Language toggle without page reload
- Copy venue functionality with localized feedback
- Smooth navigation between event list and detail view

## Multilingual Support with Lingo.dev

Campus Connect uses [Lingo.dev](https://lingo.dev) to implement multilingual support in a structured and maintainable way.

### Lingo.dev Features Used

#### 1. Structured Translation Keys (Scoped Localization)

All translatable content uses scoped keys instead of raw strings.

**Examples:**
```
hero.title
events.dsa.title
events.dsa.desc
eventDetail.register
```

This ensures:
- Clear context for translations
- No key collisions
- Easy scalability as the app grows

#### 2. Build-Time Translation Extraction

Lingo.dev's compiler is used to extract and manage translations at build time.

```bash
npx lingo extract
```

This approach:
- Keeps English as the single source of truth
- Automatically updates locale files
- Avoids manual synchronization errors

#### 3. Variable Interpolation & Pluralization

Dynamic text is handled using variables rather than hardcoded strings.

**Example:**
```
"{{count}} events today"
```

This allows:
- Correct grammar across languages
- Accurate plural handling
- Real-time updates based on event data

#### 4. Static vs Dynamic Content Separation

Certain content, such as:
- Venue names
- Block numbers
- Room identifiers

remains unchanged across languages, while surrounding UI text is localized. This reflects real-world localization best practices.

### Supported Languages

- 🇬🇧 **English** (source language)
- 🇮🇳 **Hindi**
- 🇮🇳 **Punjabi**

Languages can be switched at runtime without affecting layout or functionality.

## Technical Architecture

### Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **Lingo.dev** (compiler-based localization)
- **JSON-based event data**

### Design Principles

- Clear separation of data and language
- Minimal runtime logic
- Reviewer-friendly, readable code
- Focus on real-world usability

## Project Structure

```
src/
 ├─ components/
 │   ├─ Hero.jsx
 │   ├─ EventCard.jsx
 │   ├─ EventDetail.jsx
 │   └─ LanguageToggle.jsx
 ├─ data/
 │   └─ events.json
 ├─ locales/
 │   ├─ en.json
 │   ├─ hi.json
 │   └─ pa.json
 ├─ i18n.js
 └─ App.jsx
```

## Installation & Setup Guide

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/campus-connect.git
cd campus-connect
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run the Development Server

```bash
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

### Step 4: Extract or Update Translations

Whenever you add or update translatable text:

```bash
npx lingo extract
```

This will update all locale files automatically.


## Future Improvements

- [ ] URL-based routing for event details
- [ ] Calendar integration for events
- [ ] Registration links or QR code support
- [ ] Admin dashboard for managing events

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Conclusion

Campus Connect demonstrates how Lingo.dev can be used to build a realistic, multilingual campus application with clean architecture and scalable localization.

The project prioritizes clarity, accessibility, and maintainability, making it a strong reference for education-focused multilingual applications.

---

**Built with ❤️ by Keshav**