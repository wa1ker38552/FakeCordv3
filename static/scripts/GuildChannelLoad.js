
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
      renderGuildChannels(guildChannels, fromSelf=true)
      document.getElementById(currentGuildChannel).classList.add("selected-channel")
      document.getElementById(currentGuildChannel).scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center"
      })
    })
  makeRequest(`/api/channels/${currentGuildChannel}/messages`)
    .then(messages => {
      PREVIOUS_MESSAGE = messages[0]
      renderMessages(messages)
    })

  const messagesContainer = document.querySelector("#messagesContainer")
  messagesContainer.addEventListener("scroll", function() {
    if (messagesContainer.scrollTop == 0) {
      let lastID = messagesContainer.children[0].id
      makeRequest(`/api/channels/${currentGuildChannel}/messages?cursor=${lastID}`)
        .then(messages => {
          let messageList = []
          messages.forEach(function(e) {
            messageList.push(renderMessage(e))
          })
          messageList.reverse()
          messageList.forEach(function(e) {
            messagesContainer.prepend(e)
          })
          document.getElementById(lastID).scrollIntoView()
        })
    }
  })
}