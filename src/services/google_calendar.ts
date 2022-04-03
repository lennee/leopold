import { getOAuthClient, Scopes  } from './google_authorization'
import { calendar_v3, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

const listEvents = async (calendarId: string): Promise<calendar_v3.Schema$Event[]> => {
  return (await _getAuthedCalendarClient(Scopes.FULL_CALENDAR)).events.list({
    calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  })
    .then(data => Promise.resolve(data.data.items))
}

const createEvent = async (calendarId: string, event: calendar_v3.Schema$Event) => {
  return (await _getAuthedCalendarClient(Scopes.FULL_CALENDAR)).events.insert({
    calendarId,
    requestBody: event,
  })
}

const _getAuthedCalendarClient = async (scope: Scopes): Promise<calendar_v3.Calendar> => {
  const auth: OAuth2Client = await getOAuthClient(scope);

  return google.calendar({version: 'v3', auth});
}

export default {
  listEvents,
  createEvent
}
