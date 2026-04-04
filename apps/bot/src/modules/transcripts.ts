import { TextChannel, AttachmentBuilder } from 'discord.js';
import { BotClient } from '../client';
import { logger } from '../utils/logger';

export async function generateTranscript(client: BotClient, channel: TextChannel, logChannelId?: string): Promise<void> {
  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const sorted = [...messages.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    const lines = sorted.map(m => {
      const time = new Date(m.createdTimestamp).toISOString();
      const attachments = m.attachments.map(a => `[Attachment: ${a.url}]`).join(' ');
      return `[${time}] ${m.author.tag}: ${m.content || ''}${attachments ? ' ' + attachments : ''}`;
    });

    const content = `Transcript for #${channel.name}\nGenerated: ${new Date().toISOString()}\n${'='.repeat(60)}\n${lines.join('\n')}`;
    const buffer = Buffer.from(content, 'utf-8');
    const attachment = new AttachmentBuilder(buffer, { name: `transcript-${channel.name}-${Date.now()}.txt` });

    if (logChannelId) {
      const logChannel = channel.guild.channels.cache.get(logChannelId) as TextChannel;
      if (logChannel) await logChannel.send({ content: `📝 Transcript for <#${channel.id}>`, files: [attachment] });
    } else {
      await channel.send({ content: '📝 Transcript', files: [attachment] });
    }
  } catch (err) {
    logger.error('generateTranscript error:', err);
  }
}
