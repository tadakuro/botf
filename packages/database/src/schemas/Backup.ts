import mongoose, { Schema, model, Document } from 'mongoose';

export interface IBackupRole {
  name: string;
  color: number;
  hoist: boolean;
  mentionable: boolean;
  permissions: string; // bitfield string
  position: number;
  icon: string | null;
  unicodeEmoji: string | null;
}

export interface IBackupChannelOverwrite {
  id: string;          // role/user id
  type: number;        // 0 = role, 1 = member
  allow: string;       // permission bitfield
  deny: string;
}

export interface IBackupChannel {
  name: string;
  type: number;
  topic?: string;
  nsfw?: boolean;
  rateLimitPerUser?: number;
  position: number;
  parentName?: string; // category name this belongs to
  permissionOverwrites: IBackupChannelOverwrite[];
  userLimit?: number;  // voice
  bitrate?: number;    // voice
}

export interface IBackupCategory {
  name: string;
  position: number;
  permissionOverwrites: IBackupChannelOverwrite[];
}

export interface IBackupEmoji {
  name: string;
  url: string;
  animated: boolean;
  roles: string[]; // role names that can use it
}

export interface IBackupSticker {
  name: string;
  description: string | null;
  url: string;
}

export interface IBackupBan {
  userId: string;
  reason: string | null;
}

export interface IBackupServerSettings {
  name: string;
  description: string | null;
  iconURL: string | null;
  bannerURL: string | null;
  splashURL: string | null;
  verificationLevel: number;
  defaultMessageNotifications: number;
  explicitContentFilter: number;
  afkTimeout: number;
  afkChannelName: string | null;
  systemChannelName: string | null;
  preferredLocale: string;
  features: string[];
}

export interface IBackupBotforgeSettings {
  prefix: string;
  language: string;
  modLogChannel: string | null;
  logChannel: string | null;
  welcomeChannel: string | null;
  welcomeMessage: string | null;
  goodbyeChannel: string | null;
  goodbyeMessage: string | null;
  autoRoles: string[];   // role names
  muteRole: string | null;
  jailRole: string | null;
  antiNukeEnabled: boolean;
  antiRaidEnabled: boolean;
  autoModEnabled: boolean;
  antiInviteEnabled: boolean;
  antiSpamEnabled: boolean;
}

export interface IBackup extends Document {
  guildId: string;
  guildName: string;
  createdBy: string;      // Discord user ID
  createdAt: Date;
  label: string;          // user-given name
  serverSettings: IBackupServerSettings;
  botforgeSettings: IBackupBotforgeSettings;
  roles: IBackupRole[];
  categories: IBackupCategory[];
  channels: IBackupChannel[];
  emojis: IBackupEmoji[];
  stickers: IBackupSticker[];
  bans: IBackupBan[];
  memberCount: number;
  pendingRestore?: {
    requestedAt: Date;
    requestedBy: string;
    options: Record<string, boolean>;
  };
}

const OverwriteSchema = new Schema<IBackupChannelOverwrite>(
  { id: String, type: Number, allow: String, deny: String },
  { _id: false },
);

const BackupSchema = new Schema<IBackup>({
  guildId:       { type: String, required: true },
  guildName:     { type: String, required: true },
  createdBy:     { type: String, required: true },
  createdAt:     { type: Date, default: Date.now },
  label:         { type: String, required: true },
  memberCount:   { type: Number, default: 0 },

  serverSettings: {
    name: String, description: String, iconURL: String, bannerURL: String,
    splashURL: String, verificationLevel: Number, defaultMessageNotifications: Number,
    explicitContentFilter: Number, afkTimeout: Number, afkChannelName: String,
    systemChannelName: String, preferredLocale: String, features: [String],
  },

  botforgeSettings: {
    prefix: String, language: String, modLogChannel: String, logChannel: String,
    welcomeChannel: String, welcomeMessage: String, goodbyeChannel: String,
    goodbyeMessage: String, autoRoles: [String], muteRole: String, jailRole: String,
    antiNukeEnabled: Boolean, antiRaidEnabled: Boolean, autoModEnabled: Boolean,
    antiInviteEnabled: Boolean, antiSpamEnabled: Boolean,
  },

  roles: [{
    _id: false,
    name: String, color: Number, hoist: Boolean, mentionable: Boolean,
    permissions: String, position: Number, icon: String, unicodeEmoji: String,
  }],

  categories: [{
    _id: false,
    name: String, position: Number, permissionOverwrites: [OverwriteSchema],
  }],

  channels: [{
    _id: false,
    name: String, type: Number, topic: String, nsfw: Boolean,
    rateLimitPerUser: Number, position: Number, parentName: String,
    permissionOverwrites: [OverwriteSchema], userLimit: Number, bitrate: Number,
  }],

  emojis: [{
    _id: false,
    name: String, url: String, animated: Boolean, roles: [String],
  }],

  stickers: [{
    _id: false,
    name: String, description: String, url: String,
  }],

  bans: [{
    _id: false,
    userId: String, reason: String,
  }],

  pendingRestore: {
    requestedAt: Date,
    requestedBy: String,
    options: { type: Map, of: Boolean },
  },
});

export const BackupModel = mongoose.models.Backup || model<IBackup>('Backup', BackupSchema);
