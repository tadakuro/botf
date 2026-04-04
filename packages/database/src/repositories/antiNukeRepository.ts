import { AntiNukeModel, IAntiNuke } from '../schemas/AntiNuke';

export async function getAntiNuke(guildId: string): Promise<IAntiNuke | null> {
  return AntiNukeModel.findOne({ guildId }).exec();
}

export async function upsertAntiNuke(
  guildId: string,
  data: Partial<IAntiNuke>,
): Promise<IAntiNuke> {
  const doc = await AntiNukeModel.findOneAndUpdate(
    { guildId },
    { $set: data },
    { upsert: true, new: true },
  ).exec();
  return doc as IAntiNuke;
}
