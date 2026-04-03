import mongoose, { Schema, model, Document } from 'mongoose';
export interface IWarning extends Document {
  guildId: string; userId: string; moderatorId: string; reason: string; createdAt: Date;
}
const WarningSchema = new Schema<IWarning>({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, default: 'No reason provided' },
  createdAt: { type: Date, default: Date.now },
});
export const WarningModel = mongoose.models.Warning || model<IWarning>('Warning', WarningSchema);
