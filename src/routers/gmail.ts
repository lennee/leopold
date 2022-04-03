import gmail from '../services/google/gmail'
import { Router } from 'express'
import Joi from 'joi'

const gmailRouter = Router()

gmailRouter.get('/listEmailLabels', (req, res) =>
  gmail.listEmailLabels()
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

gmailRouter.get('/getEmailById/:messageId', (req, res) =>
  gmail.getEmailById(req.params.messageId)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500)));

const listEmailByQuerySchema = Joi.object({
  query: Joi.string().empty("").default(""),
  maxResults: Joi.number().default(10)
})

interface ListEmailByQueryRequest{
  query: string,
  maxResults: number
}

gmailRouter.get('/listEmailsByQuery', (req, res) =>{
  listEmailByQuerySchema.validateAsync(req.body)
    .then((body: ListEmailByQueryRequest) => gmail.listEmails(body.query, body.maxResults))
    .then(data => res.status(200).json(data))
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    });
})

const listEmailsParams = Joi.object({
  unread: Joi.boolean(),
  read: Joi.boolean(),
  starred: Joi.boolean(),
  stringMatch: Joi.boolean(),
  maxResults: Joi.number().default(10)
})

interface ListEmailRequest{
  unread: boolean,
  read: boolean,
  starred: boolean,
  stringMatch: string,
  maxResults: number
}

gmailRouter.get('/listEmails', (req, res) =>{
  listEmailsParams.validateAsync(req.body)
    .then((body: ListEmailRequest) => gmail.listEmails(buildQueryFromListEmailRequest(body), body.maxResults))
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500));
})


const buildQueryFromListEmailRequest = ({stringMatch, unread, read, starred }: ListEmailRequest) =>
  `${vob(stringMatch, stringMatch)} ${vob(unread, "is:unread")} ${vob(read, "is:read")} ${vob(starred, "is:starred")}`

// Value or Blank helper
const vob = (item: any, value: string) => (item) ? value : ""

export default gmailRouter;
