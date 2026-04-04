import { BackupModel, IBackup } from '../schemas/Backup';

export async function createBackup(data: Partial<IBackup>): Promise<IBackup> {
  const doc = await BackupModel.create(data);
  return doc as IBackup;
}

export async function getBackup(backupId: string): Promise<IBackup | null> {
  return BackupModel.findById(backupId).exec();
}

export async function getGuildBackups(guildId: string): Promise<IBackup[]> {
  return BackupModel.find({ guildId })
    .select('_id label guildName createdBy createdAt memberCount')
    .sort({ createdAt: -1 })
    .exec() as Promise<IBackup[]>;
}

export async function deleteBackup(backupId: string, guildId: string): Promise<boolean> {
  const result = await BackupModel.deleteOne({ _id: backupId, guildId }).exec();
  return result.deletedCount > 0;
}

export async function countGuildBackups(guildId: string): Promise<number> {
  return BackupModel.countDocuments({ guildId }).exec();
}
