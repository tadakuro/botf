import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { logger } from './utils/logger';

async function deploy() {
  const commands: any[] = [];
  const commandsPath = join(__dirname, 'commands');

  for (const category of readdirSync(commandsPath)) {
    const categoryPath = join(commandsPath, category);
    if (!statSync(categoryPath).isDirectory()) continue;
    for (const file of readdirSync(categoryPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
      const { default: cmd } = await import(join(categoryPath, file));
      if (cmd?.data) commands.push(cmd.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const clientId = process.env.CLIENT_ID!;
  const guildId = process.env.GUILD_ID;

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    logger.info(`Deployed ${commands.length} commands to guild ${guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    logger.info(`Deployed ${commands.length} commands globally`);
  }
}

deploy().catch(console.error);
