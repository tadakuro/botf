import { BackupModel, IBackup } from '../schemas/Backup';

export async function createBackup(data: Partial<IBackup>): Promise<IBackup> {
  const Model = BackupModel as any;
  const doc = await Model.create(data);
  return doc as IBackup;
}

export async function getBackup(backupId: string): Promise<IBackup | null> {
  const Model = BackupModel as any;
  const doc = await Model.findById(backupId).exec();
  return doc as IBackup | null;
}

export async function getGuildBackups(guildId: string): Promise<IBackup[]> {
  const Model = BackupModel as any;
  const doc = await Model.find({ guildId }).select('_id label guildName createdBy createdAt memberCount').sort({ createdAt: -1 }).exec();
  return doc as IBackup[];
}

export async function deleteBackup(backupId: string, guildId: string): Promise<boolean> {
  const Model = BackupModel as any;
  const result = await Model.deleteOne({ _id: backupId, guildId }).exec() as any;
  return result.deletedCount > 0;
}

export async function countGuildBackups(guildId: string): Promise<number> {
  const Model = BackupModel as any;
  return await Model.countDocuments({ guildId }).exec() as number;
}
