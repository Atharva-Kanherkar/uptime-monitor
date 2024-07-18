import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { resolvers } from './graphql/index';
import { PrismaClient } from '@prisma/client';
import { createContext } from '../src/graphql/resolvers/context';
import { monitorWebsites } from './utils/send';
import jwt from 'jsonwebtoken';
import { User } from '../src/graphql/resolvers/types'; // Assuming you have a User type defined

const typeDefs = importSchema('src/graphql/schema.graphql');
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const token = req.headers.authorization || '';

    let user: User | null = null;
    if (token) {
      try {
        console.log(token);
        user = jwt.verify(token, "SECRETY") as User;
      } catch (err : unknown) {
        console.error('Invalid token:', (err as Error).message);
      }
    }

    return {
      prisma,
      request: req,
      response: res,
      user,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  setInterval(monitorWebsites, 60 * 1000);
});
