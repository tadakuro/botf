import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import { BotClient } from '../client';

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  category?: string;
  ownerOnly?: boolean;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  cooldown?: number;
  execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void>;
}
