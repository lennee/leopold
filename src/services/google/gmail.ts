import { getOAuthClient, Scopes  } from './google_authorization'
import { gmail_v1, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { base64toUTF8 } from '../helpers'

/*
  Endpoints
*/
const listEmailLabels = async () =>
  (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.labels.list({
    userId: 'me'
  })
    .then(res => Promise.resolve(res.data))

const listEmails = async () =>
  await _listMessageIds()
    .then((response) => Promise.all(response.messages.map((message) =>
      getEmailById(message.id)
    )))

const getEmailById = async (id: string) =>
  (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.messages.get({
    userId: 'me',
    id
  })
    .then(res => Promise.resolve(mapGmailMessageToMessage(res.data)))

/*
  Helpers
*/
const _listMessageIds = async () =>
  (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.messages.list({
    // q: "query"
    // maxAmount: Num
    userId: 'me'
  })
    .then(res => Promise.resolve(res.data))

const _getAuthedGmailClient = async (scope: Scopes): Promise<gmail_v1.Gmail> => {
  const auth: OAuth2Client = await getOAuthClient(scope);

  return google.gmail({version: 'v1', auth});
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
  return body
}

export default {
  getEmailById,
  listEmails,
  listEmailLabels
}
