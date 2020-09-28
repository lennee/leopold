const axios = require('axios');
require('dotenv').config();

module.exports.fetchTodo = async () => {
  const tasks = await axios.get(`https://app.asana.com/api/1.0/tags/${process.env.CHECKIN_TAG_GID}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
      },
    });

  return Promise.all(tasks.data.data.map((task) => (
    axios.get(`https://app.asana.com/api/1.0/tasks/${task.gid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
        },
      }).then((res) => res.data.data)
  )));
};
