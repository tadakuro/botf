import { WarningModel, IWarning } from '../schemas/Warning';

export async function addWarning(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string,
): Promise<IWarning> {
  const doc = await WarningModel.create({ guildId, userId, moderatorId, reason });
  return doc as IWarning;
}

export async function getWarnings(guildId: string, userId: string): Promise<IWarning[]> {
  return WarningModel.find({ guildId, userId }).sort({ createdAt: -1 }).exec();
}

export async function countWarnings(guildId: string, userId: string): Promise<number> {
  return WarningModel.countDocuments({ guildId, userId }).exec();
}

export async function clearWarnings(guildId: string, userId: string): Promise<void> {
  await WarningModel.deleteMany({ guildId, userId }).exec();
}
