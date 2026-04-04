import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import { Command } from './types/Command';
import { Event } from './types/Event';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { logger } from './utils/logger';

export class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public cooldowns: Collection<string, Collection<string, number>> = new Collection();
  public snipes: Collection<string, any[]> = new Collection();
  public editSnipes: Collection<string, any[]> = new Collection();
  public afkUsers: Collection<string, { reason: string; time: number }> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User,
        Partials.GuildScheduledEvent,
      ],
    });
  }

  async initialize(): Promise<void> {
    await loadCommands(this);
    await loadEvents(this);
    logger.info('BotClient initialized');
  }
}
