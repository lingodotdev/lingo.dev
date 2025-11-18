# Extremely important instructions for Claude

## FYI

- We're in a pnpm + turbo monorepo

## Tools

- Must use `pnpm` as package manager

## Testing

- When you add tests - make sure they pass

## Changesets

- Every PR must include a changeset
- Create changeset: `pnpm new` from repo root
- For changes that don't need a release (e.g., README updates): `pnpm new:empty`