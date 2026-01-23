let ERROR_STORE: Record<string, Record<string, string>> = {};

export function initError(errors: Record<string, Record<string, string>>) {
  ERROR_STORE = errors;
}

export function getErrorStore() {
  return ERROR_STORE;
}
