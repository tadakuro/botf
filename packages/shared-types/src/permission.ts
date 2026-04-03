export interface CommandPermissionConfig {
  target: string;
  targetType: 'category' | 'command';
  enabled: boolean;
  allowedRoles: string[];
  deniedRoles: string[];
}

export interface RoleOption {
  id: string;
  name: string;
  color: number;
  position: number;
}
