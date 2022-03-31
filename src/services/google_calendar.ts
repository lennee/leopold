import fs from 'fs';
import { execute, Creds, CREDENTIALS_PATH  } from './google_authorization'
import { google } from 'googleapis'


const _listEvents = (auth: any) =>
  new Promise((resolve, reject) => {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'calendarId',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, data) => {
      if (err) reject(err)
      resolve(data.data)
    })
  })

export const listEvents = () => {
    const data = fs.readFileSync(CREDENTIALS_PATH)
    const creds: Creds = JSON.parse(data.toString())
    return execute(creds, _listEvents)
  }
