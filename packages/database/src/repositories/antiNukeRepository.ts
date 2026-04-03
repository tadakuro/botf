import { AntiNukeModel, IAntiNuke } from '../schemas/AntiNuke';
export async function getAntiNuke(guildId: string) { return AntiNukeModel.findOne({ guildId }); }
export async function upsertAntiNuke(guildId: string, data: Partial<IAntiNuke>) {
  return AntiNukeModel.findOneAndUpdate({ guildId }, { $set: data }, { upsert: true, new: true });
}
