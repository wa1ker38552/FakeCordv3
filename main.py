from flask import render_template
from flask import redirect
from flask import request
from flask import Flask

from api import APISetup
from api import app
import devious

cli = devious.Client('database.json')
cli.start('TOKEN')
APISetup(cli)

@app.route('/')
def app_index():
  return render_template('index.html')

@app.route('/channels/<id>')
def app_channel(id):
  return render_template('channel.html', id=id)

@app.route('/guilds/<id>')
def app_guild(id):
  return render_template('guild.html', id=id)

@app.route('/guilds/<guild>/<channel>')
def app_guild_guild_channel(guild, channel):
  return render_template('guild_channel.html', guild_id=guild, channel_id=channel)

app.run(host='0.0.0.0', port=8080)