import a = require('axios');

const axios = a.default;

export const sendMessage = (message: string, channelName:string = "SLACK_GENERAL") => {
  console.log(message);
  return axios.get(
    `https://slack.com/api/chat.postMessage?channel=${process.env[channelName]}&text=${encodeURIComponent(message)}`, {
    headers: {
      "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  });
}

