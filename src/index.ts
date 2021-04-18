import express from "express";

import * as asana from "./helpers/asana";
import { sendMessage } from "./helpers/slack";
import { formatToDoList } from "./helpers/messages"
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get('/api/todoList', (req, res) =>
  asana.fetchTodo()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

app.post('/api/sendMessage', (req, res) =>
  sendMessage(req.body.message, 'SLACK_TESTING')
    .then((s) => {
      console.log(s.request._header);
      res.sendStatus(200);
    })
    .catch((e) => console.log(`There was an error when sending the message to slack.\nError: ${e.message}`)));

app.get('/api/sendToDoList', (req, res) =>
    asana.fetchTodo()
      .then((data) => sendMessage(formatToDoList(data), 'SLACK_TESTING'))
      .then(() => res.status(200).send("Hello!"))
      .catch((e) => res.status(500).send(e.message)));


const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
