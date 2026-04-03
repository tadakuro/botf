import mongoose, { Schema, model, Document } from 'mongoose';
export interface IGiveaway extends Document { guildId:string; channelId:string; messageId:string; prize:string; winnerCount:number; endsAt:Date; ended:boolean; hostedBy:string; }
const GiveawaySchema = new Schema<IGiveaway>({ guildId:String, channelId:String, messageId:String, prize:String, winnerCount:{ type:Number, default:1 }, endsAt:Date, ended:{ type:Boolean, default:false }, hostedBy:String });
export const GiveawayModel = mongoose.models.Giveaway || model<IGiveaway>('Giveaway', GiveawaySchema);
