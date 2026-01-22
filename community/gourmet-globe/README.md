# custom-hack-next-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It is a boilerplate for [CustomHack](https://lu.ma/rnvz7h05).

**tl;dr** [click here to deploy to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flingodotdev%2Fcustom-hack-next-app) or [open in StackBlitz](https://stackblitz.com/github/lingodotdev/custom-hack-next-app).

## Getting Started

First, install the dependencies via a package manager (we prefer [pnpm](https://pnpm.io/)):

```bash
pnpm install
```

Next run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

### Lingo.dev

AI localization for teams who ship fast. Translate apps, websites, and entire databases using the best LLM models.

- https://lingo.dev

Set your Lingo.dev API key as `LINGODOTDEV_API_KEY` (or login via `npx lingo.dev@latest login`) to use Compiler and CLI.

#### Compiler

Next.js application is localized using Lingo.dev Compiler.

- https://lingo.dev/en/compiler/frameworks/nextjs

#### CLI

Resend email templates are localized via Lingo.dev CLI.

- https://lingo.dev/en/cli

To localize templates tun `npx lingo.dev@latest run`.

### Autumn

The most simple and flexible way to setup payments.

- https://useautumn.com/
- [Sign up via this link](https://app.useautumn.com/sign-in?token=2zMnk448D3OFlXKsL9SBdj3609w) to auto create sample free and pro tiers in your Autumn sandbox.
- Paste in [Stripe test secret key](https://dashboard.stripe.com/test/apikeys) to your Autumn account on [this page](https://app.useautumn.com/sandbox/onboarding)
- Create your Autumn API key [in your account here](https://app.useautumn.com/sandbox/dev)

Set your API key as `AUTUMN_SECRET_KEY` env variable.

### Tambo

Add React components to your AI assistant, copilot, or agent.

- https://tambo.co/
- https://tambo.co/docs

Set your Tambo API key as `NEXT_PUBLIC_TAMBO_API_KEY` env variable. [The `NEXT_PUBLIC_` prefix makes it available client-side in browser.](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser)

**Use Tambo with BetterAuth** (`src/app/tambo/auth/page.tsx`):

```typescript
// Check session and get Google ID token
const { data: session } = useSession();
const token = await getAccessToken({ providerId: "google" });

// Pass idToken to Tambo as userToken
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  userToken={token.data?.idToken}
>
  <MessageThreadFull />
</TamboProvider>
```

### BetterAuth

The most comprehensive authentication framework for TypeScript.

- http://better-auth.com/
- http://better-auth.com/docs

Set the following env vars:

- secret key as `BETTER_AUTH_SECRET`
- base url as `BETTER_AUTH_URL`

### Supabase: Database Sync & Management via Prisma

After editing your Prisma schema (`prisma/schema.prisma` file) or on first setup, run:

```bash
# Run a new migration and apply it to your database
npx prisma migrate dev --name <migration-name>

# Generate the Prisma client (usually done automatically by migrate)
npx prisma generate
```

Set database connection string as `DATABASE_URL` and `DIRECT_URL` env vars (in Supabase, choose _Connect -> ORMs -> Prisma_)

For more details on Prisma, see:

- https://www.prisma.io/
- https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma

You can setup a Supabase database and lear about it here:

- https://supabase.com/
- https://supabase.com/docs/guides/database/overview

### Resend

Email for developers

- https://resend.com/
- https://resend.com/docs/send-with-nextjs

Set your API key as `RESEND_API_KEY` and sender email as `RESEND_FROM_EMAIL` env variables. Make sure you have the sender domain correctly configured in your Resend account.

### Firecrawl

Web scraping for devs & agents

- https://www.firecrawl.dev/
- https://docs.firecrawl.dev/

Set your API key as `FIRECRAWL_API_KEY` env variable.

### MagicUI

UI library for Design Engineers

- https://magicui.design/
- https://magicui.design/docs/components

### Next.js

The React Framework for the Web

- https://nextjs.org/docs
- https://nextjs.org/learn

### Setting up env variables

You need to create and use your own accounts and setup env variables for your project. It is up to you how you do this:

1. put them in `.env` file of your project. See `env.example` for a full list of env vars. Next.js loads them automatically for you.

2. export them globally (eg. `export LINGODOTDEV_API_KEY=api_xxx`) in your shell or profile (eg. `~/.profile`)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

When deploying to Vercel make sure to populate all env variables in your app.
