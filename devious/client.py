from database import Database
import requests
import discord
import os

class Client:
  def __init__(self, database_file: str):
    self.db: Database = Database(database_file)
    self.client: discord.Client = discord.Client()
    self.WebClient: requests.Session() = requests.Session()

    @self.client.event
    async def on_ready():
      print(f'Devious client started: {self.client.user}')

  def start(self, token_key: str):
    # self.client.run(os.environ[token_key])
    self.WebClient.headers = {'authorization': os.environ[token_key]}