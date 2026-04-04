import { Event } from '../types/Event';
import { autoModCheck } from '../modules/autoMod';
import { antiSpamCheck } from '../modules/antiRaid';
import { handleAfk } from '../modules/welcome';
import { handleXp } from '../modules/leveling';

const event: Event<'messageCreate'> = {
  name: 'messageCreate',
  async execute(client, message) {
    if (message.author.bot || !message.guild) return;
    await Promise.all([
      autoModCheck(client, message),
      antiSpamCheck(client, message),
      handleAfk(client, message),
      handleXp(client, message),
    ]);
  },
};

export default event;
