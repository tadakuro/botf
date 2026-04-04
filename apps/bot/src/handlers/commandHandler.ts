import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { BotClient } from '../client';
import { Command } from '../types/Command';
import { logger } from '../utils/logger';

export async function loadCommands(client: BotClient): Promise<void> {
  const commandsPath = join(__dirname, '../commands');
  const categories = readdirSync(commandsPath);

  let loaded = 0;
  for (const category of categories) {
    const categoryPath = join(commandsPath, category);
    if (!statSync(categoryPath).isDirectory()) continue;

    const files = readdirSync(categoryPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
    for (const file of files) {
      try {
        const { default: command }: { default: Command } = await import(join(categoryPath, file));
        if (!command?.data?.name) {
          logger.warn(`Command file ${file} is missing data.name, skipping.`);
          continue;
        }
        command.category = category;
        client.commands.set(command.data.name, command);
        loaded++;
      } catch (err) {
        logger.error(`Failed to load command ${file}:`, err);
      }
    }
  }
  logger.info(`Loaded ${loaded} commands`);
}
