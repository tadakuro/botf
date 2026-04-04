import { Event } from '../types/Event';

const event: Event<'guildMemberUpdate'> = {
  name: 'guildMemberUpdate',
  async execute(client, oldMember, newMember) {
    // Anti-hoist: strip special chars from nickname
    if (!newMember.displayName.match(/^[!-\/:-@[-`{-~]/)) return;
    try {
      await newMember.setNickname(
        newMember.displayName.replace(/^[!-\/:-@[-`{-~]+/, '').trim() || 'Moderated',
        'Anti-hoist',
      );
    } catch {}
  },
};

export default event;
