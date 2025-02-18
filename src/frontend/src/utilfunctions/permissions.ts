import { user_roles } from '@/types/enums';
import CoreModules from '@/shared/CoreModules';

// ADMIN-ONLY
export function isAdmin() {
  const authDetails = CoreModules.useAppSelector((state) => state.login.authDetails);
  return !!authDetails && authDetails?.role === user_roles.ADMIN;
}

// PROJECT-LEVEL
export function canCreateProject() {
  const authDetails = CoreModules.useAppSelector((state) => state.login.authDetails);
  return authDetails?.role === user_roles.ADMIN || !!authDetails?.orgs_managed;
}

// ORGANIZATION-LEVEL
export function canEditOrganization(id: number) {
  const authDetails = CoreModules.useAppSelector((state) => state.login.authDetails);
  return (
    authDetails?.role === user_roles.ADMIN || (authDetails?.orgs_managed && authDetails?.orgs_managed?.includes(id))
  );
}
