import * as slack from '../services/slack'
import { Router } from 'express'

const slackRouter = Router()

slackRouter.post('/sendMessage', (req, res) =>
  slack.sendMessage(req.body.message, 'SLACK_TESTING')
    .then((s) => {
      console.log(s.request._header);
      res.sendStatus(200);
    })
    .catch((e) => console.log(`There was an error when sending the message to slack.\nError: ${e.message}`)));

export = slackRouter