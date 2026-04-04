import { EmbedBuilder, ColorResolvable } from 'discord.js';

const COLORS = {
  success: 0x2ecc71,
  error: 0xe74c3c,
  warning: 0xf39c12,
  info: 0x3498db,
  default: 0x2f3136,
} as const;

export function successEmbed(description: string, title?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(title ?? '✅ Success')
    .setDescription(description)
    .setTimestamp();
}

export function errorEmbed(description: string, title?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle(title ?? '❌ Error')
    .setDescription(description)
    .setTimestamp();
}

export function infoEmbed(description: string, title?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(title ?? 'ℹ️ Info')
    .setDescription(description)
    .setTimestamp();
}

export function warnEmbed(description: string, title?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(title ?? '⚠️ Warning')
    .setDescription(description)
    .setTimestamp();
}

export function baseEmbed(color: ColorResolvable = COLORS.default): EmbedBuilder {
  return new EmbedBuilder().setColor(color).setTimestamp();
}
