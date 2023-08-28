const userProperties = PropertiesService.getUserProperties();
let TOKEN = userProperties.getProperty('TIMEGPT_TOKEN') || null;

function setToken(token) {
  userProperties.setProperty('TIMEGPT_TOKEN', token);
  TOKEN = token;
}

function getToken() {
  const maskedToken = TOKEN?.length
    ? "*".repeat(20) + TOKEN.slice(-4)
    : null;
  return maskedToken;
}
