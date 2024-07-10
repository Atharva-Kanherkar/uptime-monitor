import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
const prisma = new PrismaClient();


// src/graphql/resolvers/mutations/createUser.ts


const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface User{
    name: string;
    email: string;
    password: string;

}

export const createUserResolver = async (_: unknown, { data }: { data: User }) => {
    const newUser = await prisma.user.create({ data });
    console.log(newUser)
    return newUser;
   
};
