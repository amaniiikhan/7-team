import React, { useState, useEffect } from 'react';
import './App.css';

var express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const CLIENT_ID = '9f9e746f4f604bbe9331529d75394009';
const CLIENT_SECRET = '98269e0b4df84cbba1997148f0e13c7b';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';


const App = () => {
    const [code, setCode] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [topTracks, setTopTracks] = useState([]);

    const [signupData, setSignupData] = useState({
      username: '',
      email: '',
      password: ''
  });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
            setCode(authCode);
            exchangeCodeForToken(authCode);
        }
    }, []);

    const exchangeCodeForToken = async (code) => {
      try {
          const response = await fetch('http://localhost:3001/exchange-token', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
          });
          if (response.status === 200) {
            // If the response status is 200 OK, parse the JSON data
            const data = await response.json();
            setAccessToken(data.access_token);
            console.log('Access Token:', data.access_token); // Debug: Check access token
        } else {
            // If the response status is not 200, handle the error
            console.error('Error exchanging token:', response.statusText);
            // You can display an error message to the user or perform other error handling here
        }
      } catch (error) {
          console.error('Error exchanging token:', error);
      }
  };

    useEffect(() => {
      if (!accessToken) return;
      fetchTopTracks();
  }, [accessToken]);


  const fetchTopTracks = async () => {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        console.log('Top Tracks Response:', data); // Debug: Check the response

        if (data && data.items) {
            setTopTracks(data.items);
            console.log('Top Tracks Data:', data.items); // Debug: Check the data items
        } else {
            console.log('No items found in response'); // Debug: No items in response
        }
    } catch (error) {
        console.error('Error fetching top tracks:', error);
    }
};


    const handleInputChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        console.log(signupData);
        // Handle the signup logic here (e.g., sending data to backend)
    };

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&show_dialog=true`;
    };

    return (
    <div className="app-container">
        {!code ? (
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={signupData.username} 
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={signupData.email} 
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={signupData.password} 
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <button onClick={handleLogin} className="spotify-login-button">Login with Spotify</button>
            </div>
        ) : (
            <div>
                {accessToken && (
    <div>
        <h2>Top Tracks</h2>
        <ul>
            {topTracks.map((track, index) => (
                <li key={index}>{track.name} by {track.artists.map(artist => artist.name).join(", ")}</li>
            ))}
        </ul>
    </div>
)}

            </div>
        )}
    </div>
);
};

export default App;