import { BotClient } from '../client';
import { BackupModel } from '../../../packages/database/src/schemas/Backup';
import { loadBackup } from '../services/backupService';
import { logger } from '../utils/logger';

export function startBackupRestoreLoop(client: BotClient): void {
  setInterval(async () => {
    try {
      const pending = await BackupModel.find({ 'pendingRestore.requestedAt': { $exists: true } }).limit(5);
      for (const backup of pending) {
        const pr = (backup as any).pendingRestore;
        if (!pr) continue;
        const guild = client.guilds.cache.get(backup.guildId);
        if (!guild) continue;

        logger.info(`[Backup] Processing pending restore "${backup.label}" for ${guild.name}`);
        const options = {
          restoreRoles: pr.options?.restoreRoles ?? false,
          restoreChannels: pr.options?.restoreChannels ?? false,
          restoreBans: pr.options?.restoreBans ?? false,
          restoreSettings: pr.options?.restoreSettings ?? false,
          restoreEmojis: pr.options?.restoreEmojis ?? false,
          restoreBotforgeSettings: pr.options?.restoreBotforgeSettings ?? false,
        };

        try {
          const result = await loadBackup(client, guild, backup._id.toString(), options);
          logger.info(`[Backup] Done. Restored: ${result.restored.join(', ')}`);
          if (result.errors.length) logger.warn(`[Backup] Errors: ${result.errors.join(', ')}`);
        } catch (err) {
          logger.error('[Backup] Restore failed:', err);
        }

        await BackupModel.findByIdAndUpdate(backup._id, { $unset: { pendingRestore: 1 } });
      }
    } catch (err) {
      logger.error('[Backup] Loop error:', err);
    }
  }, 60_000);
}
