import { BotClient } from '../client';
import { ReminderModel } from '../services/cacheService';
import { logger } from '../utils/logger';

export async function startReminderLoop(client: BotClient): Promise<void> {
  setInterval(async () => {
    try {
      const due = await ReminderModel.find({ remindAt: { $lte: new Date() }, sent: false });
      for (const reminder of due) {
        const user = await client.users.fetch(reminder.userId).catch(() => null);
        if (user) {
          await user.send(`⏰ Reminder: **${reminder.reason}**`).catch(() => {});
        }
        await ReminderModel.findByIdAndUpdate(reminder._id, { sent: true });
      }
    } catch (err) {
      logger.error('reminderLoop error:', err);
    }
  }, 60_000);
}
