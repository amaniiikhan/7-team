import React, { useEffect, useState } from 'react';
import './App.css'; // Ensure this CSS file contains all the styles you need

function App() {
  // State to store top tracks
  const [topTracks, setTopTracks] = useState([]);

  // Function to fetch top tracks - this replaces your <script> logic
  const fetchTopTracks = async () => {
    const token = 'your-spotify-token'; // Replace with your actual token
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTopTracks(data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };

  // useEffect to call fetchTopTracks on component mount
  useEffect(() => {
    fetchTopTracks();
  }, []);

  return (
    <div className="container mx-auto px-10 py-8 bg-gray-800 text-white">
      <header className="flex justify-between items-center py-6">
        <div className="flex items-center">
          <img alt="Spotify logo" className="mr-3" height="50"
            src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-euzpUPLvjnRGSWbgVYQXvD7j/user-UmmS0JesFNVKnuBjRyG1qKnv/img-HezAHpamcSjZyYWgkTXDJJDf.png"
            width="50" />
          <nav className="flex space-x-4">
            <a className="text-gray-300 hover:text-white" href="#">
              Listening
            </a>
            <a className="text-gray-300 hover:text-white" href="#">
              Carousel
            </a>
            <a className="text-gray-300 hover:text-white" href="#">
              Songs
            </a>
            <a className="text-gray-300 hover:text-white" href="#">
              Sounds
            </a>
            <a className="text-gray-300 hover:text-white" href="index-4.html">
              Sign Up
            </a>
          </nav>
        </div>
        <div className="flex items-center">
          <a className="text-gray-300 hover:text-white mr-4" href="#">
            Search Friends
          </a>
          <i className="fas fa-search text-gray-300 hover:text-white"></i>
        </div>
      </header>
      <main>
        <section className="text-center py-10">
          <h1 className="text-5xl font-bold mb-6">
            That's a Wrap
          </h1>
          <div className="flex justify-center space-x-6">
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-400">Top</p>
              <p className="text-2xl font-semibold">10</p>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-400">Followers</p>
              <p className="text-2xl font-semibold">129</p>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-400">Following</p>
              <p className="text-2xl font-semibold">46</p>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-400">Wraps</p>
              <p className="text-2xl font-semibold">16</p>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="grid grid-cols-4 gap-6">
            {/* Dynamically rendered songs of the month */}
            {topTracks.map((track, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Song</h2>
                <p className="text-gray-400 text-sm">
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
