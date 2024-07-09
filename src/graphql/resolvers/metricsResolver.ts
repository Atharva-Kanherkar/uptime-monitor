 // src/graphql/resolvers/metricsResolver.ts
import { getMetrics } from '../../utils/metrics';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const metricsResolver = {
  metrics: async ({ url }: { url: string }) => {
    const result = await getMetrics(url);
    console.log(result);
    return result;
  },
  metricsHistory: async ({ url }: { url: string }) => {
    const history = await prisma.website.findMany({
      where: { url },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    return history;
  },
};
