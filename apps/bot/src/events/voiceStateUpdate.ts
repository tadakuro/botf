import { Event } from '../types/Event';
const event: Event<'voiceStateUpdate'> = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {},
};
export default event;
