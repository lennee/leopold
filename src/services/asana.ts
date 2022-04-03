import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// const axios = a.default;

const TASKS_LIST_URL = `https://app.asana.com/api/1.0/tags/${process.env.CHECKIN_TAG_GID}/tasks`;
const TASKS_BASE_URL = 'https://app.asana.com/api/1.0/tasks/'


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
  const tasks = await _fetchTaskList()

  // Fetch data for each Tag
  return Promise.all(tasks.map((taskId: TaskId) => _fetchTaskById(taskId)))
};


const _fetchTaskList = async (): Promise<TaskId[]> => {
  const res = await axios.get(TASKS_LIST_URL,
    {
      headers: {
        Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
      },
    })
    return res.data.data
}

const _fetchTaskById = async (taskId: TaskId): Promise<Task> =>
  axios.get(TASKS_BASE_URL + taskId.gid,
  {
    headers: {
      Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
    },
  })
  .then((res) => res.data.data)
