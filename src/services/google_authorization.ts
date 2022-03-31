import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'
import { exists } from './helpers'

export const CREDENTIALS_PATH = './src/credentials/credentials.json'
export const TOKEN_PATH = './src/credentials/token.json'

export const SCOPES = {
  'read_cal': ['https://www.googleapis.com/auth/calendar.readonly'],
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

function getAccessToken(oAuth2Client: OAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.read_cal,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err: Error, token: Credentials) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
        if (err) return console.error(err2);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

export const getAuthClient = async (): Promise<OAuth2Client>  => {
  // Load Credentials from file (throw error if creds don't exist)
  let credentials: Creds
  try {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString())
  } catch (e: any) {
    throw Error(`No credentials files, ${e.message}`)
  }

  // Create OAPI Client
  const {client_secret, client_id, redirect_uris} = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check for token create/update as needed
  const tokenExists = exists(TOKEN_PATH)
  if (!tokenExists) await getAccessToken(oAuth2Client)

  const token: Credentials = JSON.parse(fs.readFileSync(TOKEN_PATH).toString())
  await oAuth2Client.setCredentials(token)

  return oAuth2Client
}
