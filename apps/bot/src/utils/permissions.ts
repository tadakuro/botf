import { GuildMember, PermissionResolvable } from 'discord.js';

export function memberHasPermission(
  member: GuildMember,
  permissions: PermissionResolvable[],
): boolean {
  return permissions.every((perm) => member.permissions.has(perm));
}

export function isHigherRole(executor: GuildMember, target: GuildMember): boolean {
  return executor.roles.highest.position > target.roles.highest.position;
}
