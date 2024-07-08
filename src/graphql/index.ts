// src/graphql/index.ts
import { schema } from './schemas/metricsSchemas';
import { metricsResolver } from './resolvers/metricsResolver';

export const root = {
  ...metricsResolver,
};

export { schema };
