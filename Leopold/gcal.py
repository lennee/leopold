#!/usr/bin/env python
import pickle

from os import getenv, path
from datetime import datetime, timedelta, date

from dotenv import load_dotenv
from googleapiclient.discovery import build

from Leopold.GCreds import getCreds

load_dotenv()
reh = [

    '''
        Rehearsal Locations

        [
            location_name,
            location_address
        ]
    '''
]
nextWeds = lambda date: date + timedelta(days=(2-date.weekday()+7)%7)

def get_events(calendar, timeMax):
    creds = getCreds('uproar', 'read_cal')
    service = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API
    now = datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    if timeMax == 'week':
        timeMax = (datetime.now() + timedelta(days=7)).isoformat() + 'Z'
        events_result = service.events().list(calendarId=calendar, timeMin=now,
                                            timeMax=timeMax, maxResults=3,
                                            singleEvents=True, orderBy='startTime').execute()
        return events_result.get('items', [])
    else:
        events_result = service.events().list(calendarId=calendar, timeMin=now,
                                            maxResults=3, singleEvents=True,
                                            orderBy='startTime').execute()
        return events_result.get('items', [])

def _add_event(name, start, length, creds, calendar, **kwargs):

    end = start + timedelta(**length)
    event = {
        'summary': name
    }
    if 'all_day' in kwargs:
        event['start'] = {'date': start.strftime("%Y-%m-%d"), 'timeZone': 'America/New_York',},
        event['end'] = {'date': end.strftime("%Y-%m-%d"), 'timeZone': 'America/New_York',},
    else:
        event['start'] = {'date': start.isoformat() + 'Z', 'timeZone': 'America/New_York',},
        event['end'] = {'date': end.isoformat() + 'Z', 'timeZone': 'America/New_York',},

    for key, val in kwargs.items():
        event[key] = val

    if isinstance(creds, tuple):
        creds = getCreds(*creds)
    service = build('calendar', 'v3', credentials=creds)
    service.events().insert(calendarId=calendar, body=event).execute()

def add_rehearsals(d):
    new = 0
    while True:
        if new == 2:
            break
        for loc in reh:
            next = nextWeds(date(d.year, d.month, d.day))
            if d == next:
                d = nextWeds(date(d.year, d.month, d.day + 1))
            else:
                d = next
            args = ['Rehearsal @' + loc['name'], d, {'days': 0, 'hours':0}, ('uproar', 'full_cal'), getenv('REHEARSAL_CAL'),]
            kwargs = {'all_day': True, 'location': loc['location']}
            _add_event(*args, **kwargs)
        new += 1

def get_rehearsal(time=None):
    events = get_events(getenv('REHEARSAL_CAL'), time)
    if len(events) > 0:
        return {
            'name': events[0]['summary'],
            'date': datetime.strptime(events[0]['start']['date'], '%Y-%m-%d'),
            'location': events[0]['location'],
            'link': events[0]['htmlLink']
        }
    else:
        print('Adding New Rehearsals')
        add_rehearsals(datetime.today())
        return get_rehearsal()

def get_shows(time=None):
    events = get_events(getenv('SHOW_CAL'), time)
    if events:
        return {
            'name': events[0]['summary'],
            'date': datetime.strptime(events[0]['start']['dateTime'].split('T')[0], '%Y-%m-%d'),
            'link': events[0]['htmlLink']
        }
    else:
        return False


if __name__ == '__main__':
    print(get_rehearsal())
