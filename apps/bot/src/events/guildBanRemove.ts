import { Event } from '../types/Event';
import { logEvent } from '../modules/logging';

const event: Event<'guildBanRemove'> = {
  name: 'guildBanRemove',
  async execute(client, ban) {
    await logEvent(client, ban.guild, '✅ Member Unbanned', `<@${ban.user.id}> (${ban.user.tag})`, 0x2ecc71);
  },
};
export default event;
