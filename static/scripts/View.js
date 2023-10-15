function switchChannelView(id) {
  document.getElementById(currentChannel).classList.remove("selected-channel")
  currentChannel = id
  const newChannel = document.getElementById(id)
  newChannel.classList.add("selected-channel")
  window.history.pushState({}, null, `/channels/${id}`)
  
  renderChannelMeta(
    newChannel.children[1].innerHTML,
    newChannel.children[0].src
  )
  document.querySelector("#messagesContainer").innerHTML = ""
  makeRequest(`/api/channels/${currentChannel}/messages`)
    .then(messages => {
      renderMessages(messages)
    })
}

function switchGuildChannelView(id) {
  document.getElementById(currentGuildChannel).classList.remove("selected-channel")
  currentGuildChannel = id
  const newChannel = document.getElementById(id)
  renderGuildChannelMeta({
    name: newChannel.innerHTML,
    topic: newChannel.getAttribute("topic")
  })
  document.querySelector("#messagesContainer").innerHTML = ""
  makeRequest(`/api/channels/${currentGuildChannel}/messages`)
    .then(messages => {
      renderMessages(messages)
    })
  newChannel.classList.add("selected-channel")
  window.history.pushState({}, null, `/guilds/${currentGuild}/${currentGuildChannel}`)
}