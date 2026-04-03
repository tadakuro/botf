import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  return session as any;
}

export async function getSession() {
  return getServerSession(authOptions) as Promise<any>;
}
