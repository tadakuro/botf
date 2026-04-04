import { TicketModel, ITicket } from '../schemas/Ticket';

export async function createTicket(data: Partial<ITicket>): Promise<ITicket> {
  const doc = await TicketModel.create(data);
  return doc as ITicket;
}

export async function closeTicket(channelId: string): Promise<void> {
  await TicketModel.findOneAndUpdate(
    { channelId },
    { $set: { closed: true } },
  ).exec();
}

export async function getOpenTickets(guildId: string): Promise<ITicket[]> {
  return TicketModel.find({ guildId, closed: false }).exec();
}
