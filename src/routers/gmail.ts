import gmail from '../services/google/gmail'
import { Router } from 'express'
import Joi from 'joi'
import { EMAIL_REGEX } from '../services/utils'

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
  maxResults: Joi.number().default(10),
  labelNames: Joi.array().items(Joi.string()).default([])
})

interface ListEmailByQueryRequest{
  query: string,
  maxResults: number,
  labelNames: string[]
}

gmailRouter.get('/listEmailsByQuery', (req, res) =>{
  listEmailByQuerySchema.validateAsync(req.body)
    .then((body: ListEmailByQueryRequest) => gmail.listEmails(body.query, body.maxResults, body.labelNames))
    .then(data => res.status(200).json(data))
    .catch((err) => res.sendStatus(500)
  );
})

const listEmailsParams = Joi.object({
  unread: Joi.boolean(),
  read: Joi.boolean(),
  starred: Joi.boolean(),
  labelNames: Joi.array().items(Joi.string()).default([]),
  from: Joi.array().items(Joi.string().pattern(EMAIL_REGEX, { name: "emails" })).default([]),
  stringMatch: Joi.boolean(),
  maxResults: Joi.number().default(10)
})

interface ListEmailRequest{
  unread: boolean,
  read: boolean,
  starred: boolean,
  labelNames: string[],
  from: string[],
  stringMatch: string,
  maxResults: number
}

gmailRouter.get('/listEmails', (req, res) =>{
  listEmailsParams.validateAsync(req.body)
    .catch((err) => res.status(400).send(err.details))
    .then((body: ListEmailRequest) => gmail.listEmails(buildQueryFromListEmailRequest(body), body.maxResults, body.labelNames))
    .then(data => res.status(200).json(data))
    .catch((err) =>res.sendStatus(500));
})


const buildQueryFromListEmailRequest = ({stringMatch, unread, read, starred, from}: ListEmailRequest) =>
  `${vob(stringMatch, stringMatch)} ${vob(unread, "is:unread")} ${vob(read, "is:read")} ${vob(starred, "is:starred")} ${vob(from[0], from.map(a => `from:${a}`).join(' '))} `.trim()

// Value or Blank helper
const vob = (item: any, value: string) => (item) ? value : ""

export default gmailRouter;
