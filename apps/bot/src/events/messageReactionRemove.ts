import { Event } from '../types/Event';
import { handleReactionRemove } from '../modules/reactionRoles';

const event: Event<'messageReactionRemove'> = {
  name: 'messageReactionRemove',
  async execute(client, reaction, user) {
    if (reaction.partial) await reaction.fetch().catch(() => {});
    await handleReactionRemove(client, reaction as any, user as any);
  },
};
export default event;
