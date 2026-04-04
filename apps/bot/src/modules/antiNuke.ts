import { Guild, GuildMember } from 'discord.js';
import { BotClient } from '../client';
import { AntiNukeService } from '../services/antiNukeService';
import { logger } from '../utils/logger';

export async function checkAntiNuke(
  client: BotClient,
  guild: Guild,
  executorId: string,
  action: string,
): Promise<void> {
  try {
    const service = new AntiNukeService(client);
    await service.processAction(guild, executorId, action);
  } catch (err) {
    logger.error('checkAntiNuke error:', err);
  }
}
