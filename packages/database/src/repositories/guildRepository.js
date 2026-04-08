"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuild = getGuild;
exports.upsertGuild = upsertGuild;
const Guild_1 = require("../schemas/Guild");
async function getGuild(guildId) {
    return Guild_1.GuildModel.findOne({ guildId }).exec();
}
async function upsertGuild(guildId, data) {
    const doc = await Guild_1.GuildModel.findOneAndUpdate({ guildId }, { $set: data }, { upsert: true, new: true }).exec();
    return doc;
}
