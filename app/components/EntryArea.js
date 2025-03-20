"use client";

import { useState, useEffect } from "react";
import EntryList from "./EntryList";
import SpotifyPlayer from "./SpotifyPlayer";

export default function EntryArea() {
  // Variables for Entries
  const [entryText, setEntryText] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

  const saveEntry = async () => {
    const entryData = {
      id: Math.random().toString(36),
      text: entryText,
      track: currentTrack.uri,
      date: new Date().toISOString(),
    };

    console.log("Data to send:", entryData);

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
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry); // Set the selected entry
    setEntryText(entry.text); // Populate the textarea with the selected entry's text
  };

  const handleUnselectEntry = () => {
    setSelectedEntry(null); // Set the selected entry
    setEntryText(""); // Populate the textarea with the selected entry's text
  };

  const searchTracks = async () => {
    if (!searchQuery || !token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track&limit=5`,
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
      console.log("API Response:", data); // Log the full response

      // Check for API errors
      if (data.error) {
        console.error("Spotify API Error:", data.error.message);
        setSearchResults([]); // Clear search results on error
        return;
      }

      // Check if tracks are present in the response
      if (data.tracks && data.tracks.items) {
        setSearchResults(data.tracks.items);
      } else {
        console.error("No tracks found in the response:", data);
        setSearchResults([]); // Clear search results if no tracks are found
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setSearchResults([]); // Clear search results on error
    }
  };

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
      // Suppress Spotify internal errors
      if (error.message.includes("CloudPlaybackClientError")) {
        console.warn("Spotify internal error (ignored):", error.message);
      } else {
        console.error("Error starting playback:", error);
      }
    }
  };

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="bg-white custom-height col-start-1 col-span-6 pt-5 pr-5 pl-5 pb-20">
        <textarea
          placeholder="Write your heart out..."
          value={entryText} // Set the textarea value to entryText
          onChange={(e) => setEntryText(e.target.value)} // Update entryText as the user types
          className="bg-black h-full w-full p-5 text-white"
        ></textarea>
        <button
          className="bg-slate-600 mt-2.5 mr-5 pt-2 pr-10 pl-10 pb-2 border-4 border-slate-600 hover:border-slate-700 rounded-lg"
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
      <div className="bg-white col-start-7 col-end-9 overflow-scroll">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a track"
          className="p-2 border rounded text-black"
        />
        <button
          onClick={searchTracks}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
        >
          Search
        </button>
        {searchResults.length > 0 && (
          <div className="w-64 text-black">
            <h3 className="text-lg font-semibold">Search Results</h3>
            <ul className="space-y-2">
              {searchResults.map((track) => (
                <li
                  key={track.uri}
                  onClick={() => startPlayback(track.uri)}
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
        {token ? (
          <SpotifyPlayer
            token={token}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            setDeviceId={setDeviceId}
          />
        ) : (
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
