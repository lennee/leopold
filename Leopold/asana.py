import json
import requests

from os import getenv, path

from dotenv import load_dotenv

load_dotenv()

def todo_list():
    r = requests.get('https://app.asana.com/api/1.0/tags/{}/tasks'.format(getenv('CHECKIN_TAG_GID')), headers={
        'Authorization': 'Bearer ' + getenv('ASANA_TOKEN')
    })

    data = json.loads(r.text)['data']

    tasks = [{'name':tag['name'],'id':tag['gid']} for tag in data]
    slack_message = ""
    for task in tasks:
        r = requests.get('https://app.asana.com/api/1.0/tasks/{}'.format(task['id']), headers={
            'Authorization': 'Bearer ' + getenv('ASANA_TOKEN')
        })
        data = json.loads(r.text)['data']
        if 'assignee' in data.keys() and  data['assignee'] is not None:
            name = '(' + data['assignee']['name'].split(' ')[0] + ')'
            slack_message += '\t• _' + name + '_ - ' + task['name'] + '\n'
        else:
            slack_message += '\t• ' + task['name'] + '\n'

    return slack_message
