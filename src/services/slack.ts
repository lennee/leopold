import axios, { AxiosResponse } from "axios";

export const sendMessage = (message: string, channelName: string = "SLACK_GENERAL"): Promise<AxiosResponse<any, any>>  =>
  axios.get(
    `https://slack.com/api/chat.postMessage?channel=${process.env[channelName]}&text=${encodeURIComponent(message)}`, {
    headers: {
      "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  });
