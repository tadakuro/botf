import { AuditLogEvent, Guild, GuildAuditLogsEntry } from 'discord.js';
import { BotClient } from '../client';
import { AntiNukeService } from '../services/antiNukeService';
import { logger } from '../utils/logger';

const actionMap: Record<string, string> = {
  [AuditLogEvent.MemberBanAdd]: 'ban',
  [AuditLogEvent.MemberKick]: 'kick',
  [AuditLogEvent.ChannelDelete]: 'channelDelete',
  [AuditLogEvent.ChannelCreate]: 'channelCreate',
  [AuditLogEvent.RoleDelete]: 'roleDelete',
  [AuditLogEvent.RoleCreate]: 'roleCreate',
  [AuditLogEvent.WebhookCreate]: 'webhookCreate',
};

export async function handleAntiNuke(
  client: BotClient,
  guild: Guild,
  entry: GuildAuditLogsEntry,
): Promise<void> {
  const actionType = actionMap[entry.action];
  if (!actionType) return;

  const executorId = entry.executor?.id;
  if (!executorId || executorId === client.user?.id) return;

  try {
    const service = new AntiNukeService(client);
    await service.processAction(guild, executorId, actionType);
  } catch (err) {
    logger.error('AntiNuke handler error:', err);
  }
}
