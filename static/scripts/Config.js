var CONFIG
var CURRENT_AUTHOR
var PREVIOUS_MESSAGE
const DEFAULT_AVATAR = "/static/assets/fakecord.png"
const TEXT_FORMAT = {
  "```": "p",
  "**": "b",
  "`": "code",
  "*": "i"
}

makeRequest("/api/configs/all")
  .then(c => {CONFIG = c})