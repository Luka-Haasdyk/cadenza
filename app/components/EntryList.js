import Entry from "./Entry";

export default function EntryList({ entries, onSelectEntry, onUnselectEntry, selectedEntry }) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.date} className="flex-col justify-between items-center p-5 border-b-2 border-gray-200 text-black text-lg">
          {selectedEntry && selectedEntry.date === entry.date ? (
            <button
              onClick={() => onUnselectEntry(entry)}
              className="bg-red-600 mt-2.5 pt-2 pr-10 pl-10 pb-2 border-4 border-red-600 hover:border-red-700 rounded-lg"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => onSelectEntry(entry)}
              className="bg-green-600 mt-2.5 pt-2 pr-10 pl-10 pb-2 border-4 border-green-600 hover:border-green-700 rounded-lg"
            >
              View
            </button>
          )}
          <Entry date={entry.date} />
        </li>
      ))}
    </ul>
  );
}