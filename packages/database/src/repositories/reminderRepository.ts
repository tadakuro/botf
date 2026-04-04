import { ReminderModel, IReminder } from '../schemas/Reminder';

export async function createReminder(data: Partial<IReminder>): Promise<IReminder> {
  const doc = await ReminderModel.create(data);
  return doc as IReminder;
}

export async function getDueReminders(): Promise<IReminder[]> {
  return ReminderModel.find({ remindAt: { $lte: new Date() }, sent: false }).exec();
}

export async function markSent(id: string): Promise<void> {
  await ReminderModel.findByIdAndUpdate(id, { $set: { sent: true } }).exec();
}

export async function getUserReminders(userId: string): Promise<IReminder[]> {
  return ReminderModel.find({ userId, sent: false }).sort({ remindAt: 1 }).exec();
}
