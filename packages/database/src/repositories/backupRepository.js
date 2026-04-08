"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBackup = createBackup;
exports.getBackup = getBackup;
exports.getGuildBackups = getGuildBackups;
exports.deleteBackup = deleteBackup;
exports.countGuildBackups = countGuildBackups;
const Backup_1 = require("../schemas/Backup");
async function createBackup(data) {
    const doc = await Backup_1.BackupModel.create(data);
    return doc;
}
async function getBackup(backupId) {
    return Backup_1.BackupModel.findById(backupId).exec();
}
async function getGuildBackups(guildId) {
    return Backup_1.BackupModel.find({ guildId })
        .select('_id label guildName createdBy createdAt memberCount')
        .sort({ createdAt: -1 })
        .exec();
}
async function deleteBackup(backupId, guildId) {
    const result = await Backup_1.BackupModel.deleteOne({ _id: backupId, guildId }).exec();
    return result.deletedCount > 0;
}
async function countGuildBackups(guildId) {
    return Backup_1.BackupModel.countDocuments({ guildId }).exec();
}
