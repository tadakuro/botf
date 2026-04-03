import { ReminderModel } from '../schemas/Reminder';
export async function createReminder(data: any) { return ReminderModel.create(data); }
export async function getDueReminders() { return ReminderModel.find({ remindAt: { $lte: new Date() }, sent: false }); }
export async function markSent(id: string) { await ReminderModel.findByIdAndUpdate(id, { $set: { sent: true } }); }
export async function getUserReminders(userId: string) { return ReminderModel.find({ userId, sent: false }).sort({ remindAt: 1 }); }
