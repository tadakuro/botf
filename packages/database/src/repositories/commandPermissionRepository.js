"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermission = getPermission;
exports.getAllPermissions = getAllPermissions;
exports.upsertPermission = upsertPermission;
exports.canUseCommand = canUseCommand;
const CommandPermission_1 = require("../schemas/CommandPermission");
async function getPermission(guildId, target) {
    return CommandPermission_1.CommandPermissionModel.findOne({ guildId, target }).exec();
}
async function getAllPermissions(guildId) {
    return CommandPermission_1.CommandPermissionModel.find({ guildId }).exec();
}
async function upsertPermission(guildId, target, targetType, data) {
    const doc = await CommandPermission_1.CommandPermissionModel.findOneAndUpdate({ guildId, target }, { $set: { ...data, targetType } }, { upsert: true, new: true }).exec();
    return doc;
}
async function canUseCommand(guildId, commandName, category, memberRoleIds) {
    const cmdPerm = await CommandPermission_1.CommandPermissionModel.findOne({
        guildId,
        target: commandName,
        targetType: 'command',
    }).exec();
    if (cmdPerm) {
        if (!cmdPerm.enabled) {
            return { allowed: false, reason: 'This command is disabled in this server.' };
        }
        if (cmdPerm.deniedRoles.some((r) => memberRoleIds.includes(r))) {
            return { allowed: false, reason: 'Your role is not allowed to use this command.' };
        }
        if (cmdPerm.allowedRoles.length > 0 &&
            !cmdPerm.allowedRoles.some((r) => memberRoleIds.includes(r))) {
            return { allowed: false, reason: 'Your role is not allowed to use this command.' };
        }
    }
    const catPerm = await CommandPermission_1.CommandPermissionModel.findOne({
        guildId,
        target: category,
        targetType: 'category',
    }).exec();
    if (catPerm) {
        if (!catPerm.enabled) {
            return { allowed: false, reason: `The ${category} category is disabled in this server.` };
        }
        if (catPerm.deniedRoles.some((r) => memberRoleIds.includes(r))) {
            return { allowed: false, reason: 'Your role is not allowed to use this category.' };
        }
        if (catPerm.allowedRoles.length > 0 &&
            !catPerm.allowedRoles.some((r) => memberRoleIds.includes(r))) {
            return { allowed: false, reason: 'Your role is not allowed to use this category.' };
        }
    }
    return { allowed: true };
}
