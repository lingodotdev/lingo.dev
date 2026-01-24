# Error Message & Validation Localization Engine

A production-grade demo showing how to automatically localize backend error and validation messages using [Lingo.dev](https://lingo.dev).

## 🚀 The Core Problem

Most applications translate UI labels but leave backend error messages in English. This creates a disjointed experience for international users (e.g., getting a "Password too short" error in English while browsing a Spanish site).

This usage fixes that by intercepting errors and dynamically localizing them before they reach the client.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment.
- **Express**: Web server and routing.
- **Lingo.dev SDK**: AI-powered localization engine.

## 🏃‍♂️ How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file and add your Lingo.dev API key:
   ```bash
   LINGO_API_KEY=your_api_key_here
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Open the Demo**
   - Open your browser and go to: `http://localhost:3000`
   - Select a language from the dropdown
   - Try the test cases to see localized errors!

## 🧪 Testing the API

The API detects language preference via:
1. `?lang=xx` query parameter (High priority)
2. `Accept-Language` header (Low priority)

### 1. English (Default)
**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'
```
**Response:**
```json
{
  "error": "Validation Failed",
  "message": "Please provide a valid email address."
}
```

### 2. Spanish (via Query Param)
**Request:**
```bash
curl -X POST "http://localhost:3000/api/auth/signup?lang=es" \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'
```
**Response (Localized):**
```json
{
  "error": "Falló la validación",
  "message": "Por favor proporcione una dirección de correo electrónico válida."
}
```

### 3. French (via Header)
**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Accept-Language: fr" \
  -d '{"email": "test@example.com", "password": "short"}'
```
**Response (Localized):**
```json
{
  "error": "Échec de la validation",
  "message": "Le mot de passe doit contenir au moins 6 caractères."
}
```
