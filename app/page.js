"use client";

import EntryArea from "./components/EntryArea";

export default function Home() {

  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold text-center p-10">
        Welcome to Cadenza
      </h1>
      <EntryArea />
    </main>
  );
}
