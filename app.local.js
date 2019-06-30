const app = require('./app')
const port = 3001

app.listen(port)
console.log(`listening on http://localhost:${port}`)

// npm run config -- --account-id="835963302541" --bucket-name="redirect.steamplayed.com" --function-name="SteamPlayedRedirectFunction"
