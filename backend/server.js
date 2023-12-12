var express = require('express');
var request = require('request');
var cors = require('cors'); // Import the cors middleware
var querystring = require('querystring');
var cookieParser = require('cookie-parser');



const CLIENT_ID = '9f9e746f4f604bbe9331529d75394009';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const CLIENT_SECRET = '98269e0b4df84cbba1997148f0e13c7b'
const RESPONSE_TYPE = 'code';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };


var stateKey = 'spotify_auth_state';    
var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', function(req, res) { 
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-read-playback-state';
    res.redirect(AUTH_ENDPOINT + '?' +
    querystring.stringify({
        response_type: RESPONSE_TYPE,
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
        }));
    });

app.get('/callback', function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
    res.redirect('/#' +
        querystring.stringify({
        error: 'state_mismatch'
        }));
    }
    else {
    res.clearCookie(stateKey);
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
        },
        headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };


        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/#' +
            querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
            }));
        }
        else {
        res.redirect('http://localhost:3000/#' +
            querystring.stringify({
            error: 'invalid_token'
            }));
        }
    }
    );
    }
}); 

app.get('/refresh_token', function(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded','Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
    form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    },
    json: true
    };

    request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
            refresh_token = body.refresh_token;
        res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
        });
        }
    });
    });








const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
