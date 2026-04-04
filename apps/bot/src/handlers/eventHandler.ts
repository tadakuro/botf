import { readdirSync } from 'fs';
import { join } from 'path';
import { BotClient } from '../client';
import { Event } from '../types/Event';
import { logger } from '../utils/logger';

export async function loadEvents(client: BotClient): Promise<void> {
  const eventsPath = join(__dirname, '../events');
  const files = readdirSync(eventsPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

  let loaded = 0;
  for (const file of files) {
    try {
      const { default: event }: { default: Event } = await import(join(eventsPath, file));
      if (!event?.name) {
        logger.warn(`Event file ${file} missing name, skipping.`);
        continue;
      }
      const listener = (...args: any[]) => event.execute(client, ...args);
      if (event.once) {
        client.once(event.name as string, listener);
      } else {
        client.on(event.name as string, listener);
      }
      loaded++;
    } catch (err) {
      logger.error(`Failed to load event ${file}:`, err);
    }
  }
  logger.info(`Loaded ${loaded} events`);
}
