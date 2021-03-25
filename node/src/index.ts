import express = require('express');

import asana = require('./helpers/asana');
import slack = require('./helpers/slack');
import dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/api/todoList', (req, res) =>
  asana.fetchTodo()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

app.post('/api/sendMessage', (req, res) =>
  slack.sendMessage(req.body.message, 'SLACK_TESTING')
    .then((s) => {
      console.log(s.request._header);
      res.sendStatus(200);
    })
    .catch((e) => console.log(`There was an error when sending the message to slack.\nError: ${e.message}`)));

app.get('/api/sendToDoList', (req, res) =>
    asana.fetchTodo()
      .then((data) => slack.sendMessage(asana.formatToDoList(data), 'SLACK_TESTING'))
      .then(() => res.sendStatus(200))
      .catch((e) => res.status(500).send(e.message)));


const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
