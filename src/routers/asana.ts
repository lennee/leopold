import * as asana from '../services/asana'
import { Router } from 'express'

const asanaRouter = Router()

asanaRouter.get('/todoList', (req, res) =>
  asana.fetchTodo()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

export = asanaRouter