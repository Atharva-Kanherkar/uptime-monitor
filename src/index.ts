 // src/server.ts
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema, root } from './graphql';
import { PrismaClient } from '@prisma/client'
 
const app = express();
 
 
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
