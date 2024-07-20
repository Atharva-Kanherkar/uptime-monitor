import { PrismaClient } from '@prisma/client';
import { WebClient } from '@slack/web-api';
import { sendSlackMessage } from '../../services/slackService';
import { checkWebsiteStatus } from '../../utils/metrics';

const prisma = new PrismaClient();

export const slackResolvers = {
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
  }
};
