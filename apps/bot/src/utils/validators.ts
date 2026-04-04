export function isValidSnowflake(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidHexColor(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}
