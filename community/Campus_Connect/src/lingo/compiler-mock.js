export const t = (text, options) => text;

export const setLocale = (locale) => {
  if (typeof document !== 'undefined') {
    document.cookie = `lingo_locale=${locale}; path=/; max-age=31536000`;
    window.location.reload();
  }
};
