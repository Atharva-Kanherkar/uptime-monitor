import { sendSlackMessage } from '../../services/slackService';

export const slacResolvers = {
  Mutation: {
    sendSlackAlert: async (_: any, { channel, message }: { channel: string; message: string }) => {
      try {
        await sendSlackMessage(channel, message);
        return true;
      } catch (error) {
        console.error('Error sending Slack alert:', error);
        return false;
      }
    },
  },
};