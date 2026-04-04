import { ActivityType } from 'discord.js';
import { Event } from '../types/Event';
import { logger } from '../utils/logger';

const event: Event<'ready'> = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user!.tag}`);
    client.user!.setPresence({
      activities: [{ name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }],
      status: 'online',
    });
  },
};

export default event;
