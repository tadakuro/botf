import { TextChannel } from 'discord.js';
import { BotClient } from '../client';
import { logger } from '../utils/logger';

interface ScheduledMessage {
  channelId: string;
  guildId: string;
  content: string;
  interval: number; // ms
  timer: NodeJS.Timeout;
}

const scheduledMessages = new Map<string, ScheduledMessage>();

export function scheduleMessage(
  client: BotClient,
  id: string,
  guildId: string,
  channelId: string,
  content: string,
  intervalMs: number,
): void {
  if (scheduledMessages.has(id)) cancelScheduledMessage(id);

  const timer = setInterval(async () => {
    try {
      const guild = client.guilds.cache.get(guildId);
      const channel = guild?.channels.cache.get(channelId) as TextChannel;
      if (channel) await channel.send(content);
    } catch (err) {
      logger.error(`scheduledMessage error [${id}]:`, err);
    }
  }, intervalMs);

  scheduledMessages.set(id, { channelId, guildId, content, interval: intervalMs, timer });
}

export function cancelScheduledMessage(id: string): void {
  const msg = scheduledMessages.get(id);
  if (msg) { clearInterval(msg.timer); scheduledMessages.delete(id); }
}

export function getScheduledMessages(): Map<string, ScheduledMessage> {
  return scheduledMessages;
}
