const express = require('express'); // Express web server framework
const axios = require('axios');
const router = express.Router();


const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


router.get('/login', async (req, res) => {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email`);
});

module.exports = router;