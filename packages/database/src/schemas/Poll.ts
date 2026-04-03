import mongoose, { Schema, model, Document } from 'mongoose';
export interface IPoll extends Document { guildId:string; channelId:string; messageId:string; question:string; options:string[]; endsAt:Date; ended:boolean; }
const PollSchema = new Schema<IPoll>({ guildId:String, channelId:String, messageId:String, question:String, options:[String], endsAt:Date, ended:{ type:Boolean, default:false } });
export const PollModel = mongoose.models.Poll || model<IPoll>('Poll', PollSchema);
