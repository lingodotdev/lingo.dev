---
argument-hint: <bucket-type>
description: Analyze a bucket type implementation to identify all behaviors and configurations
---

Given the bucket type ID "$ARGUMENTS" (e.g., "json", "mdx", "typescript"), analyze the implementation code to identify ALL bucket-specific behaviors, configurations, and characteristics.

## Instructions

1. **Locate where this bucket type is processed** in the codebase by searching for the bucket type string. Start with the main loader composition/pipeline code.

2. **Trace the complete execution pipeline** for this bucket:

   - List every function/loader in the processing chain, in order
   - For each function/loader, read its implementation to understand:
     - Input parameters it receives
     - Transformations it performs on the data
     - Output format it produces
     - Any side effects or file operations

3. **Identify configuration parameters** by:

   - Finding which variables are passed into the loaders (e.g., lockedKeys, ignoredKeys)
   - Tracing these variables back to their source (configuration parsing)
   - Determining if they're bucket-specific or universal

4. **Analyze file I/O behavior**:

   - How are file paths constructed?
   - Does the path pattern contain locale placeholders that would create separate files?
   - What file operations are performed (read, write, create, delete)?
   - Are files overwritten or are new files created?
   - **IMPORTANT**: Note that "overwrites existing files completely" and "[locale] placeholder support" are mutually exclusive in practice:
     - If a bucket type stores all locales in a single file (like CSV with columns per locale), it overwrites that single file and does NOT support `[locale]` placeholders
     - If a bucket type creates separate files per locale using `[locale]` placeholders, each locale file is overwritten individually
     - Clarify which pattern the bucket type follows

5. **Examine data transformation logic**:

   - How is the file content parsed?
   - What internal data structures are used?
   - How is the data serialized back to file format?
   - Are there any format-preserving mechanisms?

6. **Identify special behaviors** by examining:

   - Conditional logic specific to this bucket
   - Error handling unique to this format
   - Any validation or normalization steps
   - Interactions between multiple loaders in the pipeline

7. **Determine constraints and capabilities**:

   - What data types/structures are supported?
   - Are there any size or complexity limitations?
   - What happens with edge cases (empty files, malformed content)?

## Required Depth

- Read the ACTUAL implementation of each loader/function
- Follow all function calls to understand the complete flow
- Don't make assumptions - verify behavior in the code
- Consider the order of operations in the pipeline

## Output Format

List all findings categorized as:

- Configuration parameters (with their types and defaults)
- Processing pipeline (ordered list of transformations)
- File handling behavior
- Data transformation characteristics
- Special capabilities or limitations
- Edge case handling
