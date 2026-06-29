import { cookies } from 'next/headers';
import TravelogueClient from './TravelogueClient';

export default async function TraveloguePage() {
  const cookieStore = await cookies();
  const currentUserEmail = cookieStore.get('wave_session')?.value || null;

  return <TravelogueClient currentUserEmail={currentUserEmail} />;
}
