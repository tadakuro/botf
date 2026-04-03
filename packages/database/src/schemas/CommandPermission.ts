import mongoose, { Schema, model, Document } from 'mongoose';

/**
 * Stores per-guild command permission configuration.
 * - allowedRoles: roles (by ID) that are allowed to use commands in this category/command
 * - deniedRoles: roles explicitly denied
 * - enabled: whether the command/category is enabled at all in this guild
 */
export interface ICommandPermission extends Document {
  guildId: string;
  /** Either a category name (e.g. "moderation") or a specific command name (e.g. "ban") */
  target: string;
  targetType: 'category' | 'command';
  enabled: boolean;
  /** Role IDs allowed to use this command/category (empty = no restriction beyond Discord perms) */
  allowedRoles: string[];
  /** Role IDs explicitly blocked from using this command/category */
  deniedRoles: string[];
}

const CommandPermissionSchema = new Schema<ICommandPermission>({
  guildId: { type: String, required: true },
  target: { type: String, required: true },
  targetType: { type: String, enum: ['category', 'command'], required: true },
  enabled: { type: Boolean, default: true },
  allowedRoles: { type: [String], default: [] },
  deniedRoles: { type: [String], default: [] },
});

CommandPermissionSchema.index({ guildId: 1, target: 1 }, { unique: true });

export const CommandPermissionModel =
  mongoose.models.CommandPermission ||
  model<ICommandPermission>('CommandPermission', CommandPermissionSchema);
