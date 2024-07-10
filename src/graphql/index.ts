 // src/graphql/index.ts

import { metricsResolvers } from "./resolvers/metricsResolver";
import userResolvers from "./resolvers/userResolvers";

export const resolvers = {
  Query: {
    ...metricsResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...metricsResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};