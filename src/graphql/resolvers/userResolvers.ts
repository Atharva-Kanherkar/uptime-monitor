const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Context } from './context';
import { UserInput, AuthPayload, User, UpdateUserInput } from './types';
import { checkWebsiteStatus } from '../../utils/metrics';

const prisma = new PrismaClient();

 export const userResolvers = {
  Mutation: {
    async createUser(_: unknown, { input }: { input: UserInput }, context: Context): Promise<User> {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword,
          website: input.website ? {
            create: {
              url: input.website.url,
              status:  (await checkWebsiteStatus(input.website.url)).toString(),
              responseTime:   0,
            }
          } : undefined,
        },
        include: {
          website: true,
        }       
      });
      return user;
    },
    async login(_: unknown, { email, password }: { email: string; password: string }, context: Context): Promise<AuthPayload> {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error('No such user found');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ id: user.id }, "SECRETY", {
        expiresIn: '1h', // Token expiration time
      });
      
      return {
        token,
        user,
      };
    },
    async updateUser(_: unknown, { input }: { input: UpdateUserInput }, context: Context): Promise<User> {
      const userId = context.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const updatedData: Partial<UpdateUserInput> = { ...input };
      if (input.password) {
        updatedData.password = await bcrypt.hash(input.password, 10);
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });
      return updatedUser;
    
    },
      async deleteUser (
        _: unknown,
        __: unknown, // No input required
        context: Context
      ): Promise<User> {
        const userId = context.user?.id;
      
        if (!userId) {
          throw new Error('Not authenticated');
        }
      
        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });
      
        if (!user) {
          throw new Error('User not found');
        }
      
        await context.prisma.website.deleteMany({
          where: { userId },
        });
      
        const deletedUser = await context.prisma.user.delete({
          where: { id: userId },
        });
      
        return deletedUser;
      },
      
  },
  Query: {
    me: async (_: unknown, __: unknown, id : { id : string } ): Promise<User | null> => {
      const userId =  id.id;
      if (userId) {
        return prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
      }
      return null;
    },
  },
};

//Useless as of now. 
/*
function getUserId(context: Context): string | null {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = jwt.verify(token, "SECRETY") as { userId: string };
    return verifiedToken.userId;
  }
  return null;
}
*/
