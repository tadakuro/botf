import { ClientEvents } from 'discord.js';
import { BotClient } from '../client';

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute(client: BotClient, ...args: ClientEvents[K]): Promise<void>;
}
