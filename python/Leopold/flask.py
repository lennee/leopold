import os
import json
import datetime

from Leopold import Leopold
from flask import Flask, request

app = Flask(__name__)

def challengeCheck(data):
    return_challenge = {
      'challenge': data
    }
    return app.response_class(
        response=json.dumps(return_challenge),
        status=200,
        mimetype='application/json'
    )

def shouldRespond(event):
  if '<@UM8ELE56D>' not in event['text']:
    return False
  return True

def validate(request):
    body = json.loads(request.data)
    try:
        body['challenge']
        return True
    except KeyError:
        d = datetime.datetime.today()
        d = datetime.date(d.year, d.month, d.day)
        events = open('./Leopold/events.txt').read().split('\n')
        head = datetime.datetime.strptime(events[0], '%Y-%m-%d')
        head = datetime.date(head.year, head.month, head.day)
        print(d == head)
        if d == head:
            if body['event_id'] not in events:
                open('./Leopold/events.txt', 'a').write('{}\n'.format(body['event_id']))
                return True
            else:
                return False
        else:
            open('./Leopold/events.txt', 'w+').write('{}\n{}\n'.format(d, body['event_id']))
            return True

@app.route("/")
def hello(**payload):
  return "Hello World!"

@app.route("/slack", methods = ['POST'])
def slack():
    if validate(request):
        challenge = L.processRequest(request)
        if challenge is not None:
            return challengeCheck(challenge)

    return app.response_class(
            status=200,
        )


if __name__ == "__main__":
  app.run()
