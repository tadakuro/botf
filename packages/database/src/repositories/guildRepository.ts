import { GuildModel, IGuild } from '../schemas/Guild';

export async function getGuild(guildId: string): Promise<IGuild | null> {
  return GuildModel.findOne({ guildId }).exec();
}

export async function upsertGuild(guildId: string, data: Partial<IGuild>): Promise<IGuild> {
  const doc = await GuildModel.findOneAndUpdate(
    { guildId },
    { $set: data },
    { upsert: true, new: true },
  ).exec();
  return doc as IGuild;
}
