'use client';
import { useState } from 'react';
import { RoleSelect } from '@/components/ui/RoleSelect';

interface Props {
  guildId: string;
  settings: any;
  roles: any[];
  channels: any[];
}

export function ModerationSettingsForm({ guildId, settings, roles, channels }: Props) {
  const [form, setForm] = useState({
    modLogChannel: settings?.modLogChannel ?? '',
    muteRole: settings?.muteRole ?? '',
    jailRole: settings?.jailRole ?? '',
    autoRoles: settings?.autoRoles ?? [],
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

  return (
    <div className="card space-y-6">
      <div>
        <label className="label">Mod Log Channel</label>
        <select className="input" value={form.modLogChannel} onChange={e => setForm(f => ({ ...f, modLogChannel: e.target.value }))}>
          <option value="">— None —</option>
          {channels.map((c: any) => <option key={c.id} value={c.id}>#{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Mute Role</label>
        <select className="input" value={form.muteRole} onChange={e => setForm(f => ({ ...f, muteRole: e.target.value }))}>
          <option value="">— None —</option>
          {roles.map((r: any) => <option key={r.id} value={r.id}>@{r.name}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Jail Role</label>
        <select className="input" value={form.jailRole} onChange={e => setForm(f => ({ ...f, jailRole: e.target.value }))}>
          <option value="">— None —</option>
          {roles.map((r: any) => <option key={r.id} value={r.id}>@{r.name}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Auto Roles (on join)</label>
        <RoleSelect
          roles={roles}
          value={form.autoRoles}
          onChange={ids => setForm(f => ({ ...f, autoRoles: ids }))}
          placeholder="Select roles to assign on join..."
        />
      </div>

      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
      </button>
    </div>
  );
}
