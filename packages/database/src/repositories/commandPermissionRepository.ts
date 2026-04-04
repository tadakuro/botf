import { CommandPermissionModel, ICommandPermission } from '../schemas/CommandPermission';

export async function getPermission(
  guildId: string,
  target: string,
): Promise<ICommandPermission | null> {
  return CommandPermissionModel.findOne({ guildId, target }).exec();
}

export async function getAllPermissions(guildId: string): Promise<ICommandPermission[]> {
  return CommandPermissionModel.find({ guildId }).exec();
}

export async function upsertPermission(
  guildId: string,
  target: string,
  targetType: 'category' | 'command',
  data: Partial<ICommandPermission>,
): Promise<ICommandPermission> {
  const doc = await CommandPermissionModel.findOneAndUpdate(
    { guildId, target },
    { $set: { ...data, targetType } },
    { upsert: true, new: true },
  ).exec();
  return doc as ICommandPermission;
}

export async function canUseCommand(
  guildId: string,
  commandName: string,
  category: string,
  memberRoleIds: string[],
): Promise<{ allowed: boolean; reason?: string }> {
  const cmdPerm = await CommandPermissionModel.findOne({
    guildId,
    target: commandName,
    targetType: 'command',
  }).exec();

  if (cmdPerm) {
    if (!cmdPerm.enabled) {
      return { allowed: false, reason: 'This command is disabled in this server.' };
    }
    if (cmdPerm.deniedRoles.some((r: string) => memberRoleIds.includes(r))) {
      return { allowed: false, reason: 'Your role is not allowed to use this command.' };
    }
    if (
      cmdPerm.allowedRoles.length > 0 &&
      !cmdPerm.allowedRoles.some((r: string) => memberRoleIds.includes(r))
    ) {
      return { allowed: false, reason: 'Your role is not allowed to use this command.' };
    }
  }

  const catPerm = await CommandPermissionModel.findOne({
    guildId,
    target: category,
    targetType: 'category',
  }).exec();

  if (catPerm) {
    if (!catPerm.enabled) {
      return { allowed: false, reason: `The ${category} category is disabled in this server.` };
    }
    if (catPerm.deniedRoles.some((r: string) => memberRoleIds.includes(r))) {
      return { allowed: false, reason: 'Your role is not allowed to use this category.' };
    }
    if (
      catPerm.allowedRoles.length > 0 &&
      !catPerm.allowedRoles.some((r: string) => memberRoleIds.includes(r))
    ) {
      return { allowed: false, reason: 'Your role is not allowed to use this category.' };
    }
  }

  return { allowed: true };
}
