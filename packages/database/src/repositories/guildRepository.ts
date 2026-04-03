import { GuildModel, IGuild } from '../schemas/Guild';
export async function getGuild(guildId: string): Promise<IGuild | null> { return GuildModel.findOne({ guildId }); }
export async function upsertGuild(guildId: string, data: Partial<IGuild>): Promise<IGuild> {
  return GuildModel.findOneAndUpdate({ guildId }, { $set: data }, { upsert: true, new: true }) as Promise<IGuild>;
}
