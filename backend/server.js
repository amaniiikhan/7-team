const dotenv = require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // To parse JSON bodies

const CLIENT_ID = '9f9e746f4f604bbe9331529d75394009';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const CLIENT_SECRET = '98269e0b4df84cbba1997148f0e13c7b'
const RESPONSE_TYPE = 'code';

const PORT = process.env.PORT || 3001;

// Endpoint to exchange the authorization code for an access token
app.post('/exchange-token', async (req, res) => {
    const { code } = req.body; // Get the authorization code from the request body

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json(response.data); // Send the access token back to the frontend
    } catch (error) {
        console.error('Error exchanging token:', error);
        res.status(500).send('Error exchanging token');
    }
});

console.log('Listening on 3001');
app.listen(3001);