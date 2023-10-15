
window.onload = function() {
  makeRequest("/api/guilds")
    .then(guilds => {
      renderGuilds(guilds)
    })
  makeRequest("/api/channels")
    .then(channels => {
      renderChannels(channels)
    })
  makeRequest("/api/@me")
    .then(data => {
      if (data.avatar) {
        document.querySelector("#avatarImage").src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=${CONFIG.image_resolution}`
      }

      document.querySelector("#profileTitle").innerHTML = data.username
      document.querySelector("#profileSubtitle").innerHTML = data.bio
    })
  makeRequest("/api/updates/all")
    .then(updates => {
      renderUpdateLogs(updates)
    })
}