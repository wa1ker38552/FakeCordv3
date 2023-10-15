function renderGuilds(guilds, guild=null, fromSelf=false) {
  const parent = document.querySelector("#bottomPanel")
  guilds.forEach(function(e) {
    const guildButton = document.createElement("div")
    const guildIcon = document.createElement("div")
    const guildImg = document.createElement("img")
    const guildTooltip = document.createElement("div")

    if (fromSelf) {
      guildButton.onclick = function() {switchGuildView(e.id)}
    } else {
      guildButton.onclick = function() {window.location.href = "/guilds/"+e.id}
    }

    guildButton.className = "guild"
    guildIcon.className = "guild-icon"
    guildTooltip.className = "tooltip"

    let guildIconStr = ""
    if (CONFIG.proxy_images) {
      
    } else {
      if (e.icon) {
        guildIconStr = `https://cdn.discordapp.com/icons/${e.id}/${e.icon}.png?size=${CONFIG.image_resolution}`
      } else {
        guildIconStr = DEFAULT_AVATAR
      }
    }

    guildImg.src = guildIconStr
    guildTooltip.innerHTML = e.name

    if (guild && guild == `${e.id}`) {
      renderGuildMeta(guildIconStr, e.name)
    }

    guildIcon.append(guildImg)
    guildButton.append(guildIcon, guildTooltip)
    parent.append(guildButton)
  })
}

function renderGuildMeta(guildIcon, guildName) {
  document.title = "FakeCord | "+guildName
  try {document.querySelector("#channelIcon").src = guildIcon} catch (Exception) {} // guild_channel doesn't render this
  document.querySelector("#channelName").innerHTML = guildName
}

function renderChannels(channels, channel=null, fromSelf=false) {
  const parent = document.querySelector("#sidePanel")
  channels.forEach(function(e) {
    const channelButton = document.createElement("div")
    const channelImg = document.createElement("img")
    const channelName = document.createElement("div")

    channelButton.id = e.id
    if (fromSelf) {
      channelButton.onclick = function() {switchChannelView(e.id)}
    } else {
      channelButton.onclick = function() {window.location.href = `/channels/${e.id}`}
    }
    channelButton.className = "channel centered-vertically"
    channelName.className = "channel-name"

    let channelIconStr, channelNameStr
    if (e.recipients[0]) {
      if (e.recipients.length > 1) {
        if (e.icon) {
          channelIconStr = `https://cdn.discordapp.com/channel-icons/${e.id}/${e.icon}.png?size=${CONFIG.image_resolution}`
        } else {
          channelIconStr = DEFAULT_AVATAR
        }
        
        if (e.name) {
          channelNameStr = e.name
        } else {
          channelNameStr = ""
          e.recipients.forEach(function(r) {
            channelNameStr += ((r.global_name) ? r.global_name : r.username) + " "
          })
        }
      } else {
        if (e.recipients[0].avatar) {
          channelIconStr = `https://cdn.discordapp.com/avatars/${e.recipients[0].id}/${e.recipients[0].avatar}?size=${CONFIG.image_resolution}`
        } else {
          channelIconStr = DEFAULT_AVATAR
        }
        channelNameStr = (e.recipients[0].global_name) ? e.recipients[0].global_name : e.recipients[0].username
      }
    } else {
      channelIconStr = DEFAULT_AVATAR
      channelNameStr = "Unknown Channel"
    }

    channelImg.src = channelIconStr
    channelName.innerHTML = channelNameStr

    if (channel && channel == `${e.id}`) {
      renderChannelMeta(channelNameStr, channelIconStr, channelButton)
    }

    channelButton.append(channelImg, channelName)
    parent.append(channelButton)
  })
}

function renderChannelMeta(channelName, channelIcon, fromRender=null) {
  document.title = "FakeCord | "+channelName
  document.querySelector("#channelIcon").src = channelIcon
  document.querySelector("#channelName").innerHTML = channelName
  document.querySelector("#channelInput").placeholder = `Message ${channelName}`
  if (fromRender) {fromRender.classList.add("selected-channel")}
  
  if (channelName == "Unknown Channel") {
    document.querySelector("#channelInput").style.cursor = "not-allowed"
    document.querySelector("#channelInput").readOnly = true
  }
}

function formatTimestamp(timestamp) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - timestamp) / 1000)

  if (diffInSeconds < 172800) { // Less than 24 hours
    if (now.getDate() === timestamp.getDate()) {
      const hours = timestamp.getHours()
      const minutes = timestamp.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
      return `Today at ${formattedHours}:${minutes} ${ampm}`
    } else {
      const hours = timestamp.getHours()
      const minutes = timestamp.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
      return `Yesterday at ${formattedHours}:${minutes} ${ampm}`
    }
    
  }

  const year = timestamp.getFullYear()
  const month = (timestamp.getMonth() + 1).toString().padStart(2, '0')
  const day = timestamp.getDate().toString().padStart(2, '0')
  const hours = timestamp.getHours()
  const minutes = timestamp.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')

  return `${year}/${month}/${day} ${formattedHours}:${minutes} ${ampm}`
}

function parseFormattedText(original, target, tag) {
  if (target == "```") {original = original.replace("\n", "")}
  var str = ""
  var i = 0
  for (split of original.split(target)) {
    if (i%2==0) {
      str += split+`<${tag}>`
    } else {
      str += split+`</${tag}>`
    }
    i += 1
  }
  str = str.substring(0, str.length-(2+tag.length)).trim()
  return str
}

function renderMessage(e) {
  const messageParent = document.createElement("div")
  const messageAuthorAvatar = document.createElement("img")
  const messageText = document.createElement("div")
  const messageAuthor = document.createElement("div")
  const messageContent = document.createElement("pre")

  messageParent.id = e.id
  messageParent.className = "message"
  messageAuthorAvatar.className = "message-author-avatar"
  messageAuthor.className = "message-author"
  messageContent.className = "message-content"

  timeDifference = Math.floor((new Date(e.timestamp) - new Date(PREVIOUS_MESSAGE.timestamp)) / 1000)
  PREVIOUS_MESSAGE = e

  if (timeDifference > CONFIG.time_render_difference || CURRENT_AUTHOR != e.author.id) {
    CURRENT_AUTHOR = e.author.id
    messageParent.style.marginTop = "0.5em"
    if (e.author.avatar) {
      messageAuthorAvatar.src = `https://cdn.discordapp.com/avatars/${e.author.id}/${e.author.avatar}?size=${CONFIG.image_resolution}`
    } else {
      messageAuthorAvatar.src = DEFAULT_AVATAR
    }
    messageAuthor.innerHTML = (e.author.global_name) ? e.author.global_name : e.author.username
    messageAuthor.innerHTML += `<span>${formatTimestamp(new Date(e.timestamp))}</span>`
  } else {
    messageAuthorAvatar.style.display = "none"
    messageParent.style.padding = 0
    messageParent.style.paddingLeft = "3.5em"
  }

  // codeblock, bold, italics
  for (const [key, value] of Object.entries(TEXT_FORMAT)) {
    if (e.content.includes(key)) {
      e.content = parseFormattedText(e.content, key, value)
    }
  }
  
  messageContent.innerHTML = e.content

  if (e.mentions) {
    for (mention of e.mentions) {
      e.content = e.content.split(`<@${mention.id}>`).join(`<span class="message-mention">@${mention.username}</span>`)
    }
    messageContent.innerHTML = e.content
  }

  // check special cases
  if (e.attachments) {
    e.attachments.forEach(function(a) {
      const attachmentParent = document.createElement("img")
      attachmentParent.src = a.url
      attachmentParent.className = "message-attachment"
      attachmentParent.onclick = function() {window.open(a.url, "_blank")}
      messageContent.append(attachmentParent)
    })
  }

  if (messageContent.innerHTML == "") {
    // no content rendered, unsupported message type
    const unsupported = document.createElement("div")
    unsupported.className = "unsupported-message"
    unsupported.innerHTML = "Unsupported message type, click to view traceback"
    unsupported.onclick = function() {window.open(`/api/traceback?data=${JSON.stringify(e)}`, "_blank")}
    messageContent.append(unsupported)
  }

  messageText.append(messageAuthor, messageContent)
  messageParent.append(messageAuthorAvatar, messageText)
  return messageParent
}

function renderMessages(messages) {
  const parent = document.querySelector("#messagesContainer")
  messages.forEach(function(e) {
    parent.append(renderMessage(e))
  })
  parent.children[parent.children.length-1].scrollIntoView()
}

function renderUpdateLogs(logs) {
  const parent = document.querySelector("#devLogs")
  let version
  logs.forEach(function(e) {
    const logParent = document.createElement("div")
    const logTitle = document.createElement("div")
    const logMinor = document.createElement("ul")
    const logPatch = document.createElement("ul")
    version = e.version

    logParent.className = "devlog"
    logTitle.className = "devlog-version"
    logMinor.className = "minor"
    logPatch.className = "patch"

    logTitle.innerHTML = `${e.version} ${e.date}`
    e.updates.minor.forEach(function(mu) {
      const li = document.createElement("li")
      li.innerHTML = mu
      logMinor.append(li)
    })
    e.updates.patch.forEach(function(pu) {
      const li = document.createElement("li")
      li.innerHTML = pu
      logPatch.append(li)
    })

    logParent.append(logTitle, logMinor, logPatch)
    parent.append(logParent)
  })

  document.querySelector("#channelName").innerHTML = `FakeCord v${version}`
}

function renderGuildChannelMeta(channel) {
  document.title = "FakeCord | "+channel.name
  document.querySelector("#channelName").innerHTML = channel.name
  document.querySelector("#channelDescription").innerHTML = (channel.topic && channel.topic != "null") ? channel.topic : ""
}

function renderGuildChannels(channels, fromSelf=false) {
  const parent = document.querySelector("#sidePanel")
  let channelParents = {}
  let channelParentMeta = {}
  channels.forEach(function(e) {
    if (e.type == 4) {
      channelParentMeta[e.id] = e
      channelParents[e.id] = document.createElement("div")
      channelParents[e.id].style.marginBottom = "1em"
      const parentName = document.createElement("div")
      parentName.className = "channel-parent-name"
      parentName.innerHTML = e.name.toUpperCase()
      channelParents[e.id].append(parentName)
    }
  })

  /*for (let _=0; _< Object.keys(channelParents).length; _++) {
    // dummy element
    parent.append(document.createElement("div"))
  }

  for (const [key, value] of Object.entries(channelParentMeta)) {
    parent.replaceChild(channelParents[key], parent.children[value.position])
  }*/
  
  // I can't figure out how discord sorts their channels. I tried using the position variable
  // but in some servers it's not unique and several channel parents have the same position
  // for now this will have to do.
  
  for (const [key, value] of Object.entries(channelParents)) {
    value.append(document.createElement("div"))
    value.children[0].onclick = function() {
      (value.children[1].style.display == "") ? value.children[1].style.display = "none" : value.children[1].style.display = ""
    }
    parent.append(value)
  }

  channels.forEach(function(e) {
    if (e.parent_id) {
      const channelParent = document.createElement("div")

      if (fromSelf && e.id == currentGuildChannel) {
        renderGuildChannelMeta(e)
      }

      if (e.type == 0 || e.type == 5) {
        if (fromSelf) {
          channelParent.onclick = function() {switchGuildChannelView(e.id)}
        } else {
          channelParent.onclick = function() {window.location.href = `/guilds/${currentGuild}/${e.id}`}
        }
      } else {
        channelParent.style.cursor = "not-allowed"
      }

      channelParent.setAttribute("topic", e.topic)
      channelParent.id = e.id
      channelParent.className = "guild-channel"
      channelParent.innerHTML = e.name
      channelParents[e.parent_id].children[1].append(channelParent)
    }
  })
}