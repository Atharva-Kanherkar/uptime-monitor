// src/graphql/schemas/metricsSchema.ts
import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Query {
    metrics(url: String!): Metrics
    metricsHistory(url: String!): [Metrics]

  }

  type Metrics {
    status: String
    responseTime: Int
    sslStatus: String 
    pingTime: Int
  }
`);
