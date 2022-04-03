import { getOAuthClient, Scopes  } from './google_authorization'
import { gmail_v1, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'


const listEmailLabels = async () => {
  return (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.labels.list({
    userId: 'me'
  })
    .then(res => Promise.resolve(res.data))
}

const listMessageIds = async () => {
  return (await _getAuthedGmailClient(Scopes.READ_MAIL)).users.messages.list({
    userId: 'me'
  })
    .then(res => Promise.resolve(res.data))
}

const _getAuthedGmailClient = async (scope: Scopes): Promise<gmail_v1.Gmail> => {
  const auth: OAuth2Client = await getOAuthClient(scope);

  return google.gmail({version: 'v1', auth});
}

export default {
  listMessageIds,
  listEmailLabels
}
