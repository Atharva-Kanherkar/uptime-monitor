 // src/utils/metrics.ts
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import ping from 'ping';

const prisma = new PrismaClient();

const getResponseTime = async (url: string) => {
  const start = Date.now();
  await axios.get(url);
  const end = Date.now();
  return end - start;
};

const checkWebsiteStatus = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.status === 200 ? 'Up' : 'Down';
  } catch {
    return 'Down';
  }
};

 

export const getMetrics = async (url: string) => {
  const status = await checkWebsiteStatus(url);
  const responseTime = await getResponseTime(url);
 

  const website = await prisma.website.create({
    data: {
      url,
      status,
      responseTime,
       
    },
  });

  return { status, responseTime, }  ;
};
