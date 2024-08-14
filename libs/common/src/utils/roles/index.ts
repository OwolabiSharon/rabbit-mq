import { Role } from '@app/common/database/models/role.entity';

export enum Roles {
  Admin = 'Admin',
  Developer = 'Developer',
  ViewOnly = 'ViewOnly',
  Owner = 'Owner',
}

export enum InviteStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  REJECTED = 'Rejected',
}

export enum Permissions {
  APILOGS = 'APILogs',
  APP = 'App',
  CUSTOMERS = 'Customers',
  ROLES = 'Roles',
  IDENTITY = 'Identity',
  APIKEYS = 'APIKeys',
  ACCOUNTS = 'Accounts',
  TRANSACTIONS = 'Transactions',
  PAYMENTS = 'Payments',
  WEBHOOKS = 'Webhooks',
  PROFILEUPDATE = 'ProfileUpdate',
  VERIFICATION = 'Verification',
  STATEMENTS = 'Statements',
  BANK = 'Bank',
  TEAMS = 'Teams',
}

export const DeveloperCheckbox = [
  Permissions.APILOGS,
  Permissions.APP,
  Permissions.CUSTOMERS,
  Permissions.IDENTITY,
  Permissions.ACCOUNTS,
  Permissions.TRANSACTIONS,
  Permissions.WEBHOOKS,
  Permissions.STATEMENTS,
  Permissions.APIKEYS,
];

export const ViewOnlyCheckbox = [Permissions.PROFILEUPDATE, Permissions.BANK];

export const AdminCheckbox = [
  Permissions.APILOGS,
  Permissions.APP,
  Permissions.CUSTOMERS,
  Permissions.ROLES,
  Permissions.IDENTITY,
  Permissions.APIKEYS,
  Permissions.ACCOUNTS,
  Permissions.TRANSACTIONS,
  Permissions.PAYMENTS,
  Permissions.WEBHOOKS,
  Permissions.PROFILEUPDATE,
  Permissions.VERIFICATION,
  Permissions.STATEMENTS,
  Permissions.BANK,
  Permissions.TEAMS,
  Permissions.WEBHOOKS,
];

export function DefaulRoles(business_id: string) {
  const roles = [
    { business_id, user_type: Roles.Admin, permissions: AdminCheckbox },
    { business_id, user_type: Roles.Developer, permissions: DeveloperCheckbox },
    { business_id, user_type: Roles.ViewOnly, permissions: ViewOnlyCheckbox },
    { business_id, user_type: Roles.Owner, permissions: AdminCheckbox },
  ];
  return roles;
}
