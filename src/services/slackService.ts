import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(token);

export const sendSlackMessage = async (channel: string, text: string): Promise<boolean> => {
  try {
    // Send the message
    const result = await slackClient.chat.postMessage({
      channel,
      text,
    });
    console.log('Message sent: ', result.ts);
    return true;
  } catch (error: unknown) {
    console.error('Error sending Slack message:', error);
    if ((error as any).data) {
      console.error('Slack API Error: ', (error as any).data);
    }
    return false;
  }
};
