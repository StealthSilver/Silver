type CachedContributions = {
  username: string;
  chartUrl: string;
  alt: string;
};

export function getCachedContributions(username: string): CachedContributions {
  return {
    username,
    chartUrl: `https://ghchart.rshah.org/${encodeURIComponent(username)}`,
    alt: `${username}'s GitHub contribution chart`,
  };
}
