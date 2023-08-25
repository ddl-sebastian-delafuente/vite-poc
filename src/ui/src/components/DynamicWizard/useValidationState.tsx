import * as React from 'react';

import { UnionToMap } from '../../utils/typescriptUtils';
import { WorkflowMetadata, WorkflowStepMetadata } from './DynamicWizard.types';

/**
 * Indicates the status of a validation
 * waiting - indicates the validation has not begun or has been reset
 * waitingNext - indicates the validation phase has finished and next phase to begin
 * initialized - indicates the validation has been manually triggered
 * initializedMultiphase - indicates the validation has been manually triggered with mulitphase
 * pending - indicates the validation is in progress 
 * success - indicates validation is successful
 * failed - indicates validation has failed
 */
export type ValidationStatus = 'waiting' | 'waitingNext' | 'initialized' | 'initializedMultiphase' | 'pending' | 'success' | 'failed';
export const ValidationStatus: UnionToMap<ValidationStatus> = {
  failed: 'failed',
  initialized: 'initialized',
  initializedMultiphase: 'initializedMultiphase',
  pending: 'pending',
  success: 'success',
  waiting: 'waiting',
  waitingNext: 'waitingNext',
};

export interface ValidationState {
  validationError: string;
  validationStatus: ValidationStatus;
}

export interface ValidationStates { [key: string]: ValidationState }

export interface UseValidationStateProps {
  steps: WorkflowMetadata['steps'];
}

type Getter<T extends keyof ValidationState> = (stepId: string) => ValidationState[T];
type Setter<T extends keyof ValidationState> = (stepId: string, value: ValidationState[T]) => void;

export interface UseValidationStateReturn {
  getStepperHasError: (step: WorkflowStepMetadata) => boolean | undefined;
  getValidationError: Getter<'validationError'>;
  getValidationStatus: Getter<'validationStatus'>;
  isValidated: (stepId: string) => boolean;
  resetValidationStatuses: () => void;
  setValidationError: Setter<'validationError'>;
  setValidationStatus: Setter<'validationStatus'>;
  waitForValidationToComplete: (stepId: string) => Promise<void>;
}

export const useValidationState = ({
  steps
}: UseValidationStateProps): UseValidationStateReturn => {
  const [validationStates, setValidationStates] = React.useState<ValidationStates>({});
  const validationStatesRef = React.useRef(validationStates);

  React.useEffect(() => {
    const newShouldValidateSteps = steps.reduce((memo, { id }) => {
      memo[id] = validationStates[id] || {
        validationError: '',
        validationStatus: ValidationStatus.waiting,
      };
      return memo;
    }, {});

    setValidationStates(newShouldValidateSteps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  const makeGetter = React.useCallback(<T extends keyof ValidationState>(valueKey: T, defaultValue: ValidationState[T]) => {
    return (stepId: string): ValidationState[T] => {
      const step = validationStatesRef.current[stepId];

      if (!step) {
        return defaultValue;
      }

       return step[valueKey] || defaultValue;
    }
  }, [validationStatesRef]);

  const makeSetter = React.useCallback(<T extends keyof ValidationState>(valueKey: T) => {
    return (stepId: string, value: ValidationState[T]) => {
      const existingStep = validationStates[stepId];
      const newValidationStates = {
        ...validationStates,
        [stepId]: {
          ...existingStep,
          [valueKey]: value
        }
      }
      validationStatesRef.current = newValidationStates;
      setValidationStates(newValidationStates);
    };
  }, [setValidationStates, validationStates, validationStatesRef]);

  const getValidationError = React.useMemo(() => makeGetter<'validationError'>('validationError', ''), [makeGetter]);
  const getValidationStatus = React.useMemo(() => makeGetter<'validationStatus'>('validationStatus', ValidationStatus.waiting), [makeGetter]);

  const isValidated = React.useCallback((stepId: string) => {
    return getValidationStatus(stepId) === ValidationStatus.success;
  }, [getValidationStatus]);

  const resetValidationStatuses = React.useCallback(() => {
    const newValidationStates = Object.keys(validationStates).reduce((memo, keyName) => {
      memo[keyName] = {
        validationError: '',
        validationStatus: ValidationStatus.waiting,
      };
      return memo;
    }, {});

    setValidationStates(newValidationStates);
  }, [ setValidationStates, validationStates ]);

  const setValidationError = React.useMemo(() => makeSetter<'validationError'>('validationError'), [makeSetter]);
  const setValidationStatus = React.useMemo(() => makeSetter<'validationStatus'>('validationStatus'), [makeSetter]);

  const getStepperHasError = React.useCallback(({ id: stepId }: WorkflowStepMetadata) => {
    const validationStatus = getValidationStatus(stepId);
    
    if (validationStatus === ValidationStatus.failed) {
      return true;
    }

    if (validationStatus === ValidationStatus.success) {
      return false;
    }

    return undefined;
  }, [getValidationStatus]);

  const hasReachedFinalState = (stepId: string) => {
    const validationStatus = validationStatesRef.current[stepId]?.validationStatus;
    return [
      ValidationStatus.success, 
      ValidationStatus.failed, 
      ValidationStatus.waitingNext
    ].indexOf(validationStatus) > -1;
  };

  const waitForValidationToComplete = (stepId: string) => new Promise<void>((resolve, reject) => {
    const checkForError = () => {
      const validationStatus = validationStatesRef.current[stepId]?.validationStatus;
      if (validationStatus === ValidationStatus.failed) {
        const validationError = validationStatesRef.current[stepId]?.validationError;
        reject(validationError);
        return true;
      }

      return false;
    }

    const checkStatus = () => {
      if (!hasReachedFinalState(stepId)) {
        setTimeout(checkStatus, 10);
        return;
      }

      if (!checkForError()) {
        resolve();
      }
    }

    if (!hasReachedFinalState(stepId)) {
      checkStatus();
      return;
    }

    if (!checkForError()) {
      resolve();
    }
  });

  return {
    getStepperHasError,
    getValidationError,
    getValidationStatus,
    isValidated,
    resetValidationStatuses,
    setValidationError,
    setValidationStatus,
    waitForValidationToComplete,
  }
}
