export function withExponentialBackoff<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000,
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;

        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Unreachable code");
  };
}
