const DISCORD_API = 'https://discord.com/api/v10';

export async function getGuilds(accessToken: string) {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch guilds');
  return res.json();
}

export async function getBotGuilds(): Promise<string[]> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const guilds: any[] = await res.json();
  return guilds.map(g => g.id);
}

export async function getGuildRoles(guildId: string) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const roles: any[] = await res.json();
  return roles
    .filter(r => r.name !== '@everyone')
    .sort((a, b) => b.position - a.position)
    .map(r => ({ id: r.id, name: r.name, color: r.color, position: r.position }));
}

export async function getGuildChannels(guildId: string) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  return res.json();
}

export function hasManageGuild(permissions: string): boolean {
  const MANAGE_GUILD = 0x20n;
  const ADMINISTRATOR = 0x8n;
  const perms = BigInt(permissions);
  return (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR;
}

export function guildIconUrl(id: string, icon: string | null): string {
  if (!icon) return `https://cdn.discordapp.com/embed/avatars/0.png`;
  const ext = icon.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${id}/${icon}.${ext}?size=128`;
}
