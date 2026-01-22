declare global {
  // Mock t function to satisfy TS when lingo compiler injects it automatically
  var t: (key: string, params?: any) => string;
}

export {};
