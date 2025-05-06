## Troubleshooting

### Error: Dynamic require of "module_name" is not supported

If you encounter this error when running the cli, it typically means that a dependency is trying to dynamically `require()` a Node.js built-in module or another dependency in a way that's incompatible with the ESM bundle format (`.mjs`).

The solution is to identify the problematic dependency mentioned in the error stack trace and exclude it from the bundle by adding it to the `external` array in `tsup.config.ts`.

For example, we encountered this issue with the `debug` package (a dependency of `@babel/traverse`) trying to dynamically require `"tty"`. We resolved it by adding `@babel/*` to the `external` array in `tsup.config.ts`.
