'use client';
import { useState } from 'react';

interface Props { guildId: string; settings: any; channels: any[]; }

export function WelcomeForm({ guildId, settings, channels }: Props) {
  const [form, setForm] = useState({
    welcomeChannel: settings?.welcomeChannel ?? '',
    welcomeMessage: settings?.welcomeMessage ?? 'Welcome {user} to **{server}**!',
    goodbyeChannel: settings?.goodbyeChannel ?? '',
    goodbyeMessage: settings?.goodbyeMessage ?? 'Goodbye {username}! We hope to see you again.',
  });
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

  const VARS = ['{user}', '{username}', '{server}', '{memberCount}'];

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-white">Welcome Message</h3>
        <div>
          <label className="label">Channel</label>
          <select className="input" value={form.welcomeChannel} onChange={e => setForm(f => ({ ...f, welcomeChannel: e.target.value }))}>
            <option value="">— Disabled —</option>
            {channels.map((c: any) => <option key={c.id} value={c.id}>#{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            className="input min-h-[80px] resize-y"
            value={form.welcomeMessage}
            onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-white">Goodbye Message</h3>
        <div>
          <label className="label">Channel</label>
          <select className="input" value={form.goodbyeChannel} onChange={e => setForm(f => ({ ...f, goodbyeChannel: e.target.value }))}>
            <option value="">— Disabled —</option>
            {channels.map((c: any) => <option key={c.id} value={c.id}>#{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            className="input min-h-[80px] resize-y"
            value={form.goodbyeMessage}
            onChange={e => setForm(f => ({ ...f, goodbyeMessage: e.target.value }))}
          />
        </div>
      </div>

      <div className="card">
        <p className="text-xs text-gray-500">Available variables: {VARS.map(v => <code key={v} className="bg-surface px-1 py-0.5 rounded text-brand mx-1">{v}</code>)}</p>
      </div>

      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
      </button>
    </div>
  );
}
