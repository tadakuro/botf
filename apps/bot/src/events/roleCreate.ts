import { Event } from '../types/Event';
import { handleAntiNuke } from '../handlers/antiNukeHandler';
import { AuditLogEvent } from 'discord.js';

const event: Event<'roleCreate'> = {
  name: 'roleCreate',
  async execute(client, entity) {
    if (!('guild' in entity) || !entity.guild) return;
    try {
      const logs = await entity.guild.fetchAuditLogs({ limit: 1 });
      const entry = logs.entries.first();
      if (entry) await handleAntiNuke(client, entity.guild, entry);
    } catch {}
  },
};
export default event;
