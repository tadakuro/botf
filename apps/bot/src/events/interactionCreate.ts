import { ChatInputCommandInteraction, Collection } from 'discord.js';
import { Event } from '../types/Event';
import { handleComponent } from '../handlers/componentHandler';
import { handleModal } from '../handlers/modalHandler';
import { errorEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import { config } from '../config';
import { canUseCommand } from '@botforge/database';

const event: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Owner only
      if (command.ownerOnly && !config.ownerIds.includes(interaction.user.id)) {
        await interaction.reply({ embeds: [errorEmbed('This command is owner-only.')], ephemeral: true });
        return;
      }

      // Role-based + per-command permission check (skip for owners)
      if (interaction.inCachedGuild() && !config.ownerIds.includes(interaction.user.id)) {
        const memberRoleIds = [...interaction.member.roles.cache.keys()];
        const { allowed, reason } = await canUseCommand(
          interaction.guild.id,
          interaction.commandName,
          command.category ?? 'utility',
          memberRoleIds,
        );
        if (!allowed) {
          await interaction.reply({ embeds: [errorEmbed(reason ?? 'You are not allowed to use this command.')], ephemeral: true });
          return;
        }
      }

      // User Discord permissions
      if (command.userPermissions && interaction.inCachedGuild()) {
        const missing = command.userPermissions.filter(p => !interaction.member.permissions.has(p));
        if (missing.length) {
          await interaction.reply({ embeds: [errorEmbed(`You need: ${missing.join(', ')}`)], ephemeral: true });
          return;
        }
      }

      // Bot permissions
      if (command.botPermissions && interaction.inCachedGuild()) {
        const missing = command.botPermissions.filter(p => !interaction.guild.members.me!.permissions.has(p));
        if (missing.length) {
          await interaction.reply({ embeds: [errorEmbed(`I need: ${missing.join(', ')}`)], ephemeral: true });
          return;
        }
      }

      // Cooldown
      const cooldown = command.cooldown ?? 3;
      if (!client.cooldowns.has(command.data.name)) client.cooldowns.set(command.data.name, new Collection());
      const timestamps = client.cooldowns.get(command.data.name)!;
      const now = Date.now();
      const cooldownMs = cooldown * 1000;
      if (timestamps.has(interaction.user.id)) {
        const expiry = timestamps.get(interaction.user.id)! + cooldownMs;
        if (now < expiry) {
          await interaction.reply({ embeds: [errorEmbed(`Please wait **${((expiry - now) / 1000).toFixed(1)}s** before using this again.`)], ephemeral: true });
          return;
        }
      }
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownMs);

      try {
        await command.execute(interaction as ChatInputCommandInteraction, client);
      } catch (err) {
        logger.error(`Command error [${interaction.commandName}]:`, err);
        const e = errorEmbed('An unexpected error occurred.');
        if (interaction.replied || interaction.deferred) await interaction.followUp({ embeds: [e], ephemeral: true });
        else await interaction.reply({ embeds: [e], ephemeral: true });
      }

    } else if (interaction.isButton() || interaction.isStringSelectMenu()) {
      await handleComponent(client, interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModal(client, interaction);
    }
  },
};

export default event;
