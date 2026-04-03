import { BackupModel, IBackup } from '../schemas/Backup';

export async function createBackup(data: Partial<IBackup>): Promise<IBackup> {
  return BackupModel.create(data);
}

export async function getBackup(backupId: string): Promise<IBackup | null> {
  return BackupModel.findById(backupId);
}

export async function getGuildBackups(guildId: string): Promise<IBackup[]> {
  return BackupModel.find({ guildId })
    .select('_id guildId guildName label createdBy createdAt memberCount')
    .sort({ createdAt: -1 });
}

export async function deleteBackup(backupId: string, guildId: string): Promise<boolean> {
  const result = await BackupModel.deleteOne({ _id: backupId, guildId });
  return result.deletedCount > 0;
}

export async function countGuildBackups(guildId: string): Promise<number> {
  return BackupModel.countDocuments({ guildId });
}
