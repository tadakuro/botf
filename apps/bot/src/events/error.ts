import { Event } from '../types/Event';
import { logger } from '../utils/logger';
const event: Event<'error'> = {
  name: 'error',
  async execute(client, error) {
    logger.error('Discord client error:', error);
  },
};
export default event;
