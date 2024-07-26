const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Context } from './context';
import { UserInput, AuthPayload, User, UpdateUserInput } from './types';
import { checkWebsiteStatus, getResponseTime } from '../../utils/metrics';

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
              status: (await checkWebsiteStatus(input.website.url)).toString(),
              responseTime: await getResponseTime(input.website.url),
            },
          } : undefined,
        },
        include: {
          website: true,
        },
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
    async deleteUser(_: unknown, __: unknown, context: Context): Promise<User> {
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

      await prisma.website.deleteMany({
        where: { userId },
      });

      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      return deletedUser;
    },
    async updateUser(_: unknown, { input }: { input: UpdateUserInput }, context: Context): Promise<User> {
      const userId = context.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { website: true }, // Include website in the query
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updatedData: Partial<UpdateUserInput> = { ...input };
      if (input.password) {
        updatedData.password = await bcrypt.hash(input.password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email: input.email,
          password: input.password ? await bcrypt.hash(input.password, 10) : undefined,
          website: {
            upsert: {
              create: {
                url: input.website.url,
                status: (await checkWebsiteStatus(input.website.url)).toString(),
                responseTime: await getResponseTime(input.website.url),
              },
              update: {
                url: input.website.url,
              },
            },
          },
        },
        include: {
          website: true,
        },
      });

      return updatedUser;
    },
  },
  Query: {
    me: async (_: unknown, __: unknown, context: Context): Promise<User | null> => {
      const userId = context.user?.id;  
      console.log(userId)
      if (userId) {
        return prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            website: true, // Include website if needed
          },
        });
      }
      return null; // Return null if userId is not available
    },
  },
};

// Useless as of now.
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
