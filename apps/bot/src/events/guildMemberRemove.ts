import { Event } from '../types/Event';
import { handleGoodbye } from '../modules/goodbye';
import { logEvent } from '../modules/logging';

const event: Event<'guildMemberRemove'> = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    await handleGoodbye(client, member);
    if (member.guild) {
      await logEvent(client, member.guild, '👋 Member Left', `<@${member.id}> (${member.user?.tag ?? member.id})`, 0xf39c12);
    }
  },
};
export default event;
