from flask import render_template
from database import Database
from flask import request
from flask import Flask
import requests
import json

db = Database('database.json')
app = Flask(__name__)

def APISetup(cli):
  global client
  client = cli

@app.route('/api/configs/all')
def api_configs_all():
  return db.get_key('config')

@app.route('/api/updates/all')
def api_updates_all():
  return db.get_key('updates')[::-1]

@app.route('/api/guilds')
def api_guilds():
  if not db.get_key('guilds'):
    db.set_key('guilds', client.WebClient.get('https://discord.com/api/v9/users/@me/guilds').json())
  return db.get_key('guilds')

@app.route('/api/guilds/<id>/channels')
def api_guilds_channels(id):
  if id not  in db.get_key('guild_channels'):
    db.set_key(['guild_channels', id], client.WebClient.get(f'https://discord.com/api/v9/guilds/{id}/channels').json())
  return db.get_key(['guild_channels', id])

@app.route('/api/channels')
def api_channels():
  if not db.get_key('channels'):
    channels = client.WebClient.get('https://discord.com/api/v9/users/@me/channels').json()

    for i, c in enumerate(channels):
      if c['last_message_id'] is None: channels[i]['last_message_id'] = 0
  
    for _ in range(len(channels)):
      for b in range(len(channels)-1):
        if int(channels[b]['last_message_id']) < int(channels[b+1]['last_message_id']):
          save = channels[b+1]
          channels[b+1] = channels[b]
          channels[b] = save

    db.set_key('channels', channels)

  return db.get_key('channels')

@app.route('/api/@me')
def api_me():
  # response not cached because this changes quite often
  return client.WebClient.get('https://discord.com/api/v9/users/@me').json()

@app.route('/api/channels/<id>/messages')
def api_channels_messages(id):
  if request.args.get('cursor'):
    return client.WebClient.get(f'https://discord.com/api/v9/channels/{id}/messages?limit=50&before={request.args.get("cursor")}').json()[::-1]
  return client.WebClient.get(f'https://discord.com/api/v9/channels/{id}/messages?limit=50').json()[::-1]

@app.route('/api/traceback')
def api_traceback():
  return json.loads(request.args.get('data'))