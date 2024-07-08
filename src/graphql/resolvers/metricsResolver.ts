 // src/graphql/resolvers/metricsResolver.ts
import { getMetrics } from '../../utils/metrics';
// import Metric from '../../models/Metric';

export const metricsResolver = {
  metrics: async ({ url }: { url: string }) => {
    const result = await getMetrics(url);
    console.log(result);
    return result;
  },
//   metricsHistory: async ({ url }: { url: string }) => {
//     const history = await Metric.find({ url }).sort({ timestamp: -1 }).limit(10);
//     return history;
//   },
};
