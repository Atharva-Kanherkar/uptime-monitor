 // src/index.ts
import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers/metricsResolver';

const typeDefs = importSchema('src/graphql/schema.graphql');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
