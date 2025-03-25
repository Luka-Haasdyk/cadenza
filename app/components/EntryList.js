"use client";

import React, { useState, useEffect } from "react";
import Entry from "./Entry";

export default function EntryList({}) {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/entries");
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };
    fetchEntries();
  }, []);

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setEntryText(entry.text);
  };

  const handleUnselectEntry = () => {
    setSelectedEntry(null);
    setEntryText("");
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    if (interval === 1) return "1 year ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    if (interval === 1) return "1 month ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    if (interval === 1) return "1 day ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    if (interval === 1) return "1 hour ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (interval === 1) return "1 minute ago";

    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {entries.map((entry) => (
        <button
          key={entry.date}
          onClick={() => handleSelectEntry(entry)}
          className="bg-white p-5 rounded-lg shadow-lg flex flex-col justify-between items-center text-black text-lg"
        >
          {selectedEntry && selectedEntry.date === entry.date ? (
            <button
              onClick={() => handleUnselectEntry(entry)}
              className="bg-red-600 mt-2.5 pt-2 pr-10 pl-10 pb-2 border-4 border-red-600 hover:border-red-700 rounded-lg"
            >
              Close
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <Entry
                id={entry.id}
                title={entry.title}
                text={entry.text}
                date={formatRelativeTime(entry.date)}
                track={entry.track}
              />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
