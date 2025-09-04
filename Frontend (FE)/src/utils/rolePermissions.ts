export type Role = 'admin' | 'teacher' | 'student';

export interface Permission {
  resource: string;
  actions: string[];
}

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'courses', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'grades', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  teacher: [
    { resource: 'courses', actions: ['read', 'update'] },
    { resource: 'students', actions: ['read'] },
    { resource: 'grades', actions: ['create', 'read', 'update'] },
    { resource: 'assignments', actions: ['create', 'read', 'update', 'delete'] },
  ],
  student: [
    { resource: 'courses', actions: ['read'] },
    { resource: 'grades', actions: ['read'] },
    { resource: 'assignments', actions: ['read', 'update'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],
};

export function hasPermission(userRole: Role, resource: string, action: string): boolean {
  const permissions = rolePermissions[userRole];
  const resourcePermission = permissions.find(p => p.resource === resource);
  return resourcePermission?.actions.includes(action) || false;
}

export function canAccessResource(userRole: Role, resource: string): boolean {
  const permissions = rolePermissions[userRole];
  return permissions.some(p => p.resource === resource);
}