import { PrismaClient } from '@prisma/client';
import { WebClient } from '@slack/web-api';
import { sendSlackMessage } from '../../services/slackService';

const prisma = new PrismaClient();

export const resolvers = {
  Mutation: {
    registerSlack: async (_: any, { slackUserId, slackToken, slackChannelId }: { slackUserId: string, slackToken: string, slackChannelId: string }, { user }: { user: { id: string } }) => {
      try {
        // Save the Slack data to your database
        await prisma.user.update({
          where: { id: user.id },
          data: {
            slackUserId,
            slackToken,
            slackChannelId,
          },
        });

        return true;
      } catch (error) {
        console.error('Error during Slack registration process:', error);
        return false;
      }
    },
    sendSlackAlert: async (_: any, { userId, message }: { userId: string, message: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !user.slackToken || !user.slackChannelId) {
          throw new Error('User Slack data is missing');
        }

        const slackClient = new WebClient(user.slackToken);
        const result = await slackClient.chat.postMessage({
          channel: user.slackChannelId,
          text: message,
        });

        console.log('Message sent: ', result.ts);
        return true;
      } catch (error) {
        console.error('Error sending Slack message:', error);
        return false;
      }
    },
  },
  Query: {
    hello: async (_: any, __: any, { user }: { user: { id: string } }) => {
      const conditionMet = false; // Example condition
      if (!conditionMet) {
        const userId = user.id;
        const message = 'Automated message: Hello condition not met!';
        await sendSlackMessage(userId, message);
      }
      return 'Hello world!';
    },
  },
};
