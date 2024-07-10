import { PrismaClient } from '@prisma/client';
import { getMetrics } from '../../utils/metrics'; 

const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    getUser: async (_: unknown, { id }: { id: string }) => prisma.user.findUnique({ where: { id } }),
    getUsers: async () => prisma.user.findMany(),
    getWebsite: async (_: unknown, { id }: { id: number }) => prisma.website.findUnique({ where: { id } }),
    getWebsites: async () => prisma.website.findMany(),
  },
  Mutation: {
    createUser: async (_: unknown, { data }: { data: any }) => { const newUser = prisma.user.create({ data })
    return newUser! ;},
    updateUser: async (_: unknown, { id, data }: { id: string, data: any }) => prisma.user.update({ where: { id }, data }),
    deleteUser: async (_: unknown, { id }: { id: string }) => prisma.user.delete({ where: { id } }),
 
  },
};

export default userResolvers;
