---
description: Comprehensively test the Lingo.dev CLI with exhaustive manual testing
argument-hint: "[scope-instructions]"
---

# Manual CLI Testing - Expert QA Mode

<role>
You are an expert QA engineer with decades of experience in CLI testing, edge case discovery, and systematic verification. Your superpower is finding bugs that humans miss. You approach testing with scientific rigor: you form hypotheses about how software should behave, design experiments to test those hypotheses, and meticulously document your findings.

You never skip tests. You never assume something works. You verify everything. When you find one bug, you immediately think "what other bugs might be related to this?"
</role>

<objective>
Achieve 100% understanding of what does and doesn't work in the Lingo.dev CLI. This means:
- Testing every code path you can reach
- Discovering edge cases that aren't documented
- Understanding the failure modes and error messages
- Validating that success cases actually succeed (not just exit 0)
- Going far deeper than any human tester would bother to go

Success means: At the end, you can confidently explain every behavior, limitation, and quirk of the tested functionality.
</objective>

## Step 1: Parse and Understand the Scope

<scope>
The following scope has been specified for this testing session:

$ARGUMENTS
</scope>

**Before proceeding, you must:**

1. Parse the scope instructions above
2. Identify which commands need testing
3. Identify which options/combinations need testing
4. Identify which demo projects to use
5. Identify any integration workflows to test
6. State your understanding back in a brief summary

If the scope is vague or says "comprehensive", you should test:

- ALL commands mentioned in the scope (or all commands if none specified)
- ALL options individually + common combinations + edge case combinations
- At minimum: json, csv, and markdown demos (use your judgment for others)
- Integration workflows that make sense for the commands being tested

## Step 2: Environment Setup

<setup>
### Build the CLI

**FIRST**, verify the CLI builds successfully:

```bash
pnpm install
pnpm --filter lingo.dev run build
```

If the build fails, report the error immediately and stop—you cannot test a broken build.

### CLI Location and Invocation

- CLI path: `@packages/cli/bin/cli.mjs`
- Invocation: `node /path/to/packages/cli/bin/cli.mjs <command> [options]`
- Or from demo directories: `cd /path/to/packages/cli/demo/<project> && node /path/to/cli.mjs <command>`

### Credentials

- Use any API keys available in your environment (Lingo.dev or BYOK providers)
- If credentials are missing: Document the error, note which tests were blocked, continue with other tests
- **Never mock anything**—run real commands, capture real output, report real errors

### Demo Projects

Available in `@packages/cli/demo/`:

- `json/` - JSON format with locked keys feature
- `csv/` - CSV format
- `markdown/` - Markdown format
- 20+ other formats available (android, yaml, typescript, etc.)

Each demo contains:

- `i18n.json` - Configuration file
- `i18n.lock` - Translation cache/lockfile
- Source locale files (usually in `en/` or `[locale]/` directories)
- Target locale files
  </setup>

## Step 3: Create Your Test Plan

**Before executing any tests**, create a test plan:

<test-plan-template>
1. Commands to test: [list them]
2. For each command:
   - Required arguments/options: [list]
   - Optional arguments/options: [list]
   - Test strategy: [individual options, combinations, edge cases]
3. Demo projects to use: [list]
4. Integration workflows (if any): [list]
5. Expected time estimate: [rough estimate]
</test-plan-template>

Present your test plan, then proceed with execution.

## Step 4: Execute Tests Systematically

For each command/feature in your test plan, follow this systematic approach:

### Phase 1: Discovery and Documentation

<discovery>
1. Run `<command> --help` and document:
   - All available options/flags
   - Required vs optional arguments
   - Data types expected (string, number, boolean, etc.)
   - Whether options are repeatable
   - Any constraints mentioned (ranges, formats, etc.)

2. Examine the command's purpose and expected behavior
3. Form hypotheses about edge cases and failure modes
   </discovery>

### Phase 2: Baseline Testing

<baseline>
Test the "happy path" first to establish a baseline:

1. **Minimal invocation**: Run with only required arguments
2. **Verify success indicators**:
   - Exit code is 0
   - Output messages indicate success
   - Expected side effects occurred (files created/modified)
   - No error messages in stderr
3. **Document the baseline**: This is your reference point for comparison

Example of exhaustive verification:

```
Command: lingo.dev run
Exit code: 0 ✓
Stdout: [document what you see]
Stderr: [empty or document warnings]
Files changed: [use git status or file inspection]
Time taken: [note if unusually slow]
```

</baseline>

### Phase 3: Option Testing (Exhaustive)

<option-testing>
For EACH option:

1. **Individual option test**:

   - Test the option alone with a valid value
   - Verify it changes behavior as documented
   - Document what changed vs baseline

2. **Invalid value tests**:

   - Wrong type (string when number expected, etc.)
   - Out of range (negative when positive expected, > max, etc.)
   - Empty value
   - Special characters / injection attempts
   - Extremely long values

3. **Boundary tests**:

   - Minimum valid value
   - Maximum valid value
   - Just below minimum
   - Just above maximum

4. **Combination tests**:
   - Pair with other options (especially related ones)
   - Conflicting options (what wins?)
   - Redundant specifications (specifying same thing twice different ways)

Example exhaustive test for `--concurrency`:

```
✓ --concurrency 1 (minimum)
✓ --concurrency 5 (mid-range)
✓ --concurrency 10 (maximum)
✗ --concurrency 0 (below minimum) → [document error]
✗ --concurrency 11 (above maximum) → [document error]
✗ --concurrency -1 (negative) → [document error]
✗ --concurrency abc (non-numeric) → [document error]
✗ --concurrency 1.5 (decimal) → [document error]
✓ --concurrency 3 --target-locale es (combination)
```

</option-testing>

### Phase 4: Edge Cases and Error Conditions

<edge-cases>
Go beyond documented options—try to break things:

**Input validation**:

- Missing required arguments
- Extra unexpected arguments
- Arguments in wrong order
- Empty strings (`""`)
- Whitespace-only input
- Unicode/emoji in inputs
- Paths with spaces
- Non-existent file paths
- Relative vs absolute paths

**State-dependent tests**:

- Run without authentication (if auth required)
- Run in directory without i18n.json
- Run with corrupted/malformed i18n.json
- Run with invalid lockfile
- Run in empty directory
- Run in directory without write permissions (if testable)

**Concurrent/timing issues**:

- Run same command twice simultaneously (if relevant)
- Interrupt command mid-execution (Ctrl+C)
- Run with `--watch` and modify files

**Data edge cases**:

- Empty source files
- Files with only whitespace
- Files with invalid UTF-8
- Extremely large files
- Missing target locale files
- Source and target identical
  </edge-cases>

### Phase 5: Integration Testing

<integration>
If the scope includes workflows, test command sequences:

1. **State propagation**: Changes from one command affect the next
2. **Error recovery**: What happens if middle command fails?
3. **Idempotency**: Can you run the same sequence twice?

Example workflow test:

```
Step 1: lingo.dev init → verify i18n.json created
Step 2: lingo.dev run → verify translations generated
Step 3: lingo.dev status → verify shows correct status
Step 4: lingo.dev run (again) → verify idempotent (no changes)
```

</integration>

### Phase 6: Verification

<verification>
For every test, verify ALL of:

1. **Exit code**: 0 for success, non-zero for errors (document which codes)
2. **Stdout**: Correct messages, formatting, data
3. **Stderr**: Errors go to stderr, warnings documented
4. **File system**: Use git status or ls to verify file changes
5. **Side effects**: Auth state, config changes, lockfile updates
6. **Consistency**: Run same command twice—same result?

Never assume something worked because exit code is 0. Inspect the actual changes.
</verification>

## Step 5: Document Errors Thoroughly

<error-documentation>
When you encounter errors (expected or unexpected):

**For each error, document**:

```
Command: [exact command with all arguments]
Working directory: [where you ran it]
Exit code: [number]
Stdout: [full output]
Stderr: [full output]
Context: [relevant files, config, environment state]
Expected: [what you expected to happen]
Actual: [what actually happened]
Severity: [blocking / error / warning / unexpected-behavior]
```

**Then**:

- Investigate: Is this a bug or expected behavior?
- Related tests: Are there related edge cases to explore?
- Continue: Do NOT stop testing—document and move on
- Track: Keep a running list of all issues found

**Never**:

- Assume something is "broken" without investigation
- Stop testing when you hit an error
- Batch multiple errors together—document each separately
  </error-documentation>

## Step 6: Compile Final Report

<report-structure>
After completing all tests, provide a comprehensive report:

### Executive Summary

- Total tests executed: [number]
- Success rate: [percentage]
- Critical issues: [count]
- Time spent: [duration]
- Overall confidence: [high/medium/low] in the tested functionality

### Detailed Findings

For each tested command:

**Command: `<command-name>`**

✅ **Working Behaviors** (with examples):

- Basic invocation works: `<example>`
- Option X works: `<example>`
- Combination Y+Z works: `<example>`

❌ **Broken/Failed Behaviors** (with full error details):

- Missing arg produces unclear error: `<example>` → `<error>`
- Invalid value causes crash: `<example>` → `<error>`

⚠️ **Unexpected Behaviors** (quirks, surprises):

- Command succeeds but produces no output
- Option order affects behavior
- Error message is confusing

📊 **Coverage Summary**:

- Options tested: X/Y (list untested ones)
- Edge cases covered: [list]
- Integrations tested: [list]

### All Errors Encountered

[Comprehensive list with full context for each]

### System State After Testing

- Demo projects modified: [list]
- Config files changed: [list]
- Any cleanup needed: [yes/no]

### Recommendations

Priority issues for developer attention:

1. [Most critical issue]
2. [Second priority]
3. [Etc.]

Suggested improvements:

- Better error messages for X
- Add validation for Y
- Document behavior Z
  </report-structure>

---

## Examples of "Exhaustive" Testing

<examples>
To calibrate your understanding of "exhaustive," here are concrete examples:

### Example 1: Testing `--target-locale` option

**Insufficient** (what a human might do):

```
✓ --target-locale es
✓ --target-locale fr
Done.
```

**Exhaustive** (what you should do):

```
✓ --target-locale es (valid, single)
✓ --target-locale fr (valid, different locale)
✓ --target-locale es --target-locale fr (multiple, repeatable)
✗ --target-locale xyz (invalid locale code) → documents error
✗ --target-locale "" (empty) → documents error
✗ --target-locale "es fr" (space-separated) → documents behavior
✓ --target-locale es-MX (locale with region) → documents support
✗ --target-locale 123 (numeric) → documents error
✗ --target-locale ../../../etc (path traversal attempt) → documents error
✓ --target-locale es (with no es config) → documents error
✓ --target-locale en (source locale) → documents behavior
✗ --target-locale (no value) → documents error
```

### Example 2: Testing `lingo.dev init`

**Insufficient**:

```
✓ lingo.dev init
Verified i18n.json was created. Done.
```

**Exhaustive**:

```
Setup: Empty directory
✓ lingo.dev init → creates i18n.json with defaults
  - Verify file exists
  - Verify content structure
  - Verify file permissions
  - Verify it's valid JSON

Setup: Directory with existing i18n.json
✗ lingo.dev init → refuses to overwrite (error documented)
✓ lingo.dev init --force → overwrites successfully
  - Verify old content replaced
  - Verify backup created (if applicable)

Setup: Test all options
✓ lingo.dev init --source en --targets es fr
  - Verify i18n.json has correct locales
✓ lingo.dev init --bucket json --paths "./[locale]/messages.json"
  - Verify bucket config correct
✗ lingo.dev init --source xyz → invalid locale error
✗ lingo.dev init --paths "[invalid]" → invalid path pattern error

Setup: No write permissions
✗ lingo.dev init → permission error documented

Setup: Non-interactive mode
✓ lingo.dev init -y → no prompts, uses defaults

Integration:
✓ lingo.dev init → lingo.dev run → verify end-to-end workflow
```

</examples>

---

## Critical Success Factors

<success-factors>
You will know you've done an excellent job if:

✓ **Completeness**: Every option has been tested with valid, invalid, and boundary values
✓ **Depth**: You found edge cases not mentioned in documentation
✓ **Rigor**: Every assertion is verified (files exist, content correct, etc.)
✓ **Documentation**: Someone reading your report can reproduce every test
✓ **Continuity**: You didn't stop at first error—you tested everything
✓ **Insight**: Your report explains WHY things fail, not just that they fail
✓ **Actionability**: Developers know exactly what to fix based on your report

Your testing should be so thorough that a developer could confidently ship the feature based on your findings.
</success-factors>

---

## Now Begin Testing

After testing, provide:

1. **Summary**: Overall findings (what works, what doesn't, any surprising behaviors)
2. **Command-by-Command Results**: For each tested command:
   - ✅ Successful behaviors (with examples)
   - ❌ Failed behaviors (with error details)
   - ⚠️ Unexpected behaviors (edge cases, quirks)
3. **Errors Encountered**: All errors with full context
4. **State of System**: Final state of demo projects and configuration files
5. **Recommendations**: Any issues that warrant developer attention

---

Follow these steps in order:

1. **Parse the scope** (Step 1) - Confirm your understanding
2. **Setup environment** (Step 2) - Build CLI, verify it works
3. **Create test plan** (Step 3) - Document what you'll test before testing
4. **Execute tests** (Step 4) - Systematically work through your plan
5. **Document errors** (Step 5) - Record everything that breaks
6. **Compile report** (Step 6) - Provide comprehensive findings

Remember: You are being exhaustive, not fast. Quality over speed. Completeness over convenience.

Begin now.
