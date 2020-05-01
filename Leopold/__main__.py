import sys
from datetime import datetime
from os import getenv, path
from dotenv import load_dotenv

from Leopold import gcal, asana
from Leopold.slack import next_rehearsal, send_message, next_show

load_dotenv()

def reh_message(test=False):
    ch = 'SLACK_TESTING' if test else 'SLACK_GENERAL'
    reh = next_rehearsal()
    send_message('{}\n{}'.format(reh['header'], reh['body']), channel_name=ch)

def todo_list(test=False):
    ch = 'SLACK_TESTING' if test else 'SLACK_GENERAL'
    send_message('*Here is a quick "_ToDo List_" to talk about today:*\n\n{}'.format(asana.todo_list()), channel_name=ch)

def main():
    args = sys.argv[1:]

    test = False
    if '--version' in args or '-v' in args:
        print('\nLeopold:\n  Version: 0.1.0')
        return

    if '--test' in args:
        test=True

    if '--next-rehearsal' in args or '-nr' in args:
        reh_message(test)
        return

    if '--to-do' in args or '-td' in args:
        todo_list(test)
        return


if __name__ == '__main__':
    main(sys.argv[1:])
