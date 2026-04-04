import { GuildMember, PermissionResolvable } from 'discord.js';
import { canUseCommand } from '../../../packages/database/src/repositories/commandPermissionRepository';

export async function checkCommandPermission(
  guildId: string,
  commandName: string,
  category: string,
  member: GuildMember,
): Promise<{ allowed: boolean; reason?: string }> {
  // Administrators always bypass permission checks
  if (member.permissions.has('Administrator')) return { allowed: true };
  const roleIds = [...member.roles.cache.keys()];
  return canUseCommand(guildId, commandName, category, roleIds);
}

export function memberHasPerms(member: GuildMember, perms: PermissionResolvable[]): boolean {
  return perms.every(p => member.permissions.has(p));
}

export function botHasPerms(member: GuildMember, perms: PermissionResolvable[]): boolean {
  return perms.every(p => member.permissions.has(p));
}
