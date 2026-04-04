import { GuildMember, User } from 'discord.js';

export function formatUser(user: User): string {
  return `**${user.tag}** (${user.id})`;
}

export function formatMember(member: GuildMember): string {
  return `**${member.user.tag}** (${member.id})`;
}

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
