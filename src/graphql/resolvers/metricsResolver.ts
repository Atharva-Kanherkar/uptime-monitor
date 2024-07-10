//  // src/graphql/resolvers/metricsResolver.ts
// import { PrismaClient } from '@prisma/client';
// import { getMetrics } from '../../utils/metrics';

// const prisma = new PrismaClient();

// export const metricsResolvers = {
//   Query: {
//     metricsHistory: async (_: any, { url }: { url: string }) => {
//       const history = await prisma.website.findMany({
//         where: { url },
//         orderBy: { timestamp: 'desc' },
//         take: 10,
//       });
//       return history;
//     },
//   },
//   Mutation: {
//     getMetrics: async (_: any, { url }: { url: string }) => {
//       const metrics = await getMetrics(url);
//       const savedMetrics = await prisma.website.create({
//         data: {
//           url,
//           status: metrics.status,
//           responseTime: metrics.responseTime,
         
//         },
//       });
//       return savedMetrics;
//     },
//   },
// };
