#!/usr/bin/env python
import requests
import datetime

from os import getenv, path
from dotenv import load_dotenv

from Leopold import gcal

load_dotenv()

def day(n):
    m = n.strftime("%B")
    y = n.strftime("%Y")
    d = int(n.strftime("%d"))
    if d in [1, 21, 31]:
        v = 'st'
    elif d in [2, 22]:
        v = 'nd'
    elif d in [3, 23]:
        v = 'rd'
    else:
        v = 'th'

    return '{} {}{}, {}'.format(m,d,v,y)

def send_message(message, channel_name="SLACK_GENERAL"):

    if getenv('STATUS') == 'PRODUCTION':
        channel_name = 'SLACK_GENERAL'

    channel = getenv(channel_name)
    r = requests.post(
        'https://slack.com/api/chat.postMessage',
        data={
            'channel': channel,
            'text': message
        },
        headers={
            'Authorization': 'Bearer {}'.format(getenv('SLACK_BOT_TOKEN'))
        })

def next_rehearsal(**kwargs):
    reh = gcal.get_rehearsal(**kwargs)
    name = reh['name'].split('@ ')[1]
    maps = 'https://www.google.com/maps/place/{}'.format(reh['location'].replace(' ', '+'))
    return {
        'header': '*Rehearsal is at <{}|*{}*> this week!*'.format(maps, name),
        'body':'><{}|*{}*>\n>{} at <{}|{}>'.format(reh['link'], reh['name'], day(reh['date']), maps, reh['location'])
    }

def next_show():
    show = gcal.get_shows()
    if show:
        return {
            'header': '*Next Show: <{}|*{}*>*'.format(show['link'], show['name']),
            'body': '><{}|*{}*>\n>on {}'.format(show['link'], show['name'], day(show['date']))
        }
    else:
        return None

def _introduce():
    return send_message('Hi all, I\'m Leopold. Your friendly neigborhood lion! I\'m so excited to get started...\nI don\'t do jack shit yet but I\'m gonna make it so Tristan doesn\'t have to update the rehearsal calendar once a month cuz he\'s a lazy sack of garbage')
