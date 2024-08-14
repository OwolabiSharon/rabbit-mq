/* eslint-disable no-shadow */
export enum JavaConstants {
  Decrypt = 'java Aes_D',
  Encrypt = 'java Aes_E',
}

export enum StatusConstants {
  SUCCESS = 'successful',
  FAILED = 'failed',
}

export enum SourceConstants {
  API = 'Api',
  Dashboard = 'Dashboard',
}

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
