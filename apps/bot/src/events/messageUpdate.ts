import { Event } from '../types/Event';

const event: Event<'messageUpdate'> = {
  name: 'messageUpdate',
  async execute(client, oldMessage, newMessage) {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const existing = client.editSnipes.get(oldMessage.channelId) ?? [];
    existing.unshift({
      oldContent: oldMessage.content,
      newContent: newMessage.content,
      author: oldMessage.author,
      editedAt: new Date(),
    });
    client.editSnipes.set(oldMessage.channelId, existing.slice(0, 10));
  },
};

export default event;
