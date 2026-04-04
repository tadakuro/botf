import mongoose from 'mongoose';
import { logger } from './utils/logger';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(uri);
}

export const config = {
  token: process.env.DISCORD_TOKEN!,
  clientId: process.env.CLIENT_ID!,
  guildId: process.env.GUILD_ID,
  ownerIds: (process.env.OWNER_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean),
  mongoUri: process.env.MONGODB_URI!,
};
