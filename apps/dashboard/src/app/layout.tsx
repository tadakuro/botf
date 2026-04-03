import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

// NOTE: create src/app/globals.css that imports from styles/globals.css
// or move the content there directly

export const metadata: Metadata = {
  title: 'BotForge Dashboard',
  description: 'Manage your Discord bot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
