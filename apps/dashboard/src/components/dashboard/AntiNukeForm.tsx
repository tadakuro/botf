'use client';
import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { RoleSelect } from '@/components/ui/RoleSelect';

interface Props { guildId: string; config: any; roles: any[]; }

const DEFAULT_THRESHOLDS = { ban: 3, kick: 3, channelDelete: 3, channelCreate: 5, roleDelete: 3, roleCreate: 5, webhookCreate: 3 };
const THRESHOLD_LABELS: Record<string, string> = {
  ban: 'Bans', kick: 'Kicks', channelDelete: 'Channel Deletes',
  channelCreate: 'Channel Creates', roleDelete: 'Role Deletes',
  roleCreate: 'Role Creates', webhookCreate: 'Webhook Creates',
};

export function AntiNukeForm({ guildId, config, roles }: Props) {
  const [form, setForm] = useState({
    enabled: config?.enabled ?? false,
    punishment: config?.punishment ?? 'ban',
    whitelist: config?.whitelist ?? [],
    thresholds: { ...DEFAULT_THRESHOLDS, ...(config?.thresholds ?? {}) },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function setThreshold(key: string, val: number) {
    setForm(f => ({ ...f, thresholds: { ...f.thresholds, [key]: val } }));
  }

  async function save() {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/guilds/${guildId}/antinuke`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) setError('Failed to save. Try again.');
    else { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <Toggle
          enabled={form.enabled}
          onChange={v => setForm(f => ({ ...f, enabled: v }))}
          label="Enable AntiNuke"
          description="Detect and punish destructive actions automatically"
        />
      </div>

      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-gray-300">Punishment</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['ban', 'kick', 'strip', 'deafen'].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setForm(f => ({ ...f, punishment: p }))}
              className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                form.punishment === p
                  ? 'border-brand bg-brand/20 text-white'
                  : 'border-surface-border text-gray-400 hover:border-gray-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Action Thresholds <span className="text-gray-500 font-normal">(per 10 seconds)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(form.thresholds).map(([key, val]) => (
            <div key={key}>
              <label className="label">{THRESHOLD_LABELS[key] ?? key}</label>
              <input
                type="number"
                min={1}
                max={20}
                className="input"
                value={val as number}
                onChange={e => setThreshold(key, parseInt(e.target.value) || 1)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-sm font-semibold text-gray-300">Whitelist Roles</h3>
        <p className="text-xs text-gray-500">Members with these roles are exempt from AntiNuke checks</p>
        <RoleSelect
          roles={roles}
          value={form.whitelist}
          onChange={ids => setForm(f => ({ ...f, whitelist: ids }))}
          placeholder="Select whitelisted roles..."
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
      </button>
    </div>
  );
}
