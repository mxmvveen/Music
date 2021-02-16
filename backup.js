const express = require('express'); // Express web server framework
const axios = require('axios');
const request = require('request');
const dotenv = require("dotenv");

dotenv.config();

// TODO: set constiables in environment 
const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
const app = express();

app.listen(8888, () => {
    console.log('Server started!');
});

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  // Pass to next layer of middleware
  next();
});

app.route('/login').get((req, res) => {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email`);
});

app.route('/callback').get((req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, (error, response, body) => {
          const accessToken = body.access_token;
          const authOptions = {
            url: 'https://api.spotify.com/v1/me/',
            headers: {
              'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
          };
          // console.log(accessToken)

          // axios.defaults.headers.common = {'Authorization': `bearer ${token}`}

          axios.get(authOptions.url, {
            headers: {'Authorization': `Bearer ${accessToken}`}
          })
            .then(response => res.send(response.data))
            .catch(err => console.log('error !', err))
          
      });
});
