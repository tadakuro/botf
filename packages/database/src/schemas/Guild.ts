import mongoose, { Schema, model, Document } from 'mongoose';

export interface IGuild extends Document {
  guildId: string;
  prefix: string;
  language: string;
  modLogChannel?: string;
  logChannel?: string;
  welcomeChannel?: string;
  welcomeMessage?: string;
  goodbyeChannel?: string;
  goodbyeMessage?: string;
  autoRoles: string[];
  muteRole?: string;
  jailRole?: string;
  jailChannel?: string;
  verificationRole?: string;
  verificationChannel?: string;
  ticketCategory?: string;
  ticketLogChannel?: string;
  starboardChannel?: string;
  starboardThreshold: number;
  levelsEnabled: boolean;
  levelUpChannel?: string;
  levelUpMessage?: string;
  antiNukeEnabled: boolean;
  antiRaidEnabled: boolean;
  autoModEnabled: boolean;
  antiInviteEnabled: boolean;
  antiSpamEnabled: boolean;
  antiHoistEnabled: boolean;
  antiBotEnabled: boolean;
  suggestionChannel?: string;
}

const GuildSchema = new Schema<IGuild>({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  language: { type: String, default: 'en' },
  modLogChannel: String,
  logChannel: String,
  welcomeChannel: String,
  welcomeMessage: String,
  goodbyeChannel: String,
  goodbyeMessage: String,
  autoRoles: { type: [String], default: [] },
  muteRole: String,
  jailRole: String,
  jailChannel: String,
  verificationRole: String,
  verificationChannel: String,
  ticketCategory: String,
  ticketLogChannel: String,
  starboardChannel: String,
  starboardThreshold: { type: Number, default: 3 },
  levelsEnabled: { type: Boolean, default: false },
  levelUpChannel: String,
  levelUpMessage: String,
  antiNukeEnabled: { type: Boolean, default: false },
  antiRaidEnabled: { type: Boolean, default: false },
  autoModEnabled: { type: Boolean, default: false },
  antiInviteEnabled: { type: Boolean, default: false },
  antiSpamEnabled: { type: Boolean, default: false },
  antiHoistEnabled: { type: Boolean, default: false },
  antiBotEnabled: { type: Boolean, default: false },
  suggestionChannel: String,
});

export const GuildModel = mongoose.models.Guild || model<IGuild>('Guild', GuildSchema);
