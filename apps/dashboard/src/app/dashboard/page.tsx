import { requireSession } from '@/lib/session';
import { getGuilds, getBotGuilds, guildIconUrl, hasManageGuild } from '@/lib/discord';
import Image from 'next/image';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await requireSession();
  const [userGuilds, botGuildIds] = await Promise.all([
    getGuilds(session.accessToken),
    getBotGuilds(),
  ]);

  const manageable = userGuilds.filter((g: any) => hasManageGuild(g.permissions));
  const withBot = manageable.filter((g: any) => botGuildIds.includes(g.id));
  const withoutBot = manageable.filter((g: any) => !botGuildIds.includes(g.id));

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Select a Server</h1>
          <p className="text-gray-400 mt-1">Choose a server to manage with BotForge</p>
        </div>

        {withBot.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Bot Added</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {withBot.map((g: any) => (
                <Link key={g.id} href={`/dashboard/${g.id}`}>
                  <div className="card hover:border-brand transition-colors cursor-pointer flex items-center gap-4">
                    <Image
                      src={guildIconUrl(g.id, g.icon)}
                      alt={g.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{g.name}</p>
                      <p className="text-xs text-green-400">Bot active</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {withoutBot.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Add Bot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {withoutBot.map((g: any) => (
                <a
                  key={g.id}
                  href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${g.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="card hover:border-gray-500 transition-colors cursor-pointer flex items-center gap-4 opacity-60 hover:opacity-100">
                    <Image
                      src={guildIconUrl(g.id, g.icon)}
                      alt={g.name}
                      width={48}
                      height={48}
                      className="rounded-full grayscale"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{g.name}</p>
                      <p className="text-xs text-gray-400">Click to add bot</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
