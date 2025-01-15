"use client";

import { useState } from "react";

export default function Home() {
  const [entryText, setEntryText] = useState("");

  const saveEntry = async () => {
    if (entryText.length === 0) {
      alert("Please write something before saving.");
      return;
    } else {
       
    }
  }

  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold text-center p-10">
        Welcome to Yournal
      </h1>
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white custom-height col-start-1 col-end-3">
          <ul>
            <li></li>
          </ul>
        </div>
        <div className="bg-white custom-height col-end-7 col-span-4 pt-5 pr-5 pl-5 pb-20">
          <textarea
            placeholder="Write your heart out..."
            onChange={setEntryText}
            className="bg-black h-full w-full p-5"
          ></textarea>
            <button className="bg-slate-600 mt-2.5 mr-5 pt-2 pr-10 pl-10 pb-2 border-4 border-slate-600 hover:border-slate-700  rounded-lg"> Clear </button>
            <button className="bg-green-600 mt-2.5 pt-2 pr-10 pl-10 pb-2 border-4 border-green-600 hover:border-green-700 rounded-lg"> Save </button>
        </div>
      </div>
    </main>
  );
}
