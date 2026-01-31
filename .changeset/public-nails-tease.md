---
"lingo.dev": minor
---

feat: add GPG commit signing support to GitHub Action

- Added `gpg-sign` input to action.yml for enabling GPG commit signing
- Added `--gpg-sign` CLI option for the `ci` command
- Added preflight check to verify GPG signing key is configured before committing
- Commits are signed with `-S` flag when GPG signing is enabled
- Works with both in-branch and pull-request modes

Usage:
```yaml
- uses: crazy-max/ghaction-import-gpg@v6
  with:
    gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
    git_user_signingkey: true
    git_commit_gpgsign: true

- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
    gpg-sign: true
```
