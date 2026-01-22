# LingoNotify
### AI-Powered Multilingual Notification Backend (Spring Boot + Lingo.dev)

LingoNotify is a **Spring Boot backend service** that sends **localized notifications** based on the user’s language preference.
It demonstrates how **Lingo.dev** can be used for **backend internationalization**, not only frontend apps.

This project is built as a **community demo / reference implementation** for integrating **Lingo.dev with Java & Spring Boot**.

---

## Why This Project?

Most backend systems:
- Hardcode messages in one language
- Manually manage translation files
- Lack scalable internationalization

**LingoNotify solves this by:**
- Using **message keys** instead of hardcoded text
- Translating messages automatically using **Lingo.dev**
- Returning localized responses based on `Accept-Language`
- Logging notifications for auditing/debugging

---

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- H2 In-Memory Database
- Jackson
- **Lingo.dev CLI (AI-powered i18n)**

---

## Supported Languages

| Language | Code |
|---------|------|
| English (source) | `en` |
| French | `fr` |
| Bengali | `bn` |

> Adding new languages requires **no backend code changes**.

---

## Project Structure

```
lingo-notify/
├── src/main/java/com/lingonotify
│   ├── controller
│   │   └── NotificationController.java
│   ├── service
│   │   ├── NotificationService.java
│   │   └── TranslationService.java
│   ├── model
│   │   └── NotificationLog.java
│   ├── repository
│   │   └── NotificationRepository.java
│   └── LingoNotifyApplication.java
│
├── src/main/resources
│   ├── lingo
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── bn.json
│   └── application.yml
│
├── i18n.json
├── pom.xml
└── README.md
```

---

## How Localization Works

1. Messages are written once in `en.json`
2. Lingo.dev generates translations (`fr.json`, `bn.json`)
3. Backend selects language using the `Accept-Language` header
4. Localized message is returned via REST API

---

## Example Translation File

**`src/main/resources/lingo/en.json`**

```json
{
  "order.shipped": "Your order has been shipped",
  "user.welcome": "Welcome to LingoNotify!"
}
```

---

## API Usage

### Send Notification

**POST** `/api/notify`

#### Headers

```
Content-Type: application/json
Accept-Language: fr
```

#### Request Body

```json
{
  "messageKey": "order.shipped"
}
```

#### Response

```json
{
  "status": "SENT",
  "message": "Votre commande a été expédiée"
}
```

---

## Testing with Postman

1. Start the app:

   ```bash
   mvn spring-boot:run
   ```

2. Open Postman
3. Method: **POST**
4. URL:

   ```
   http://localhost:8080/api/notify
   ```

5. Headers:

   - `Content-Type: application/json`
   - `Accept-Language: en | fr | bn`

6. Body:

   ```json
   {
     "messageKey": "order.shipped"
   }
   ```

---

## Database (H2 Console)

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:lingo`
- Username: `sa`
- Password: *(empty)*

Query logs:

```sql
SELECT * FROM NOTIFICATION_LOG;
```

---

## Lingo.dev Setup (Summary)

```bash
npm install -g lingo.dev
lingo.dev login
lingo.dev run
```

Localization configuration is defined in `i18n.json`.

---

## Use Cases

- SaaS notifications
- E-commerce order updates
- Banking / fintech alerts
- System messages
- Multi-region backend services

---

## Why This Matters for Lingo.dev

- Demonstrates **backend-first localization**
- Shows **real enterprise usage**
- Helps Java/Spring developers adopt Lingo.dev
- Scalable & production-ready example

---

