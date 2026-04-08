import { Event } from '../types/Event';
import { handleAntiNuke } from '../handlers/antiNukeHandler';
import { AuditLogEvent } from 'discord.js';

const event: Event<'guildUpdate'> = {
  name: 'guildUpdate',
  async execute(client, oldGuild: any, newGuild: any) {
    if (!newGuild) return;
    try {
      const logs = await newGuild.fetchAuditLogs({ limit: 1 });
      const entry = logs.entries.first();
      if (entry) await handleAntiNuke(client, newGuild, entry);
    } catch {}
  },
};
export default event;
