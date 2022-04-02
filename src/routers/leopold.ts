import { Router } from 'express'
import * as asana from '../services/asana'
import * as slack from '../services/slack'
import * as leopold from '../services/leopold'

const leopoldRouter = Router()

leopoldRouter.get('/sendToDoList', (req, res) =>
    asana.fetchTodo()
      .then((data) => slack.sendMessage(leopold.formatToDoList(data), 'SLACK_TESTING'))
      .then(() => res.sendStatus(200))
      .catch((e) => res.status(500).send(e.message)));

export default leopoldRouter
