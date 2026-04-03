'use client';
import { useState } from 'react';

interface Backup { _id: string; label: string; guildName: string; createdBy: string; createdAt: string; memberCount: number; }
interface Props { guildId: string; userId: string; backups: Backup[]; }

const DEFAULT_OPTIONS = {
  restoreRoles: true,
  restoreChannels: true,
  restoreBans: false,
  restoreSettings: true,
  restoreEmojis: false,
  restoreBotforgeSettings: true,
};

export function BackupPanel({ guildId, userId, backups: initial }: Props) {
  const [backups, setBackups] = useState(initial);
  const [label, setLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadOptions, setLoadOptions] = useState(DEFAULT_OPTIONS);
  const [confirmLoad, setConfirmLoad] = useState<string | null>(null);
  const [result, setResult] = useState<{ restored: string[]; errors: string[] } | null>(null);

  async function createBackup() {
    if (!label.trim()) return;
    setCreating(true);
    const res = await fetch(`/api/guilds/${guildId}/backup/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label.trim(), createdBy: userId }),
    });
    const data = await res.json();
    if (data.backup) setBackups(b => [data.backup, ...b]);
    setLabel('');
    setCreating(false);
  }

  async function deleteBackup(id: string) {
    setDeletingId(id);
    await fetch(`/api/guilds/${guildId}/backup`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupId: id }),
    });
    setBackups(b => b.filter(x => x._id !== id));
    setDeletingId(null);
  }

  async function loadBackup(id: string) {
    setLoadingId(id);
    setConfirmLoad(null);
    const res = await fetch(`/api/guilds/${guildId}/backup/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupId: id, options: loadOptions }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoadingId(null);
  }

  const optionLabels: Record<string, string> = {
    restoreRoles: 'Roles',
    restoreChannels: 'Channels & Categories',
    restoreBans: 'Bans',
    restoreSettings: 'Server Settings',
    restoreEmojis: 'Emojis',
    restoreBotforgeSettings: 'BotForge Config',
  };

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-white">Create Backup</h2>
        <div className="flex gap-3">
          <input
            className="input"
            placeholder="Backup label e.g. Pre-redesign"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createBackup()}
          />
          <button onClick={createBackup} disabled={creating || !label.trim() || backups.length >= 10} className="btn-primary whitespace-nowrap">
            {creating ? 'Creating...' : '+ Create'}
          </button>
        </div>
        {backups.length >= 10 && <p className="text-xs text-yellow-400">Maximum of 10 backups reached. Delete one to create a new backup.</p>}
      </div>

      {/* Restore options */}
      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-white">Restore Options</h2>
        <p className="text-xs text-gray-500">Choose what to restore when loading a backup</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(optionLabels).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(loadOptions as any)[key]}
                onChange={e => setLoadOptions(o => ({ ...o, [key]: e.target.checked }))}
                className="accent-brand w-4 h-4"
              />
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-red-400">⚠️ Loading a backup will delete and recreate roles and channels. This cannot be undone.</p>
      </div>

      {/* Result */}
      {result && (
        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Restore Result</h3>
            <button onClick={() => setResult(null)} className="text-gray-500 hover:text-gray-300 text-xs">Dismiss</button>
          </div>
          {result.restored.length > 0 && (
            <div className="space-y-1">
              {result.restored.map(r => <p key={r} className="text-xs text-green-400">✅ {r}</p>)}
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="space-y-1">
              {result.errors.map((e, i) => <p key={i} className="text-xs text-red-400">❌ {e}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Backup list */}
      <div className="space-y-3">
        {backups.length === 0 ? (
          <div className="card text-center py-10 text-gray-500">No backups yet. Create your first one above.</div>
        ) : backups.map(b => (
          <div key={b._id} className="card flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{b.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(b.createdAt).toLocaleString()} · {b.memberCount} members
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {confirmLoad === b._id ? (
                <>
                  <button onClick={() => loadBackup(b._id)} disabled={loadingId === b._id} className="btn-danger text-sm py-1.5">
                    {loadingId === b._id ? 'Loading...' : 'Confirm Load'}
                  </button>
                  <button onClick={() => setConfirmLoad(null)} className="btn-ghost text-sm py-1.5">Cancel</button>
                </>
              ) : (
                <button onClick={() => setConfirmLoad(b._id)} className="btn-primary text-sm py-1.5">
                  Load
                </button>
              )}
              <button
                onClick={() => deleteBackup(b._id)}
                disabled={deletingId === b._id}
                className="btn-danger text-sm py-1.5"
              >
                {deletingId === b._id ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
