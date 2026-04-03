import mongoose, { Schema, model, Document } from 'mongoose';
export interface IReminder extends Document { userId:string; guildId?:string; reason:string; remindAt:Date; sent:boolean; }
const ReminderSchema = new Schema<IReminder>({ userId:String, guildId:String, reason:String, remindAt:Date, sent:{ type:Boolean, default:false } });
export const ReminderModel = mongoose.models.Reminder || model<IReminder>('Reminder', ReminderSchema);
