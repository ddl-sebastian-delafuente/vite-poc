import { Flags } from './DynamicWizard.types';

export interface MetaRequestObject {
  flags?: Flags;
  isAdminPage?: boolean;
  isAdminUser?: boolean;
  userId?: string;
  validated?: boolean;
}

export interface RequestDataObject {
  [key: string]: string;
}
