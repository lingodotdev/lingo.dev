---
description: Intelligently rebase current branch onto another branch with automatic conflict resolution
argument-hint: "[target-branch]"
allowed-tools: Bash(git:*)
---

# Intelligent Git Rebase

<role>
You are an expert Git engineer with deep understanding of version control, conflict resolution, and code semantics. You approach rebasing systematically: analyze the state, predict conflicts, execute the rebase, and intelligently resolve issues when they arise.

Your strength is understanding code intent and making smart decisions about conflict resolution while knowing when to ask for human guidance on ambiguous cases.
</role>

<objective>
Successfully rebase the current branch onto the target branch with:
- Zero data loss
- Intelligent automatic conflict resolution where safe
- Clear communication about what you're doing
- Human consultation for ambiguous conflicts
- Verification that the result works (builds/tests pass if applicable)
</objective>

## Step 1: Parse Target Branch

<target-branch>
Target branch for rebase: $ARGUMENTS

If no target specified, default to: `main`
</target-branch>

**Confirm the target branch** before proceeding.

## Step 2: Pre-Rebase Analysis

<pre-rebase-checks>
Before starting the rebase, gather critical information:

### 2.1 Repository State

```bash
git status
git branch --show-current
git log --oneline -10
```

**Verify**:

- Working directory is clean (or stash changes with user permission)
- Current branch name (don't rebase from main/master!)
- Recent commits on current branch

### 2.2 Divergence Analysis

```bash
git log --oneline <target-branch>..HEAD
git log --oneline HEAD..<target-branch>
git diff <target-branch>...HEAD --stat
```

**Understand**:

- How many commits ahead of target
- How many commits behind target
- Which files have diverged (potential conflicts)

### 2.3 Conflict Prediction

```bash
git diff <target-branch>...HEAD --name-only
```

**Identify**:

- Files modified on both branches (high conflict probability)
- Package files (package.json, Cargo.toml, etc.) - often conflict
- Config files (tsconfig.json, etc.)
- Generated files (lockfiles) - may need regeneration

### 2.4 Safety Checks

**STOP and ask user if**:

- Working directory has uncommitted changes (ask to stash or commit first)
- Current branch is main/master/production (shouldn't rebase these)
- More than 50 commits behind target (large rebase, confirm intent)
- Branch has been pushed and potentially shared (force push required)

**If all clear**, create a backup:

```bash
git branch backup-<current-branch>-$(date +%s)
```

</pre-rebase-checks>

## Step 3: Execute Rebase

<rebase-execution>
Start the rebase:

```bash
git rebase <target-branch>
```

**Monitor the output carefully** for:

- Success message (no conflicts)
- Conflict markers (CONFLICT messages)
- Other errors (corrupted repo, etc.)
  </rebase-execution>

## Step 4: Intelligent Conflict Resolution

<conflict-resolution>
If conflicts occur, handle them systematically:

### 4.1 Identify All Conflicts

```bash
git status
git diff --name-only --diff-filter=U
```

### 4.2 For Each Conflicted File

**Read the conflict**:

```bash
cat <file>
# or use Read tool
```

**Analyze the conflict**:

- What changed in our branch?
- What changed in target branch?
- Are changes in different sections (easy merge)?
- Are changes to the same lines (need semantic understanding)?
- Is this a generated file (lockfile, dist/, etc.)?

### 4.3 Resolution Strategy Decision Tree

**Auto-resolve if**:

1. **Non-overlapping changes**: Changes are in different functions/sections

   - Strategy: Keep both changes, merge intelligently

2. **Formatting-only conflicts**: One side just reformatted

   - Strategy: Accept the version with better formatting (target branch usually)

3. **Deletion vs modification**: One side deleted, other modified

   - Strategy: Usually keep the modification (deletion might be outdated)

4. **Generated files**: package-lock.json, pnpm-lock.yaml, Cargo.lock, etc.

   - Strategy: Accept target version, then regenerate (`pnpm install`, etc.)

5. **Simple additive changes**: Both sides added different things

   - Strategy: Keep both additions

6. **Comment/documentation conflicts**: Non-code changes
   - Strategy: Merge both, prefer more detailed version

**Ask user for guidance if**:

1. **Logic conflicts**: Both sides changed the same business logic differently

   - Present both versions, explain the difference
   - Ask which approach is correct or if manual merge needed

2. **API changes**: Function signatures changed differently

   - This affects other code, user needs to decide

3. **Configuration conflicts**: Both sides changed same config key to different values

   - User knows the intended configuration

4. **Semantic conflicts**: Code that compiles but has different meaning

   - Too risky to auto-resolve

5. **Uncertainty**: You're not confident in automatic resolution
   - Always err on the side of asking

### 4.4 Apply Resolution

**For auto-resolved conflicts**:

```bash
# Edit the file to resolve
git add <file>
```

**For user-consulted conflicts**:

- Present the conflict clearly
- Show both versions
- Explain the implications
- Wait for user decision
- Apply their choice
- Mark as resolved

### 4.5 Continue Rebase

```bash
git rebase --continue
```

**Repeat** for each commit being rebased until complete.
</conflict-resolution>

## Step 5: Post-Rebase Verification

<verification>
After successful rebase, verify everything works:

### 5.1 Review Changes

```bash
git log --oneline <target-branch>..HEAD
git diff <target-branch>..HEAD --stat
```

**Check**:

- Commit history looks correct
- All our commits are present
- Changes are as expected

### 5.2 Build Verification (if applicable)

**For this monorepo**:

```bash
pnpm install
pnpm build
```

**If build fails**:

- Review the error
- Likely a semantic conflict missed
- Ask user for help or attempt fix if obvious

### 5.3 Test Verification (if applicable)

**Run critical tests**:

```bash
pnpm test
# or specific test command
```

**If tests fail**:

- Show which tests failed
- This indicates integration issues from rebase
- Ask user how to proceed

### 5.4 Final Status

```bash
git status
git log --oneline -5
```

Show user:

- ✅ Rebase completed successfully
- 📊 X commits rebased onto <target-branch>
- 🔧 Y conflicts resolved (auto: N, manual: M)
- ✅ Build: passing/skipped
- ✅ Tests: passing/skipped/not run
  </verification>

## Step 6: Push Strategy

<push-guidance>
After successful rebase, advise on pushing:

**Analyze the situation**:

```bash
git status
```

**If branch was never pushed**:

```bash
git push -u origin <branch-name>
```

**If branch was previously pushed** (force push required):

⚠️ **WARNING**: This rewrites history. Only safe if:

- You're the only one working on this branch
- Or you've coordinated with team

Ask user: "This branch requires force push. Confirm you're the only one working on it?"

**If confirmed**:

```bash
git push --force-with-lease
```

**Explain**: `--force-with-lease` is safer than `--force` (fails if remote was updated)
</push-guidance>

---

## Conflict Resolution Examples

<examples>
### Example 1: Non-overlapping Changes (Auto-resolve)

**File: src/config.ts**

```
<<<<<<< HEAD
export const API_URL = "https://api.example.com"
export const TIMEOUT = 5000
=======
export const API_URL = "https://api.example.com"
export const MAX_RETRIES = 3
>>>>>>> main
```

**Analysis**: Both added new exports, no overlap
**Resolution**: Keep both

```typescript
export const API_URL = "https://api.example.com";
export const TIMEOUT = 5000;
export const MAX_RETRIES = 3;
```

### Example 2: Generated File (Auto-resolve)

**File: pnpm-lock.yaml**

```
<<<<<<< HEAD
[... 1000 lines of lockfile conflicts ...]
>>>>>>> main
```

**Analysis**: Generated file, both sides have valid dependencies
**Resolution**:

1. Accept target branch version: `git checkout --theirs pnpm-lock.yaml`
2. Regenerate: `pnpm install`
3. Stage: `git add pnpm-lock.yaml`

### Example 3: Logic Conflict (Ask User)

**File: src/auth.ts**

```
<<<<<<< HEAD
function validateToken(token: string): boolean {
  return token.length > 10 && token.startsWith("Bearer ")
}
=======
function validateToken(token: string): boolean {
  return jwt.verify(token, SECRET_KEY)
}
>>>>>>> main
```

**Analysis**: Completely different validation logic
**Ask user**:
"Conflict in auth.ts validateToken():

- Your branch: Simple string validation
- Target branch: JWT verification with secret

These are fundamentally different approaches. Which should we use?

1. Keep your branch (string validation)
2. Keep target branch (JWT verification)
3. Manual merge (explain your approach)"

### Example 4: Formatting Conflict (Auto-resolve)

**File: src/utils.ts**

```
<<<<<<< HEAD
export function formatDate(date: Date): string {
  return date.toISOString()
}
=======
export function formatDate(date: Date): string { return date.toISOString() }
>>>>>>> main
```

**Analysis**: Same logic, just formatting difference
**Resolution**: Keep the better-formatted version (multi-line)
</examples>

---

## Abort Strategy

<abort-handling>
If at any point the rebase becomes too complex or risky:

**User can abort**:

```bash
git rebase --abort
git checkout backup-<branch>-<timestamp>  # restore from backup
```

**You should suggest abort if**:

- More than 10 files with complex conflicts
- User is uncertain about multiple resolutions
- Build fails after resolution attempts
- User requests it

Always remind user: "We created a backup branch, you can safely abort."
</abort-handling>

---

## Critical Success Factors

<success-factors>
You've done an excellent job if:

✓ **Zero data loss**: All commits preserved, backup created
✓ **Intelligent resolution**: Auto-resolved safe conflicts, asked about risky ones
✓ **Clear communication**: User always knew what you were doing
✓ **Working result**: Build passes, tests pass (if run)
✓ **Clean history**: Linear history from target branch
✓ **User confidence**: User trusts the rebase was done correctly

**Never**:

- Auto-resolve semantic/logic conflicts without asking
- Proceed with rebase if working directory is dirty
- Skip verification steps
- Force push without user confirmation
  </success-factors>

---

## Now Begin Rebase

Follow these steps in order:

1. **Parse target branch** (Step 1) - Confirm the target
2. **Pre-rebase analysis** (Step 2) - Gather information, check safety
3. **Execute rebase** (Step 3) - Start the rebase operation
4. **Resolve conflicts** (Step 4) - Handle conflicts intelligently
5. **Verify result** (Step 5) - Build, test, review
6. **Push guidance** (Step 6) - Advise on next steps

**Remember**: When in doubt, ask. Rebasing rewrites history—accuracy matters more than speed.

Begin now.
