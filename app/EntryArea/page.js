"use client";

import { useRouter } from "next/navigation";
import EntryArea from "../components/EntryArea";

export default function Home() {
  const router = useRouter();

  const goToLandingPage = () => {
    router.push("/");
  };

  const goToEntryList = () => {
    router.push("/EntryList");
  };

  return (
    <main className="container mx-auto">
      <EntryArea />
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={goToLandingPage}
          className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition duration-300"
        >
          Back
        </button>
        <button
          onClick={goToEntryList}
          className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
        >
          Entry List
        </button>
      </div>
    </main>
  );
}
