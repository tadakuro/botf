import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { LoginButton } from '@/components/ui/LoginButton';

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">BotForge</h1>
          <p className="text-gray-400 mt-2">Sign in to manage your Discord servers</p>
        </div>
        <LoginButton />
      </div>
    </div>
  );
}
