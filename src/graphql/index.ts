 // src/graphql/index.ts
import { metricsResolvers } from "./resolvers/metricsResolver";
import {userResolvers}  from "./resolvers/userResolvers";
import { emailResolvers } from "./resolvers/emailResolver";
// import { metricsResolvers } from "./resolvers/metricsResolver";
// import userResolvers from "./resolvers/userResolvers";

export const resolvers = {
  Query: {
     ...userResolvers.Query,
     ...metricsResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...metricsResolvers.Mutation,
    ...emailResolvers.Mutation
  },
};