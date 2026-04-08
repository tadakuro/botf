"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAntiNuke = getAntiNuke;
exports.upsertAntiNuke = upsertAntiNuke;
const AntiNuke_1 = require("../schemas/AntiNuke");
async function getAntiNuke(guildId) {
    return AntiNuke_1.AntiNukeModel.findOne({ guildId }).exec();
}
async function upsertAntiNuke(guildId, data) {
    const doc = await AntiNuke_1.AntiNukeModel.findOneAndUpdate({ guildId }, { $set: data }, { upsert: true, new: true }).exec();
    return doc;
}
