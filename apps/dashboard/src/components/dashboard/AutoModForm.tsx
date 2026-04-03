'use client';
import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';

interface Props { guildId: string; settings: any; }

const TOGGLES = [
  { key: 'autoModEnabled', label: 'AutoMod', desc: 'Enable automatic moderation' },
  { key: 'antiInviteEnabled', label: 'Anti-Invite', desc: 'Delete Discord invite links' },
  { key: 'antiSpamEnabled', label: 'Anti-Spam', desc: 'Timeout users who spam messages' },
  { key: 'antiHoistEnabled', label: 'Anti-Hoist', desc: 'Remove special chars from nicknames' },
  { key: 'antiBotEnabled', label: 'Anti-Bot', desc: 'Prevent unauthorized bots from joining' },
  { key: 'antiRaidEnabled', label: 'Anti-Raid', desc: 'Kick users during mass-join raids' },
  { key: 'levelsEnabled', label: 'Leveling', desc: 'Enable XP and level-up system' },
];

export function AutoModForm({ guildId, settings }: Props) {
  const [form, setForm] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map(t => [t.key, settings?.[t.key] ?? false]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/guilds/${guildId}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-5">
      {TOGGLES.map(({ key, label, desc }) => (
        <Toggle
          key={key}
          enabled={form[key]}
          onChange={v => setForm(f => ({ ...f, [key]: v }))}
          label={label}
          description={desc}
        />
      ))}
      <div className="pt-2 border-t border-surface-border">
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
