"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OverwriteSchema = new mongoose_1.Schema({ id: String, type: Number, allow: String, deny: String }, { _id: false });
const BackupSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    guildName: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    label: { type: String, required: true },
    memberCount: { type: Number, default: 0 },
    serverSettings: {
        name: String, description: String, iconURL: String, bannerURL: String,
        splashURL: String, verificationLevel: Number, defaultMessageNotifications: Number,
        explicitContentFilter: Number, afkTimeout: Number, afkChannelName: String,
        systemChannelName: String, preferredLocale: String, features: [String],
    },
    botforgeSettings: {
        prefix: String, language: String, modLogChannel: String, logChannel: String,
        welcomeChannel: String, welcomeMessage: String, goodbyeChannel: String,
        goodbyeMessage: String, autoRoles: [String], muteRole: String, jailRole: String,
        antiNukeEnabled: Boolean, antiRaidEnabled: Boolean, autoModEnabled: Boolean,
        antiInviteEnabled: Boolean, antiSpamEnabled: Boolean,
    },
    roles: [{
            _id: false,
            name: String, color: Number, hoist: Boolean, mentionable: Boolean,
            permissions: String, position: Number, icon: String, unicodeEmoji: String,
        }],
    categories: [{
            _id: false,
            name: String, position: Number, permissionOverwrites: [OverwriteSchema],
        }],
    channels: [{
            _id: false,
            name: String, type: Number, topic: String, nsfw: Boolean,
            rateLimitPerUser: Number, position: Number, parentName: String,
            permissionOverwrites: [OverwriteSchema], userLimit: Number, bitrate: Number,
        }],
    emojis: [{
            _id: false,
            name: String, url: String, animated: Boolean, roles: [String],
        }],
    stickers: [{
            _id: false,
            name: String, description: String, url: String,
        }],
    bans: [{
            _id: false,
            userId: String, reason: String,
        }],
    pendingRestore: {
        requestedAt: Date,
        requestedBy: String,
        options: { type: Map, of: Boolean },
    },
});
exports.BackupModel = mongoose_1.default.models.Backup || (0, mongoose_1.model)('Backup', BackupSchema);
