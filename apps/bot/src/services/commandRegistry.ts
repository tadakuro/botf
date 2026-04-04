import { BotClient } from '../client';
import { Command } from '../types/Command';

export class CommandRegistry {
  constructor(private client: BotClient) {}

  get(name: string): Command | undefined {
    return this.client.commands.get(name);
  }

  getAll(): Command[] {
    return [...this.client.commands.values()];
  }

  getByCategory(category: string): Command[] {
    return this.getAll().filter(c => c.category === category);
  }

  has(name: string): boolean {
    return this.client.commands.has(name);
  }
}
