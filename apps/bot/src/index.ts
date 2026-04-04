import 'dotenv/config';
import { BotClient } from './client';
import { connectDatabase } from './config';
import { logger } from './utils/logger';
import { startReminderLoop } from './modules/reminders';
import { startBackupRestoreLoop } from './modules/backup';

async function main() {
  try {
    await connectDatabase();
    const client = new BotClient();
    await client.initialize();
    await client.login(process.env.DISCORD_TOKEN!);

    client.once('ready', () => {
      startReminderLoop(client);
      startBackupRestoreLoop(client);
      logger.info('Background loops started');
    });
  } catch (error) {
    logger.error('Fatal error during startup:', error);
    process.exit(1);
  }
}

main();
