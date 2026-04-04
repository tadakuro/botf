import { Event } from '../types/Event';
import { handleReactionAdd } from '../modules/reactionRoles';
import { handleStarboard } from '../modules/starboard';

const event: Event<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  async execute(client, reaction, user) {
    if (reaction.partial) await reaction.fetch().catch(() => {});
    if (reaction.message.partial) await reaction.message.fetch().catch(() => {});
    await handleReactionAdd(client, reaction as any, user as any);
    await handleStarboard(client, reaction as any, user as any);
  },
};
export default event;
