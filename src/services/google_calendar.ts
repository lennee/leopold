import { getAuthClient  } from './google_authorization'
import { calendar_v3, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import Schema$Event = calendar_v3.Schema$Event



export const listEvents = async (calendarId: string): Promise<Schema$Event[]> => {

  const auth: OAuth2Client = await getAuthClient()

  const calendar = google.calendar({version: 'v3', auth});

  return new Promise((resolve, reject) => {
    calendar.events.list({
      calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, data) => {
      if (err) reject(err)
      resolve(data.data.items)
    })
  })
}