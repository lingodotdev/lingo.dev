## Reproducible, Hermetic Builds (Full Local ↔ CI Parity)

This guide explains how to run all dev and CI tasks inside the same pinned container and how to verify bit-for-bit identical artifacts.

### What you get

- One pinned container (`Dockerfile.repro`) used everywhere (local and CI)
- A parity runner (`scripts/repro/exec.sh`) for any command and a build entrypoint (`scripts/repro/build.sh`)
- Canonical packaging + checksums (`out/canonical.tar`, `out/SHA256SUMS`) and a manifest

### Prerequisites

- Docker installed and running

---

## Local: run everything inside the container

- Open a shell in the container at the repo root:

```bash
pnpm repro:exec
```

- Common tasks (all run inside the container):

```bash
pnpm repro:typecheck       # pnpm typecheck in container
pnpm repro:test            # pnpm test in container
pnpm repro:format:check    # pnpm format:check in container
pnpm repro:exec -- pnpm turbo build --force
```

- Hermetic build that creates canonical artifacts:

```bash
pnpm repro:build
```

Outputs:

- `out/canonical.tar` — canonical, deterministically packaged bundle
- `out/SHA256SUMS` — SHA-256 checksum for verification
- `out/BUILD-MANIFEST.json` — metadata (commit, SDE, tool versions)

How it works:

1. Builds the pinned image (Node 20.12.2, pnpm 9.12.3, GNU tar, git)
2. Mounts your repo at `/workspace`, sets HOME/cache inside the container
3. Sets `SOURCE_DATE_EPOCH` from the commit time to stabilize timestamps
4. Installs deps with `pnpm install --frozen-lockfile`
5. Runs `pnpm turbo build` with deterministic env (no telemetry/daemon/remote cache)
6. Packages canonical artifacts with sorted names, fixed mtimes, numeric ownership

Optional: speed up pnpm by caching the store locally across runs:

```bash
export REPRO_PNPM_STORE="$HOME/.pnpm-store-lingo"
pnpm repro:exec -- pnpm install --frozen-lockfile
```

Common tokens are passed through automatically if set in your shell: `GH_TOKEN`, `GITHUB_TOKEN`, `NPM_TOKEN`, `LINGODOTDEV_API_KEY`.

---

## CI: full parity with local

All workflows now run inside the same container via `scripts/repro/exec.sh`:

- PR checks: `.github/workflows/pr-check.yml`
- Release: `.github/workflows/release.yml` (including changesets version/publish)
- Lingo.dev: `.github/workflows/lingodotdev.yml`
- Reproducible build: `.github/workflows/reproducible-build.yml`

CI also uses a cached pnpm store mounted into the container to keep builds fast.

---

## Verify local vs CI artifacts

1. Trigger or wait for the "Reproducible Build" workflow
2. Download the artifact bundle (`canonical.tar`, `SHA256SUMS`)
3. Compare with your local build:

```bash
pnpm repro:build
cat out/SHA256SUMS
sha256sum out/canonical.tar   # optional local recompute
```

The checksums must match for the same commit.

---

## Notes on determinism

- Time: `SOURCE_DATE_EPOCH` comes from the commit time
- Packaging: `gnu tar --sort=name --mtime=@$SOURCE_DATE_EPOCH --owner=0 --group=0 --numeric-owner`
- Dependencies: `pnpm install --frozen-lockfile` fails on drift
- Build tools: tsup/esbuild remove legal comments and normalize working directory

---

## Updating pins

1. Edit `Dockerfile.repro` (Node image or pnpm version via corepack)
2. Update image tag references if needed
3. Run `pnpm repro:build` locally; verify checksum stability for the same commit
4. Open a PR; CI will rebuild and upload artifacts for verification

---

## Troubleshooting

- Docker not running: Ensure your Docker daemon is running
- Lockfile errors: Only update dependencies intentionally, commit lockfile changes
- No build outputs: Ensure packages emit `packages/*/build`; the packager collects these directories
