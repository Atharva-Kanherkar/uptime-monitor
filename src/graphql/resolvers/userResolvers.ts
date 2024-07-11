 const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Context } from './context';
import { UserInput, AuthPayload, User } from './types';

const prisma = new PrismaClient();

const userResolvers = {
    Mutation: {
        async createUser(_: unknown, { input }: { input: UserInput }, context: Context): Promise<User> {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const user = await prisma.user.create({
                data: {
                    ...input,
                    password: hashedPassword,
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
            const token = jwt.sign({ userId: user.id },  "SECRETY");
            return {
                token,
                user,
            };
        },
    },
    Query: {
        me: async (_: unknown, __: unknown, context: Context): Promise<User | null> => {
            const userId = getUserId(context);
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

function getUserId(context: Context): string | null {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const verifiedToken = jwt.verify(token, process.env.APP_SECRET as string) as { userId: string };
        return verifiedToken.userId;
    }
    return null;
}

export default userResolvers;
