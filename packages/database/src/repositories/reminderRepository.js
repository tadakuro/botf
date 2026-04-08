"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReminder = createReminder;
exports.getDueReminders = getDueReminders;
exports.markSent = markSent;
exports.getUserReminders = getUserReminders;
const Reminder_1 = require("../schemas/Reminder");
async function createReminder(data) {
    const doc = await Reminder_1.ReminderModel.create(data);
    return doc;
}
async function getDueReminders() {
    return Reminder_1.ReminderModel.find({ remindAt: { $lte: new Date() }, sent: false }).exec();
}
async function markSent(id) {
    await Reminder_1.ReminderModel.findByIdAndUpdate(id, { $set: { sent: true } }).exec();
}
async function getUserReminders(userId) {
    return Reminder_1.ReminderModel.find({ userId, sent: false }).sort({ remindAt: 1 }).exec();
}
