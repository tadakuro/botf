import { AntiNukeModel, IAntiNuke } from '../schemas/AntiNuke';

export async function getAntiNuke(guildId: string): Promise<IAntiNuke | null> {
  return (await (AntiNukeModel as any).findOne({ guildId }).exec()) as IAntiNuke | null;
}

export async function upsertAntiNuke(
  guildId: string,
  data: Partial<IAntiNuke>,
): Promise<IAntiNuke> {
  const doc = await (AntiNukeModel as any).findOneAndUpdate(
    { guildId },
    { $set: data },
    { upsert: true, new: true },
  ).exec();
  return doc as IAntiNuke;
}
