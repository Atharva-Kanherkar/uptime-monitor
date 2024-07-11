  // src/graphql/resolvers/metricsResolver.ts
  import { PrismaClient } from '@prisma/client';
  import { getMetrics } from '../../utils/metrics';
  import { sendEmail } from '../../utils/email';
  
  const prisma = new PrismaClient();
  
  export const emailResolvers = {
    Mutation: {
       emailSendIfDown :  async (_: any, { url, userId }: { url: string, userId: string }) => {
        const metrics = await getMetrics(url);
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('No such user found');
        }
        if(metrics.status !== "Up"){
          await sendEmail(user.email, 'Website is down', `Your website ${url} is down`);
        return 'Email sent';
    }
    else{
        return "Website is up";
    }
},
    }
}
  