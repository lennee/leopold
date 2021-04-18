import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// const axios = a.default;

interface TaskId {
  gid: string,
  name: string,
  resource_type: string,
}

interface Assignee {
  gid: string,
  name: string,
}

export interface Task {
  gid: string,
  name: string,
  assignee: Assignee,
}

export const fetchTodo = async (): Promise<Task[]> => {
  // Get task id list
  const tasks = await axios.get(`https://app.asana.com/api/1.0/tags/${process.env.CHECKIN_TAG_GID}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
      },
    });
  // Fetch data for each Tag
  return Promise.all(tasks.data.data.map((task: TaskId) => (
    axios.get(`https://app.asana.com/api/1.0/tasks/${task.gid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
        },
      })
      .then((res) => res.data.data)
  )));
};