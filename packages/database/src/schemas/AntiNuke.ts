import mongoose, { Schema, model, Document } from 'mongoose';
export interface IAntiNuke extends Document {
  guildId: string; enabled: boolean; whitelist: string[];
  punishment: 'ban'|'kick'|'strip'|'deafen';
  thresholds: { ban:number; kick:number; channelDelete:number; channelCreate:number; roleDelete:number; roleCreate:number; webhookCreate:number; };
}
const AntiNukeSchema = new Schema<IAntiNuke>({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  whitelist: [String],
  punishment: { type: String, enum: ['ban','kick','strip','deafen'], default: 'ban' },
  thresholds: {
    ban: { type: Number, default: 3 }, kick: { type: Number, default: 3 },
    channelDelete: { type: Number, default: 3 }, channelCreate: { type: Number, default: 5 },
    roleDelete: { type: Number, default: 3 }, roleCreate: { type: Number, default: 5 },
    webhookCreate: { type: Number, default: 3 },
  },
});
export const AntiNukeModel = mongoose.models.AntiNuke || model<IAntiNuke>('AntiNuke', AntiNukeSchema);
