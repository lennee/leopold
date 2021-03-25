import axios from "axios";

export const sendMessage = (message: string, channelName:string = "SLACK_GENERAL") => axios.get(
    `https://slack.com/api/chat.postMessage?channel=${process.env[channelName]}&text=${encodeURIComponent(message)}`, {
    headers: {
      "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  });
