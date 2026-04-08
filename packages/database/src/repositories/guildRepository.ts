import { GuildModel, IGuild } from '../schemas/Guild';

export async function getGuild(guildId: string): Promise<IGuild | null> {
  const Model = GuildModel as any;
  return (await Model.findOne({ guildId }).exec()) as IGuild | null;
}

export async function upsertGuild(guildId: string, data: Partial<IGuild>): Promise<IGuild> {
  const Model = GuildModel as any;
  const doc = await Model.findOneAndUpdate(
    { guildId },
    { $set: data },
    { upsert: true, new: true },
  ).exec();
  return doc as IGuild;
}
