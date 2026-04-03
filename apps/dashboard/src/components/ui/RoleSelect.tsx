'use client';

interface Role { id: string; name: string; color: number; }

interface RoleSelectProps {
  roles: Role[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export function RoleSelect({ roles, value, onChange, placeholder = 'Select roles...' }: RoleSelectProps) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id]);
  }

  function colorHex(color: number) {
    if (!color) return '#99aab5';
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-surface border border-surface-border rounded-lg">
        {value.length === 0 && <span className="text-gray-500 text-sm self-center">{placeholder}</span>}
        {value.map(id => {
          const role = roles.find(r => r.id === id);
          if (!role) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white cursor-pointer hover:opacity-75"
              style={{ backgroundColor: colorHex(role.color) + '33', border: `1px solid ${colorHex(role.color)}` }}
              onClick={() => toggle(id)}
            >
              <span style={{ color: colorHex(role.color) }}>{role.name}</span>
              <span className="text-gray-400">×</span>
            </span>
          );
        })}
      </div>
      <div className="max-h-40 overflow-y-auto bg-surface border border-surface-border rounded-lg divide-y divide-surface-border">
        {roles.filter(r => !value.includes(r.id)).map(role => (
          <button
            key={role.id}
            type="button"
            onClick={() => toggle(role.id)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-border text-left transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorHex(role.color) }}
            />
            <span className="text-sm text-gray-200">{role.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
