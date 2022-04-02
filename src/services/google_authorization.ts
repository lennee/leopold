import fs from 'fs'
import readline from 'readline'
import axios from 'axios'
import { google } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'
import { exists, question } from './helpers'

export const CREDENTIALS_PATH = './src/credentials/credentials.json'
export const tokenPath = (scopeName: Scopes) => `./src/credentials/token_${scopeName}.json`

export enum Scopes {
  READ_CALENDAR = 'read_cal',
  READ_MAIL = 'read_mail',
  FULL_CALENDAR = 'full_cal',
  FULL_MAIL = 'full_mail'
}

const SCOPES_MAP = {
  read_cal: ['https://www.googleapis.com/auth/calendar.readonly'],
  full_cal: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
  read_mail: ['https://www.googleapis.com/auth/gmail.readonly'],
  full_mail: ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.labels','https://www.googleapis.com/auth/gmail.readonly' ],
}

export interface Creds {
  installed: {
    auth_uri: string,
    auth_provider_x509_cert_url: string
    client_id: string,
    client_secret: string,
    project_id: string
    redirect_uris: [string]
    token_uri: string
  }
}

export const getOAuthClient = async (scopeName: Scopes): Promise<OAuth2Client> => {
  // Create OAPI Client
  const credentials = _loadAuthCreds();
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Load tokens (either from file or create them)
  let token: Credentials
  if (!exists(tokenPath(scopeName))) {
    token = await _createToken(oAuth2Client, scopeName)
  } else {
    token = _loadToken(scopeName)
  }
  await oAuth2Client.setCredentials(token)

  return oAuth2Client
}

const _createToken = async (oAuth2Client: OAuth2Client, scopeName: Scopes) => new Promise(async (resolve, reject) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES_MAP[scopeName]
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const code: string = await question('Please input the token to this line: ');
  oAuth2Client.getToken(code)
    .then((res) => {
      fs.writeFileSync(tokenPath(scopeName), JSON.stringify(res.tokens))
      resolve(res.tokens)
    })
    .catch((err) => reject)
  })

const _loadAuthCreds = (): Creds => {
  try {
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString())
  } catch (e: any) {
    throw Error(`No credentials files, ${e.message}`)
  }
}

// Reads token from file name (according to needed token scope)
const _loadToken = (scopeName: Scopes): Credentials => JSON.parse(fs.readFileSync(tokenPath(scopeName)).toString())
