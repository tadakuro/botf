export const env = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
  MONGODB_URI: process.env.MONGODB_URI!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  OWNER_IDS: (process.env.OWNER_IDS ?? '').split(',').map((s: string) => s.trim()).filter(Boolean),
};
