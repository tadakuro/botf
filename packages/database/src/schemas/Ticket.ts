import mongoose, { Schema, model, Document } from 'mongoose';
export interface ITicket extends Document { guildId:string; channelId:string; userId:string; closed:boolean; createdAt:Date; }
const TicketSchema = new Schema<ITicket>({ guildId:String, channelId:String, userId:String, closed:{ type:Boolean, default:false }, createdAt:{ type:Date, default:Date.now } });
export const TicketModel = mongoose.models.Ticket || model<ITicket>('Ticket', TicketSchema);
