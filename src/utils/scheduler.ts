import { PrismaClient } from '@prisma/client';
import { WebClient } from '@slack/web-api';
import cron from 'node-cron';
import { checkWebsiteStatus } from './metrics';


const prisma = new PrismaClient();

export const notifyIfWebsiteDown = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        website: true,
      },
    });

    for (const user of users) {
      if (user.website) {
        const status = await checkWebsiteStatus(user.website.url);
        if (status !== 'Up') {
          if (user.slackToken && user.slackChannelId) {
            const slackClient = new WebClient(user.slackToken);
            const message = `Alert: Your website ${user.website.url} is down!`;

            const result = await slackClient.chat.postMessage({
              channel: user.slackChannelId,
              text: message,
            });

            console.log('Message sent: ', result.ts);
          } else {
            console.warn(`Slack data missing for user: ${user.id}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking website status or sending Slack message:', error);
  }
};

// Schedule the task to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Running scheduled task to check website status');
  notifyIfWebsiteDown();
});
