import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  /* Clean the output directory before each build */
  clean: true,

  /* Where generated files are written */
  outDir: "build",

  /* Generate type declarations */
  declaration: true,

  /* Generate source-maps */
  sourcemap: true,

  /* Treat these as external – they must be provided by the host app */
  externals: ["react", "next"],

  /* Transpile every file in src/ one-to-one into build/ keeping the folder structure */
  entries: [
    {
      builder: "mkdist",
      /* All TS/TSX/JS/JSX files under src become part of the build */
      input: "./src",
      /* Mirror the structure in the build directory */
      outDir: "./build",
      /* Emit ESM with the standard .js extension */
      format: "esm",
      ext: "js",
      /* Produce matching .d.ts files next to their JS counterparts */
      declaration: true,
      /* Ensure relative imports inside declaration files include the .js extension */
      addRelativeDeclarationExtensions: true,
      /* Use React 17+ automatic JSX runtime so output imports jsx from react/jsx-runtime */
      esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
      },
    },
  ],
});
