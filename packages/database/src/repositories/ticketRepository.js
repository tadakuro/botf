"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = createTicket;
exports.closeTicket = closeTicket;
exports.getOpenTickets = getOpenTickets;
const Ticket_1 = require("../schemas/Ticket");
async function createTicket(data) {
    const doc = await Ticket_1.TicketModel.create(data);
    return doc;
}
async function closeTicket(channelId) {
    await Ticket_1.TicketModel.findOneAndUpdate({ channelId }, { $set: { closed: true } }).exec();
}
async function getOpenTickets(guildId) {
    return Ticket_1.TicketModel.find({ guildId, closed: false }).exec();
}
