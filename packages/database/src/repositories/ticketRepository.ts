import { TicketModel, ITicket } from '../schemas/Ticket';
export async function createTicket(data: Partial<ITicket>) { return TicketModel.create(data); }
export async function closeTicket(channelId: string) { await TicketModel.findOneAndUpdate({ channelId }, { $set: { closed: true } }); }
export async function getOpenTickets(guildId: string) { return TicketModel.find({ guildId, closed: false }); }
