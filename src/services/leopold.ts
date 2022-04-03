import { Task } from "./asana";

export const formatToDoList = (todo: Task[]): string => {
  let message = '*Here is a quick "_ToDo List_" to talk about today:*\n\n';

  todo.forEach((task: Task) => {
    message += '\t• '
    if (task.assignee) message += `_(${task.assignee.name.split(' ')[0]})_ - `;
    message += `${task.name}\n`;
  });

  return message
}
