import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(token);

export const sendSlackMessage = async (channel: string, text: string) => {
  try {
    await slackClient.chat.postMessage({
      channel,
      text,
    });
  } catch (error) {
    console.error('Error sending Slack message:', error);
  }
};
