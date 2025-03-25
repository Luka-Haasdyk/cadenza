"use client";

import { useState, useEffect } from "react";
import SpotifyPlayer from "./SpotifyPlayer";

export default function EntryArea() {
  // Variables for Entries
  const [entryText, setEntryText] = useState("");
  const [entryTitle, setEntryTitle] = useState("");

  // Variables for SpotifyPlayer
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Variables for SpotifyPlayer authentication and connection
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    // Extract the access_token from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");

    if (accessToken) {
      setToken(accessToken);
      // Clear the access_token from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const startPlayback = async (trackUri) => {
    if (!token || !deviceId) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [trackUri] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to start playback: ${response.statusText}`);
      }

      console.log("Playback started successfully!");
    } catch (error) {
      if (error.message.includes("CloudPlaybackClientError")) {
        console.warn("Spotify internal error (ignored):", error.message);
      } else {
        console.error("Error starting playback:", error);
      }
    }
  };

  const pausePlayback = async () => {
    if (!token || !deviceId) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to pause playback: ${response.statusText}`);
      }

      console.log("Playback paused successfully!");
    } catch (error) {
      console.error("Error pausing playback:", error);
    }
  };

  const saveEntry = async () => {
    const entryData = {
      id: Math.random().toString(36),
      title: entryTitle,
      text: entryText,
      track: currentTrack?.uri || null, // Added null check
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);

      setEntryText("");
      setSearchQuery("");
      setSearchResults([]);
      setCurrentTrack(null);
      setEntryTitle("");
      await pausePlayback();
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery || !token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("Spotify API Error:", data.error.message);
        setSearchResults([]);
        return;
      }

      if (data.tracks?.items) {
        setSearchResults(data.tracks.items);
      } else {
        console.error("No tracks found in the response:", data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setSearchResults([]);
    }
  };

  return (
    <div className="h-screen flex gap-4 p-4">
      {/* Left Section (Entry Form) */}
      <div className="flex-1 bg-white p-5 rounded-lg shadow-lg flex flex-col">
        <input
          placeholder="Title"
          value={entryTitle}
          onChange={(e) => setEntryTitle(e.target.value)}
          className="bg-black h-10 w-full p-5 text-white mb-4"
        />
        <textarea
          placeholder="Write your heart out..."
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          className="bg-black flex-1 w-full p-5 text-white mb-4 resize-none" // flex-1 makes it span remaining space
        ></textarea>
        <div className="flex space-x-4">
          <button
            className="bg-slate-600 mt-2.5 pt-2 pr-10 pl-10 pb-2 border-4 border-slate-600 hover:border-slate-700 rounded-lg"
            onClick={() => setEntryText("")}
          >
            Clear
          </button>
          <button
            className="bg-green-600 mt-2.5 pt-2 pr-10 pl-10 pb-2 border-4 border-green-600 hover:border-green-700 rounded-lg"
            onClick={saveEntry}
          >
            Save
          </button>
        </div>
      </div>

      {/* Right Section (Spotify Search and Player) */}
      <div className="w-1/3 bg-white p-5 rounded-lg shadow-lg flex flex-col">
        {token ? (
          <>
            {/* Search Input and Button */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a track"
              className="p-2 border rounded text-black w-full mb-4"
            />
            <button
              onClick={searchTracks}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full mb-4"
            >
              Search
            </button>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="w-full text-black">
                <h3 className="text-lg font-semibold">Search Results</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((track) => (
                    <li
                      key={track.uri}
                      onClick={() => {
                        setCurrentTrack(track); // Set the current track
                        startPlayback(track.uri); // Start playback
                      }}
                      className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                    >
                      <p className="font-semibold">{track.name}</p>
                      <p className="text-sm text-gray-600">
                        {track.artists[0].name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Spotify Player */}
            {currentTrack && (
              <SpotifyPlayer
                token={token}
                currentTrack={currentTrack}
                setCurrentTrack={setCurrentTrack}
                setDeviceId={setDeviceId}
              />
            )}
          </>
        ) : (
          // Login with Spotify Button
          <a
            href="/api/auth"
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
          >
            Login with Spotify
          </a>
        )}
      </div>
    </div>
  );
}
