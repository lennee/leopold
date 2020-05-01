#!/usr/bin/env python
import json
from pprint import pprint

import pickle
from os.path import  abspath, dirname, exists, join
from googleapiclient.discovery import build

from Leopold.GCreds import getCreds

emails = json.loads(open(join(dirname(abspath(__file__)), 'data/emails.json')).read())

def get_labels(acct):

    creds = getCreds(acct, 'read_mail')

    service = build('gmail', 'v1', credentials=creds)

    # Call the Gmail API
    results = service.users().labels().list(userId='me').execute()
    pprint(results)
    labels = results.get('labels', [])

    if not labels:
        print('No labels found.')
    else:
        print('Labels:')
        for label in labels:
            print(label['name'])

def get_messageIds(acct, query):
    # If modifying these scopes, delete the file token.pickle.

    creds = getCreds(acct, 'read_mail')

    service = build('gmail', 'v1', credentials=creds)

    # Call the Gmail API
    results = service.users().messages().list(userId='me', q=query).execute()
    messages = results.get('messages', [])

    if not messages:
        print('\t\tNo labels found.')
        return False
    else:
        return [m['id'] for m in messages]


def reorganize(acct):
    creds = getCreds(acct, 'full_mail')

    service = build('gmail', 'v1', credentials=creds)

    for item in emails[acct]:
        messages = []
        for email in item['emails']:
            print('\t' + email)
            r = get_messageIds(acct, 'from:{}'.format(email))
            if r:
                messages += r
        body = {
            'ids': messages,
            'addLabelIds': item['addLabelIds'],
            'removeLabelIds': item['removeLabelIds']
        }

        try:
            res = service.users().messages().batchModify(userId='me', body=body).execute()
        except:
            pass
