export const EMBED_COLOR = 0x5865f2;
export const SUCCESS_COLOR = 0x2ecc71;
export const ERROR_COLOR = 0xe74c3c;
export const WARNING_COLOR = 0xf39c12;

export const DEFAULT_COOLDOWN = 3; // seconds

export const MAX_WARNINGS_BEFORE_BAN = 5;
export const MAX_WARNINGS_BEFORE_KICK = 3;
export const MAX_WARNINGS_BEFORE_MUTE = 2;

export const SPAM_THRESHOLD = 5;       // messages
export const SPAM_WINDOW = 5000;       // ms
export const RAID_THRESHOLD = 10;      // joins
export const RAID_WINDOW = 30000;      // ms

export const ANTINUKE_THRESHOLDS = {
  ban: 3,
  kick: 3,
  channelDelete: 3,
  channelCreate: 5,
  roleDelete: 3,
  roleCreate: 5,
  webhookCreate: 3,
};
