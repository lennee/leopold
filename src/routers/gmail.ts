import gmail from '../services/google/gmail'
import { Router } from 'express'

const gmailRouter = Router()

gmailRouter.get('/listEmailLabels', (req, res) =>
  gmail.listEmailLabels()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

gmailRouter.get('/getEmailById/:messageId', (req, res) =>
  gmail.getEmailById(req.params.messageId)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

gmailRouter.get('/listEmails', (req, res) =>
  gmail.listEmails()
    .then(data => res.status(200).json(data))
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)}
      ));

export default gmailRouter;