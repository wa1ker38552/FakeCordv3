
window.onload = function() {
  makeRequest("/api/guilds")
    .then(guilds => {
      renderGuilds(guilds, guild=currentGuild)
    })
  makeRequest("/api/@me")
    .then(data => {
      if (data.avatar) {
        document.querySelector("#avatarImage").src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=${CONFIG.image_resolution}`
      }

      document.querySelector("#profileTitle").innerHTML = data.username
      document.querySelector("#profileSubtitle").innerHTML = data.bio
    })
  makeRequest(`/api/guilds/${currentGuild}/channels`)
    .then(guildChannels => {
      renderGuildChannels(guildChannels)
    })
}