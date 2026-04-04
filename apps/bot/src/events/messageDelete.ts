import { Event } from '../types/Event';
import { logEvent } from '../modules/logging';

const event: Event<'messageDelete'> = {
  name: 'messageDelete',
  async execute(client, message) {
    if (!message.guild || message.author?.bot) return;
    const existing = client.snipes.get(message.channelId) ?? [];
    existing.unshift({
      content: message.content,
      author: message.author,
      attachments: [...message.attachments.values()],
      deletedAt: new Date(),
    });
    client.snipes.set(message.channelId, existing.slice(0, 10));
    await logEvent(client, message.guild, '🗑️ Message Deleted', `**Author:** <@${message.author?.id}>\n**Channel:** <#${message.channelId}>\n**Content:** ${message.content?.slice(0, 500) || '*empty*'}`, 0xe74c3c);
  },
};
export default event;
