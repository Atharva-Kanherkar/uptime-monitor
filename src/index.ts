import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './graphql/index';
import { PrismaClient } from '@prisma/client';
import { createContext } from  '../src/graphql/resolvers/context';
import { monitorWebsites } from './utils/send';
 
const typeDefs = importSchema('src/graphql/schema.graphql');
const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => createContext(req, res),
});





server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    monitorWebsites();
});
