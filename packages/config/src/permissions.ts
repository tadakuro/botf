export const COMMAND_CATEGORIES = ['moderation', 'utility', 'settings', 'fun', 'owner'] as const;
export type CommandCategory = typeof COMMAND_CATEGORIES[number];
