import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase(uri?: string): Promise<void> {
  if (isConnected) return;
  const mongoUri = uri ?? process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(mongoUri);
  isConnected = true;
}
