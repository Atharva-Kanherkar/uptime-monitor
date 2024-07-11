 // src/graphql/index.ts

import userResolvers  from "./resolvers/userResolvers";
// import { metricsResolvers } from "./resolvers/metricsResolver";
// import userResolvers from "./resolvers/userResolvers";

export const resolvers = {
  Query: {
     ...userResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation
  },
};