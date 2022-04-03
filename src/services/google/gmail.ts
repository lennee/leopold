import { getOAuthClient, Scopes  } from './google_authorization'
import { gmail_v1, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { base64toUTF8 } from '../utils'

/*
  Endpoints
*/
const listEmailLabels = async () =>
  (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.labels.list({
    userId: 'me'
  })
    .then(res => Promise.resolve(res.data))

const listEmails = async  (q: string, maxResults: number, labelNames: string[]): Promise<Message[]> => {
  let labelIds: string[] = []
  if (labelNames.length > 0) {
    labelIds = await _mapLabelNameToId(labelNames)
  }
  return await _listMessageIds(q, maxResults, labelIds)
    .then((response) =>
      Promise.all(response.messages.map((message) => getEmailById(message.id))))
}

const getEmailById = async (id: string): Promise<Message> =>
  (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.messages.get({
    userId: 'me',
    id
  })
    .then(async res => Promise.resolve(mapGmailMessageToMessage(res.data)))

/*
  Helpers
*/
const _listMessageIds = async (q: string, maxResults: number, labelIds: string[]) => {
  return (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.messages.list({
    userId: 'me',
    q,
    maxResults,
    labelIds
  })
    .then(res => Promise.resolve(res.data))
}

const _getAuthedGmailClient = async (scope: Scopes): Promise<gmail_v1.Gmail> => {
  const auth: OAuth2Client = await getOAuthClient(scope);

  return google.gmail({version: 'v1', auth});
}

const _mapLabelNameToId = async (lableNames: string[]) => {
  const labels = await (await listEmailLabels()).labels
  return Promise.all(lableNames.map(labelName => labels.find(l => l.name === labelName).id))
}

/*
  Mappers
*/

interface Message {
  id: string,
  threadId: string,
  labels: string[]
  snippet: string
  to: string
  from: string
  subject: string
  date: string
  body: string
}

const mapGmailMessageToMessage = (message: gmail_v1.Schema$Message): Message =>  ({
    id: message.id,
    threadId: message.threadId,
    labels: message.labelIds,
    snippet: message.snippet,
    to: message.payload.headers.find(h => h.name === "To").value,
    from: message.payload.headers.find(h => h.name === "From").value,
    subject: message.payload.headers.find(h => h.name === "Subject").value,
    date: message.payload.headers.find(h => h.name === "Date").value,
    body: parseBody(message)
  })

const parseBody = (message: gmail_v1.Schema$Message): string => {
  if (!message.payload.parts) return ""
  let body = ""

  message.payload.parts.forEach((pt) => {
    if (pt.body.data) {
      body += base64toUTF8(pt.body.data, false)
    }
  })
  if (body === "" && message.payload.body.data) {
    body += base64toUTF8(message.payload.body.data, false)
  }
  return body
}

export default {
  getEmailById,
  listEmails,
  listEmailLabels
}
