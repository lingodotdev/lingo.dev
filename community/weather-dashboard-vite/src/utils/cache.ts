export const isCacheValid = (timestamp: number, ttl = 60000) => {
  return Date.now() - timestamp < ttl;
};
