import mongoose, { Schema, model, Document } from 'mongoose';
export interface ILevel extends Document { guildId:string; userId:string; xp:number; level:number; }
const LevelSchema = new Schema<ILevel>({ guildId:String, userId:String, xp:{ type:Number, default:0 }, level:{ type:Number, default:0 } });
export const LevelModel = mongoose.models.Level || model<ILevel>('Level', LevelSchema);
