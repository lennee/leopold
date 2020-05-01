#!/usr/bin/env python
import pickle
import os
from os.path import  abspath, dirname, join, isfile

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow


creds_folder = join(dirname(abspath(__file__)), 'creds')
gProject_creds = join(creds_folder, 'creds.json')


# If modifying these scopes, delete the file token.pickle.
SCOPES = {
    'read_cal': ['https://www.googleapis.com/auth/calendar.readonly'],
    'full_cal': ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
    'read_mail': ['https://www.googleapis.com/auth/gmail.readonly'],
    'full_mail': ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.labels','https://www.googleapis.com/auth/gmail.readonly' ],
}

def getCreds(user, scope):
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    token_file = join(creds_folder, '{}_{}_token.pickle'.format(user, scope))

    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if isfile(token_file):
        with open(token_file, 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                gProject_creds, SCOPES[scope])
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(token_file, 'wb') as token:
            pickle.dump(creds, token)

    return creds
