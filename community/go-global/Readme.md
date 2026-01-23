## Problem

- Expanding a startup globally is expensive and time-consuming because manual translation takes hours, maintenance nightmare, lost market oppurtunities.

- So most startups launch in English-only markets and leave 75% of the global market untapped.

## Solution

- GoGlobal makes website localization as simple as pasting its URL.

- Input: Paste your website URL or upload your HTML/React files
- Translate: Select target languages and let AI translate your content with context awareness
- Preview: See live previews of your translated website
- Export: Download production-ready HTML or copy the translated code.

## To run it locally

- It is a nextjs project inside the <code>go-global</code> directory named as <code>frontend</code>(compromised naming convention lol).

- To run it :
  - <code>cd</code> into the <code>frontend</code> directory
  - Set the following in <code>.env</code>
    - LINGODOTDEV_API_KEY=
    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    - CLERK_SECRET_KEY=
  - Then run <code>npm i</code> and then <code>npm run dev</code>

## Additional upcoming features

- Will implement deployment strategies to deploy in the same url with a local subdomain
- Github OAuth + auto-PR
- Projects system for classification and sorting
