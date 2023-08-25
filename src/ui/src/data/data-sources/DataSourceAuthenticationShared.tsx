import {
  CredentialType,
} from './CommonData';

export const BLOCKED_PASSWORD = '**********';

export const canViewAuth = (isOwner: boolean, credentialType: CredentialType) => {
  const isSharedAndNotOwner = credentialType === CredentialType.Shared && !isOwner;
  return !isSharedAndNotOwner;
}
