"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWarning = addWarning;
exports.getWarnings = getWarnings;
exports.countWarnings = countWarnings;
exports.clearWarnings = clearWarnings;
const Warning_1 = require("../schemas/Warning");
async function addWarning(guildId, userId, moderatorId, reason) {
    const doc = await Warning_1.WarningModel.create({ guildId, userId, moderatorId, reason });
    return doc;
}
async function getWarnings(guildId, userId) {
    return Warning_1.WarningModel.find({ guildId, userId }).sort({ createdAt: -1 }).exec();
}
async function countWarnings(guildId, userId) {
    return Warning_1.WarningModel.countDocuments({ guildId, userId }).exec();
}
async function clearWarnings(guildId, userId) {
    await Warning_1.WarningModel.deleteMany({ guildId, userId }).exec();
}
