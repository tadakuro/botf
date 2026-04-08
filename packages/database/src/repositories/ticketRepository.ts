import { TicketModel, ITicket } from '../schemas/Ticket';

export async function createTicket(data: Partial<ITicket>): Promise<ITicket> {
  const Model = TicketModel as any;
  const doc = await Model.create(data);
  return doc as ITicket;
}

export async function closeTicket(channelId: string): Promise<void> {
  const Model = TicketModel as any;
  await Model.findOneAndUpdate(
    { channelId },
    { $set: { closed: true } },
  ).exec();
}

export async function getOpenTickets(guildId: string): Promise<ITicket[]> {
  const Model = TicketModel as any;
  return (await Model.find({ guildId, closed: false }).exec()) as ITicket[];
}
