import { WarningModel, IWarning } from '../schemas/Warning';
export async function addWarning(guildId: string, userId: string, moderatorId: string, reason: string) { return WarningModel.create({ guildId, userId, moderatorId, reason }); }
export async function getWarnings(guildId: string, userId: string) { return WarningModel.find({ guildId, userId }).sort({ createdAt: -1 }); }
export async function countWarnings(guildId: string, userId: string) { return WarningModel.countDocuments({ guildId, userId }); }
export async function clearWarnings(guildId: string, userId: string) { await WarningModel.deleteMany({ guildId, userId }); }
