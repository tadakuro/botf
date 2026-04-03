'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export function TopNav() {
  const { data: session } = useSession();
  return (
    <header className="h-16 bg-surface-raised border-b border-surface-border flex items-center justify-between px-6">
      <Link href="/dashboard" className="text-lg font-bold text-white hover:text-brand transition-colors">
        ⚡ BotForge
      </Link>
      {session?.user && (
        <div className="flex items-center gap-3">
          {session.user.image && (
            <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full" />
          )}
          <span className="text-sm text-gray-300 hidden sm:block">{session.user.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn-ghost text-sm py-1 px-3">
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
