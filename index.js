const express = require('express'); // Express web server framework
const axios = require('axios');
const cors = require('cors');
const dotenv = require("dotenv");
const fetch = require('node-fetch');

dotenv.config();

const encodeFormData = (data) => {
  return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
  .join('&')
}

// TODO: set constiables in environment 
const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
const app = express();

const AuthRouters = require('./authRoutes');

app.use('/', AuthRouters);

app.listen(8888, () => {
  console.log('Server started!');
});

// Add headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.route('/callback').get((req, res) => {

  const body = {
    code: req.query.code,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code',
    client_id: client_id,
    client_secret: client_secret
  };

  fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    headers: {
      "Content-Type": "applicaton/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: encodeFormData(body)
  })
    .then(response => response.json())
    .then(repsone => console.log(repsone))
});
