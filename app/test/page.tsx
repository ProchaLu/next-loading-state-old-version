import { cookies } from 'next/headers';

export default function Test() {
  const session = cookies().get('session')?.value;
  return (
    <main>
      <h1>get cookie</h1>
      <div>Session: {session}</div>
    </main>
  );
}
