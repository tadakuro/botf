import { Event } from '../types/Event';
import { handleWelcome } from '../modules/welcome';
import { handleAutoRole } from '../modules/welcome';
import { handleRaidCheck } from '../modules/antiRaid';

const event: Event<'guildMemberAdd'> = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    await handleWelcome(client, member);
    await handleAutoRole(client, member);
    await handleRaidCheck(client, member);
  },
};

export default event;
