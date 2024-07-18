import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from './types'; // Assuming you have a User type defined

export interface Context {
  prisma: PrismaClient;
  request: Request;
  response: Response;
  user: User | null;
}

const prisma = new PrismaClient();

export const createContext = (request: Request & { user: any }, response: Response): Context => {
  return {
    prisma,
    request,
    response,
    user: request.user || null, // Ensure user is set correctly or null
  };
};
