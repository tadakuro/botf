import { WarningModel, IWarning } from '../schemas/Warning';

export async function addWarning(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason: string,
): Promise<IWarning> {
  const Model = WarningModel as any;
  const doc = await Model.create({ guildId, userId, moderatorId, reason });
  return doc as IWarning;
}

export async function getWarnings(guildId: string, userId: string): Promise<IWarning[]> {
  const Model = WarningModel as any;
  return (await Model.find({ guildId, userId }).sort({ createdAt: -1 }).exec()) as IWarning[];
}

export async function countWarnings(guildId: string, userId: string): Promise<number> {
  const Model = WarningModel as any;
  return (await Model.countDocuments({ guildId, userId }).exec()) as number;
}

export async function clearWarnings(guildId: string, userId: string): Promise<void> {
  const Model = WarningModel as any;
  await Model.deleteMany({ guildId, userId }).exec();
}
