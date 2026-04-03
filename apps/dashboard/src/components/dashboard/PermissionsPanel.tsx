'use client';
import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { RoleSelect } from '@/components/ui/RoleSelect';

interface PermEntry { target: string; targetType: string; enabled: boolean; allowedRoles: string[]; deniedRoles: string[]; }
interface Props { guildId: string; categories: string[]; commands: Record<string, string[]>; permissions: PermEntry[]; roles: any[]; }

export function PermissionsPanel({ guildId, categories, commands, permissions, roles }: Props) {
  const [perms, setPerms] = useState<Record<string, PermEntry>>(
    Object.fromEntries(permissions.map(p => [p.target, p]))
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  function getPerm(target: string, type: 'category' | 'command'): PermEntry {
    return perms[target] ?? { target, targetType: type, enabled: true, allowedRoles: [], deniedRoles: [] };
  }

  function updatePerm(target: string, patch: Partial<PermEntry>) {
    setPerms(p => ({ ...p, [target]: { ...getPerm(target, 'command'), ...patch } }));
  }

  async function savePerm(target: string, targetType: 'category' | 'command') {
    setSaving(target);
    const perm = getPerm(target, targetType);
    await fetch(`/api/guilds/${guildId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...perm, targetType }),
    });
    setSaving(null);
  }

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const catPerm = getPerm(cat, 'category');
        const isExpanded = expanded === cat;
        return (
          <div key={cat} className="card space-y-4">
            {/* Category header */}
            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 text-left"
                onClick={() => setExpanded(isExpanded ? null : cat)}
              >
                <span className="font-semibold text-white capitalize">{cat}</span>
                <span className="text-gray-500 text-sm">({commands[cat]?.length ?? 0} commands)</span>
                <span className="text-gray-500 text-xs ml-1">{isExpanded ? '▲' : '▼'}</span>
              </button>
              <Toggle
                enabled={catPerm.enabled}
                onChange={v => updatePerm(cat, { enabled: v, targetType: 'category' })}
              />
            </div>

            {/* Category role restrictions */}
            <div className="space-y-3">
              <div>
                <label className="label">Allowed Roles <span className="text-gray-600">(empty = all roles allowed)</span></label>
                <RoleSelect
                  roles={roles}
                  value={catPerm.allowedRoles}
                  onChange={ids => updatePerm(cat, { allowedRoles: ids, targetType: 'category' })}
                  placeholder="All roles can use this category..."
                />
              </div>
              <div>
                <label className="label">Denied Roles</label>
                <RoleSelect
                  roles={roles}
                  value={catPerm.deniedRoles}
                  onChange={ids => updatePerm(cat, { deniedRoles: ids, targetType: 'category' })}
                  placeholder="No roles blocked..."
                />
              </div>
              <button
                onClick={() => savePerm(cat, 'category')}
                disabled={saving === cat}
                className="btn-primary text-sm py-1.5"
              >
                {saving === cat ? 'Saving...' : 'Save Category'}
              </button>
            </div>

            {/* Per-command overrides */}
            {isExpanded && (
              <div className="border-t border-surface-border pt-4 space-y-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Per-command overrides</p>
                {commands[cat]?.map(cmd => {
                  const cmdPerm = getPerm(cmd, 'command');
                  return (
                    <div key={cmd} className="bg-surface rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <code className="text-brand text-sm">/{cmd}</code>
                        <Toggle
                          enabled={cmdPerm.enabled}
                          onChange={v => updatePerm(cmd, { enabled: v, targetType: 'command' })}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Allowed Roles</label>
                        <RoleSelect
                          roles={roles}
                          value={cmdPerm.allowedRoles}
                          onChange={ids => updatePerm(cmd, { allowedRoles: ids, targetType: 'command' })}
                          placeholder="Inherits from category..."
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Denied Roles</label>
                        <RoleSelect
                          roles={roles}
                          value={cmdPerm.deniedRoles}
                          onChange={ids => updatePerm(cmd, { deniedRoles: ids, targetType: 'command' })}
                          placeholder="None blocked..."
                        />
                      </div>
                      <button
                        onClick={() => savePerm(cmd, 'command')}
                        disabled={saving === cmd}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        {saving === cmd ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
