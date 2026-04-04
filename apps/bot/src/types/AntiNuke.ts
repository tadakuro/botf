export interface AntiNukeConfig {
  guildId: string;
  enabled: boolean;
  whitelist: string[];
  punishment: 'ban' | 'kick' | 'strip' | 'deafen';
  thresholds: {
    ban: number;
    kick: number;
    channelDelete: number;
    channelCreate: number;
    roleDelete: number;
    roleCreate: number;
    webhookCreate: number;
  };
}

export interface AntiNukeAction {
  userId: string;
  action: string;
  timestamp: number;
}
