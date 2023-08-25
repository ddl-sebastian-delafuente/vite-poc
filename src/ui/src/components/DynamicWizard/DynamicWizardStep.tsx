import { kebabCase } from 'lodash';
import * as React from 'react';

import { usePrevious } from '../../utils/CustomHooks';
import { Awaited } from '../../utils/typescriptUtils';
import { useRemoteData } from '../../utils/useRemoteData';
import { 
  AntFormLayout,
  DynamicFieldDisplayProps,
  DynamicFieldDisplay,
  flattenLayoutElements,
} from '../DynamicField';
import { 
  DependencyKeyword, 
  Flags, 
  WorkflowData,
} from './DynamicWizard.types';
import { 
  diffWorkflowDataDeps,
  resetWorkflowData,
  transformWorkflowData 
} from './DynamicWizard.utils';
import {
  getWorkflowStep,
} from './proxiedDynamicWizardApiCalls';
import { ValidationStatus } from './useValidationState';

type PickedProps = 'antFormProps' | 'fieldStyle'| 'onButtonAction' | 'onValidateFailed' | 'testIdPrefix' | 'validationStatus' | 'setValidationStatus';
export interface DynamicWizardStepProps extends Pick<DynamicFieldDisplayProps, PickedProps> {
  flags?: Flags,
  isAdminUser?: boolean;
  isAdminPage?: boolean;
  onChange: (key: string, value: unknown) => void;
  setValidationError: (value: string) => void;
  setWorkflowData: (value: WorkflowData) => void;
  stepId: string;
  userId?: string;
  workflowData: WorkflowData,
  workflowId: string;
}

export const DynamicWizardStep = ({
  antFormProps,
  flags,
  fieldStyle,
  isAdminPage,
  isAdminUser,
  onButtonAction,
  onChange,
  setValidationError,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValidationStatus = () => {},
  setWorkflowData,
  stepId,
  testIdPrefix,
  userId,
  validationStatus,
  workflowData,
  workflowId,
}: DynamicWizardStepProps) => {
  const validated = validationStatus === ValidationStatus.success;
  const {
    data: workflowStep,
    refetch: refetchWorkflowStep,
  } = useRemoteData<Awaited<ReturnType<typeof getWorkflowStep>>>({
    canFetch: true,
    fetcher: () => getWorkflowStep(
      workflowId, 
      stepId, 
      transformWorkflowData(workflowData), 
      { 
        flags: flags || {},
        isAdminPage,
        isAdminUser,
        userId,
        validated,
      }
    ),
    initialValue: {
      layout: { elements: [] },
    }
  });

  const mutableElements = React.useMemo(() => {
    return flattenLayoutElements(workflowStep.layout.elements)
      .map(elem => elem.path).filter(Boolean) as string[]
  }, [workflowStep.layout]);

  const previousWorkflowData = usePrevious(workflowData);
  const previousValidated = usePrevious(validated);

  React.useEffect(() => {
    const depChanges = diffWorkflowDataDeps(previousWorkflowData, workflowData, workflowStep.dependencies);
    const depResetChanges = diffWorkflowDataDeps(previousWorkflowData, workflowData, workflowStep.resetDependencies);
    if (depChanges.length > 0) {
      setValidationStatus(ValidationStatus.waiting);
      refetchWorkflowStep();
    }

    if (depResetChanges.length > 0) {
      const newWorkflowData = resetWorkflowData({
        elementList: mutableElements,
        resetDependencies: workflowStep.resetDependencies,
        workflowData,
      });
      setWorkflowData(newWorkflowData);
    }
  }, [
    mutableElements,
    previousWorkflowData, 
    refetchWorkflowStep, 
    setValidationStatus,
    setWorkflowData,
    workflowData, 
    workflowStep
  ]);

  React.useEffect(() => {
    refetchWorkflowStep();
  }, [flags, isAdminPage, refetchWorkflowStep]);

  React.useEffect(() => {
    const hasValidationDep = (workflowStep.dependencies || []).indexOf(DependencyKeyword.validationStatus) > -1
    const didValidatedChange = validated !== previousValidated;
    if (hasValidationDep && didValidatedChange) {
      refetchWorkflowStep();
    }
  }, [
    previousValidated,
    refetchWorkflowStep,
    validated, 
    workflowStep, 
  ])

  const updateFieldData = React.useCallback((key: string, value: unknown) => {
    setValidationStatus(ValidationStatus.waiting);
    onChange(key, value);
  }, [onChange, setValidationStatus]);

  const handleValidateFailed = React.useCallback((validationError: string) => {
    setValidationError(validationError);
  }, [setValidationError]);

  return (
    <div>
      <DynamicFieldDisplay
        antFormProps={{
          ...antFormProps,
          layout: AntFormLayout.vertical,
        }}
        data={workflowData}
        editable
        fieldStyle={fieldStyle}
        fullWidthInput
        layout={workflowStep.layout}
        isAdminPage={isAdminPage}
        isAdminUser={isAdminUser}
        onButtonAction={onButtonAction}
        onChange={updateFieldData}
        onValidateFailed={handleValidateFailed}
        setValidationStatus={setValidationStatus}
        testIdPrefix={kebabCase(`${testIdPrefix}-${stepId}`)}
        userId={userId}
        validationStatus={validationStatus}
      />
    </div>
  )
};
