import { MessageReaction, User, GuildMember } from 'discord.js';
import { BotClient } from '../client';
import { logger } from '../utils/logger';

// Reaction role pairs stored in memory per guild: messageId -> { emoji: roleId }
const reactionRoleMap = new Map<string, Map<string, string>>();

export function registerReactionRole(messageId: string, emoji: string, roleId: string): void {
  if (!reactionRoleMap.has(messageId)) reactionRoleMap.set(messageId, new Map());
  reactionRoleMap.get(messageId)!.set(emoji, roleId);
}

export async function handleReactionAdd(client: BotClient, reaction: MessageReaction, user: User): Promise<void> {
  if (user.bot || !reaction.message.guild) return;
  try {
    const map = reactionRoleMap.get(reaction.message.id);
    if (!map) return;
    const roleId = map.get(reaction.emoji.name ?? '') ?? map.get(reaction.emoji.id ?? '');
    if (!roleId) return;
    const member = reaction.message.guild.members.cache.get(user.id) as GuildMember;
    const role = reaction.message.guild.roles.cache.get(roleId);
    if (member && role) await member.roles.add(role, 'Reaction role').catch(() => {});
  } catch (err) {
    logger.error('handleReactionAdd error:', err);
  }
}

export async function handleReactionRemove(client: BotClient, reaction: MessageReaction, user: User): Promise<void> {
  if (user.bot || !reaction.message.guild) return;
  try {
    const map = reactionRoleMap.get(reaction.message.id);
    if (!map) return;
    const roleId = map.get(reaction.emoji.name ?? '') ?? map.get(reaction.emoji.id ?? '');
    if (!roleId) return;
    const member = reaction.message.guild.members.cache.get(user.id) as GuildMember;
    const role = reaction.message.guild.roles.cache.get(roleId);
    if (member && role) await member.roles.remove(role, 'Reaction role removed').catch(() => {});
  } catch (err) {
    logger.error('handleReactionRemove error:', err);
  }
}
