import { FormattedPrincipal } from './globalStore/util';

export const getEnableDatasets = (formattedPrincipal?: FormattedPrincipal) => 
  formattedPrincipal && formattedPrincipal.enableDatasets || false;
