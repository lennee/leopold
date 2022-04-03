import gmail from '../services/gmail'
import { Router } from 'express'

const gmailRouter = Router()

gmailRouter.get('/listEmailLabels', (req, res) =>
  gmail.listEmailLabels()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

gmailRouter.get('/listAllEmails', (req, res) =>
  gmail.listMessageIds()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

export default gmailRouter;
