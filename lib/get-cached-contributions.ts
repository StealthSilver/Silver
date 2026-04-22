type CachedContributions = {
  username: string;
};

export function getCachedContributions(username: string): CachedContributions {
  return {
    username,
  };
}
