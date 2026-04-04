import { Event } from '../types/Event';
import { logEvent } from '../modules/logging';

const event: Event<'guildBanAdd'> = {
  name: 'guildBanAdd',
  async execute(client, ban) {
    await logEvent(client, ban.guild, '🔨 Member Banned', `<@${ban.user.id}> (${ban.user.tag})\n**Reason:** ${ban.reason ?? 'No reason'}`, 0xe74c3c);
  },
};
export default event;
