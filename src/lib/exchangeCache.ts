let cachedRate: {
  rate: number;
  fetchedAt: number;
} | null = null;

const MAX_AGE = 1000 * 60 * 15; // 15 minutes

export async function getRateCached(
  getLatestRateFn: () => Promise<{ rateToman: number }>
) {
  if (cachedRate && Date.now() - cachedRate.fetchedAt < MAX_AGE) {
    return cachedRate.rate;
  }

  const { rateToman } = await getLatestRateFn();
  cachedRate = {
    rate: rateToman,
    fetchedAt: Date.now(),
  };

  return rateToman;
}
