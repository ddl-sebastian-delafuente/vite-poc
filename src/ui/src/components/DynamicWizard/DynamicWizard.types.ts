import { FieldValue, Layout } from '../DynamicField';

/**
 * Special case dependencies that do not correlate to a field value.
 */
export const DependencyKeyword = {
  validationStatus: '__VALIDATIION_STATUS__',
}

export interface Flags {
  [key: string]: boolean;
}

export interface WorkflowData {
  [key: string]: FieldValue | WorkflowData;
}


export interface WorkflowMetadata {
  completeButtonText?: string,
  dependencies?: string[];
  id: string;
  steps: WorkflowStepMetadata[];
  title: string;
}

export interface WorkflowStepMetadata {
  displayOptionalMark?: boolean;
  descriptionValues?: string[];
  id: string;
  isOptional?: boolean;
  nextButtonText?: string;
  remoteValidate?: boolean;
  requiredMark?: boolean | 'optional';
  title: string;
  validationSuccessNextButtonText?: string;
}

export interface WorkflowStep {
  dependencies?: string[];
  layout: Layout;
  resetDependencies?: string[];
}
