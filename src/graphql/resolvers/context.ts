import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  prisma: PrismaClient;
  request: Request;
  response: Response;
  user: any;  
}

const prisma = new PrismaClient();

export const createContext = (request: Request & { user: any }, response: Response): Context => {
  return {
    prisma,
    request,
    response,
    user: request.user, // Include user in the context
  };
};
