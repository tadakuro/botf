import { Message } from 'discord.js';
import { BotClient } from '../client';

const POLL_EMOJIS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

export async function addPollReactions(message: Message, optionCount: number): Promise<void> {
  for (let i = 0; i < Math.min(optionCount, POLL_EMOJIS.length); i++) {
    await message.react(POLL_EMOJIS[i]).catch(() => {});
  }
}

export { POLL_EMOJIS };
