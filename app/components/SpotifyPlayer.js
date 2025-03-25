"use client";

import { useEffect, useState } from "react";

export default function SpotifyPlayer({
  token,
  currentTrack,
  setCurrentTrack,
  setDeviceId,
}) {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Cadenza Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      player.connect().then((success) => {
        if (success) {
          console.log("Connected to Spotify!");
          setPlayer(player);
          setIsPlayerReady(true); // Player is ready
        } else {
          console.error("Failed to connect to Spotify");
        }
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id); // Store the device ID
      });

      player.addListener("player_state_changed", (state) => {
        console.log("Player State Changed:", state);
        setIsPlaying(!state.paused); // Update isPlaying based on the paused state
        setCurrentTrack(state.track_window.current_track);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Account Error:", message);
      });
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      {/* Display Current Track */}
      {currentTrack && (
        <div className="text-center">
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            className="w-32 h-32 mx-auto rounded-lg"
          />
          <p className="mt-2 font-semibold">{currentTrack.name}</p>
          <p className="text-gray-600">{currentTrack.artists[0].name}</p>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex space-x-4">
        <button
          onClick={() => {
            if (isPlaying) {
              player
                ?.pause()
                .then(() => {
                  console.log("Playback paused");
                })
                .catch((error) => {
                  console.error("Error pausing playback:", error);
                });
            } else {
              player
                ?.resume()
                .then(() => {
                  console.log("Playback resumed");
                })
                .catch((error) => {
                  console.error("Error resuming playback:", error);
                });
            }
          }}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          disabled={!isPlayerReady}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>

      {/* Volume Control */}
      <div className="w-48">
        <label
          htmlFor="volume"
          className="block text-sm font-medium text-gray-700"
        >
          Volume
        </label>
        <input
          type="range"
          id="volume"
          min="0"
          max="1"
          step="0.1"
          defaultValue="0.5"
          onChange={(e) => player?.setVolume(parseFloat(e.target.value))}
          className="w-full"
          disabled={!isPlayerReady}
        />
      </div>
    </div>
  );
}
