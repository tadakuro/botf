import { CommandPermissionModel, ICommandPermission } from '../schemas/CommandPermission';

export async function getPermission(
  guildId: string,
  target: string,
): Promise<ICommandPermission | null> {
  const Model = CommandPermissionModel as any;
  return (await Model.findOne({ guildId, target }).exec()) as ICommandPermission | null;
}

export async function getAllPermissions(guildId: string): Promise<ICommandPermission[]> {
  const Model = CommandPermissionModel as any;
  return (await Model.find({ guildId }).exec()) as ICommandPermission[];
}

export async function upsertPermission(
  guildId: string,
  target: string,
  targetType: 'category' | 'command',
  data: Partial<ICommandPermission>,
): Promise<ICommandPermission> {
  const Model = CommandPermissionModel as any;
  const doc = await Model.findOneAndUpdate(
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
  const Model = CommandPermissionModel as any;
  const cmdPerm = await Model.findOne({
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

  const catPerm = await Model.findOne({
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
