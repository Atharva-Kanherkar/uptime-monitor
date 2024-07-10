 // src/graphql/index.ts

import { mutation } from "./resolvers/mutations";

// import { metricsResolvers } from "./resolvers/metricsResolver";
// import userResolvers from "./resolvers/userResolvers";

export const resolvers = {
  Query: {
     
  },
  Mutation: {
    ...mutation
  },
};