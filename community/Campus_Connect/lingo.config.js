export default {
  sourceLocale: "en",
  locales: ["en", "hi", "pa"],
  catalogs: [
    {
      path: "src/locales/{locale}.json",
      include: ["src/**/*.{js,jsx}"]
    }
  ]
};
