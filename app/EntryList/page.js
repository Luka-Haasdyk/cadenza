"use client";

import { useRouter } from 'next/navigation';
import EntryList from '../components/EntryList';

export default function Home() {
  const router = useRouter();

  const goToLandingPage = () => {
    router.push("/");
  };

  const goToEntryArea = () => {
    router.push('/EntryArea');
  };

  return (
    <main className="container mx-auto">
      <EntryList />
      <button onClick={goToLandingPage}> Back </button>
      <button onClick={goToEntryArea}>Go to Entry Area</button>
    </main>
  );
}