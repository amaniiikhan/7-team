import React, { useState, useEffect } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
    return window.location.hash.substring(1).split('&').reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);

        return initial;
    },{}); 
};

function App() {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [topTracks, setTopTracks] = useState({})
    const [topArtists, setTopArtists] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        console.log("This is what we derived from the URL: ", getTokenFromUrl())
        const spotifyToken = getTokenFromUrl().access_token
        window.location.hash = "";
        console.log("This is our spotify token:", spotifyToken);

        if (spotifyToken) {
            setSpotifyToken(spotifyToken)
            //use spotify api
            spotifyApi.setAccessToken(spotifyToken)
            spotifyApi.getMe().then((user) => {
                console.log(user)
            })  
            setLoggedIn(true)
        }
    })

    const getTopTracks = () => {
        spotifyApi.getMyTopTracks().then((response) => {
            console.log("This is the response from getMyTopTracks: ", response)
            setTopTracks(response)
        })
    }

    return (<div className="App">
        {!loggedIn && 
        <a href="http://localhost:3001/login"> Login to Spotify </a>}
        {loggedIn && (<> 
        <div>Top Tracks: {topTracks}</div>
        </>)}
        {loggedIn && <button onClick={getTopTracks()}>Get Top Tracks</button>}
    </div>);

        }
    
        export default App;