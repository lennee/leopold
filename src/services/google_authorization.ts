import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'

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

 export const execute = async (credentials: Creds, callback: (arg0: any) => void) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  const token = fs.readFileSync(TOKEN_PATH)
  oAuth2Client.setCredentials(JSON.parse(token.toString()));
  return callback(oAuth2Client);
}

async function getAccessToken(oAuth2Client: OAuth2Client, callback: (arg0: any) => any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.read_cal,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  await rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err: Error, token: Credentials) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2: Error) => {
        if (err2) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
  return callback(oAuth2Client);
}



