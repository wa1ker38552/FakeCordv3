
window.onload = function() {
  makeRequest("/api/guilds")
    .then(guilds => {
      renderGuilds(guilds)
    })
  makeRequest("/api/channels")
    .then(channels => {
      renderChannels(channels, channel=currentChannel, fromSelf=true)
      document.getElementById(currentChannel).scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center"
      })
    })
  makeRequest("/api/@me")
    .then(data => {
      if (data.avatar) {
        document.querySelector("#avatarImage").src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=${CONFIG.image_resolution}`
      }

      document.querySelector("#profileTitle").innerHTML = data.username
      document.querySelector("#profileSubtitle").innerHTML = data.bio
    })
  makeRequest(`/api/channels/${currentChannel}/messages`)
    .then(messages => {
      PREVIOUS_MESSAGE = messages[0]
      renderMessages(messages)
    })

  const messagesContainer = document.querySelector("#messagesContainer")
  messagesContainer.addEventListener("scroll", function() {
    if (messagesContainer.scrollTop == 0) {
      let lastID = messagesContainer.children[0].id
      makeRequest(`/api/channels/${currentChannel}/messages?cursor=${lastID}`)
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