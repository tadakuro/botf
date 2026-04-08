import { ReminderModel, IReminder } from '../schemas/Reminder';

export async function createReminder(data: Partial<IReminder>): Promise<IReminder> {
  const Model = ReminderModel as any;
  const doc = await Model.create(data);
  return doc as IReminder;
}

export async function getDueReminders(): Promise<IReminder[]> {
  const Model = ReminderModel as any;
  return (await Model.find({ remindAt: { $lte: new Date() }, sent: false }).exec()) as IReminder[];
}

export async function markSent(id: string): Promise<void> {
  const Model = ReminderModel as any;
  await Model.findByIdAndUpdate(id, { $set: { sent: true } }).exec();
}

export async function getUserReminders(userId: string): Promise<IReminder[]> {
  const Model = ReminderModel as any;
  return (await Model.find({ userId, sent: false }).sort({ remindAt: 1 }).exec()) as IReminder[];
}
