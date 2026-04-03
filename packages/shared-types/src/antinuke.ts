export interface AntiNukeThresholds {
  ban: number;
  kick: number;
  channelDelete: number;
  channelCreate: number;
  roleDelete: number;
  roleCreate: number;
  webhookCreate: number;
}

export interface AntiNukeConfig {
  enabled: boolean;
  punishment: 'ban' | 'kick' | 'strip' | 'deafen';
  whitelist: string[];
  thresholds: AntiNukeThresholds;
}
