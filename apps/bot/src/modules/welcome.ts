import { GuildMember, Message, TextChannel } from 'discord.js';
import { BotClient } from '../client';
import { GuildModel } from '../services/cacheService';
import { logger } from '../utils/logger';

export async function handleWelcome(client: BotClient, member: GuildMember): Promise<void> {
  try {
    const settings = await GuildModel.findOne({ guildId: member.guild.id });
    if (!settings?.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(settings.welcomeChannel) as TextChannel;
    if (!channel) return;

    const message = (settings.welcomeMessage ?? 'Welcome {user} to **{server}**!')
      .replace('{user}', `<@${member.id}>`)
      .replace('{username}', member.user.username)
      .replace('{server}', member.guild.name)
      .replace('{memberCount}', member.guild.memberCount.toString());

    await channel.send(message);
  } catch (err) {
    logger.error('handleWelcome error:', err);
  }
}

export async function handleAutoRole(client: BotClient, member: GuildMember): Promise<void> {
  try {
    const settings = await GuildModel.findOne({ guildId: member.guild.id });
    if (!settings?.autoRoles?.length) return;

    for (const roleId of settings.autoRoles) {
      const role = member.guild.roles.cache.get(roleId);
      if (role) await member.roles.add(role, 'Auto-role').catch(() => {});
    }
  } catch (err) {
    logger.error('handleAutoRole error:', err);
  }
}

export async function handleAfk(client: BotClient, message: Message): Promise<void> {
  if (!message.guild || message.author.bot) return;

  // Clear AFK if they sent a message
  if (client.afkUsers.has(message.author.id)) {
    client.afkUsers.delete(message.author.id);
    await message.reply({ content: `Welcome back, <@${message.author.id}>! Your AFK has been removed.` }).catch(() => {});
  }

  // Notify if mentioning an AFK user
  for (const mentioned of message.mentions.users.values()) {
    const afk = client.afkUsers.get(mentioned.id);
    if (afk) {
      await message.reply({
        content: `<@${mentioned.id}> is AFK: **${afk.reason}** (<t:${Math.floor(afk.time / 1000)}:R>)`,
      }).catch(() => {});
    }
  }
}
