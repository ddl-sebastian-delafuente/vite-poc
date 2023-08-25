import * as React from 'react'

import { Awaited } from '../../utils/typescriptUtils';
import { useRemoteData } from '../../utils/useRemoteData';
import { ButtonAction, FieldValue } from '../DynamicField/DynamicField.types';
import { getErrorMessage } from '../renderers/helpers';
import StepperContent, { 
  StepProps,
  StyledSpinningDominoLogo,
  StepperContentProps,
} from '../StepperContent/StepperContent'
import { error as raiseErrorToast } from '../toastr';
import { DynamicWizardStepProps, DynamicWizardStep } from './DynamicWizardStep';
import { 
  WorkflowData, 
  WorkflowStepMetadata,
} from './DynamicWizard.types';
import { 
  getWorkflowStepDescription,
  transformWorkflowData,
} from './DynamicWizard.utils';
import { trackWorkflow } from './mixpanelMapper';
import {
  completeWorkflow,
  getWorkflowMetadata,
  StepId,
  validateStep as remoteValiateStep,
  WorkflowId,
} from './proxiedDynamicWizardApiCalls';
import { useValidationState, ValidationStatus } from './useValidationState';

type PickedProps = 'antFormProps' | 'flags' | 'fieldStyle' | 'isAdminPage' | 'isAdminUser' | 'testIdPrefix' | 'userId';
export interface DynamicWizardProps extends Pick<DynamicWizardStepProps, PickedProps> {
  /**
   * When working with a update workflow in order to prefill fields
   * provide the object containing the data the be filled. For best
   * results use `LabelAndValue` fieldStyle
   * Note that data must be structured in such a way that the keys
   * map to the paths defined in the layout provided by `getWorkflowStep`
   */
  initialData?: WorkflowData;

  onCancel?: () => void;

  /**
   * Called immediately prior sending to backend. This event handler is useful
   * when there are long running operations that need to be preformed to 
   * complete a workflow.
   */
  onCompleteBegin?: () => void;

  /**
   * Gets called upon successful completion of the wizard
   */
  onComplete?: (response: Awaited<ReturnType<typeof completeWorkflow>>) => void;

  stepperProps?: Partial<StepperContentProps>;

  /**
   * Workflow ID
   */
  workflowId: string;
}

export const DynamicWizard = ({ 
  isAdminPage,
  isAdminUser,
  antFormProps,
  flags,
  fieldStyle,
  initialData = {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onCancel = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onCompleteBegin = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onComplete = () => {},
  stepperProps = {},
  testIdPrefix,
  userId,
  workflowId 
}: DynamicWizardProps) => {
  const [workflowData, setWorkflowData] = React.useState<WorkflowData>(initialData);
  const [workflowInFlight, setWorkflowInFlight] = React.useState(false);
  const {
    data: workflowMetadata,
    loading: isWorkflowMetadataLoading,
    hasLoaded: hasWorkflowMetadataLoaded,
    refetch: refetchWorkflowMetadata,
  } = useRemoteData<Awaited<ReturnType<typeof getWorkflowMetadata>>>({
    canFetch: true,
    fetcher: () => getWorkflowMetadata(workflowId, transformWorkflowData(workflowData), { 
      flags: flags || {}, 
      isAdminPage, 
      isAdminUser,
    }),
    initialValue: {
      id: '',
      title: '',
      steps: [],
    }
  });
  const { 
    getStepperHasError,
    getValidationStatus,
    isValidated,
    setValidationError,
    setValidationStatus,
    waitForValidationToComplete,
  } = useValidationState({ steps: workflowMetadata.steps });

  React.useEffect(() => {
    refetchWorkflowMetadata();
  }, [flags, isAdminPage, workflowId, refetchWorkflowMetadata]);

  const updateWorkflowData = React.useCallback((key: string, value: FieldValue) => {
    const { dependencies = [] } = workflowMetadata;
    if (dependencies.indexOf(key) !== -1) {
      refetchWorkflowMetadata();
    }

    setWorkflowData({
      ...workflowData,
      [key]: value,
    });
  }, [
    refetchWorkflowMetadata,
    setWorkflowData,
    workflowData,
    workflowMetadata,
  ]);

  const handleTriggerValidation = React.useCallback((step: WorkflowStepMetadata, isLastStep: boolean, forceRemoteValidate?: boolean) => {
    return async (fromNavigationButton?: boolean) => {
      // Check if step is already validated, but only if it isn't the final step
      if (isValidated(step.id) && !isLastStep) {
        trackWorkflow({
          eventType: 'stepChange',
          workflowId: workflowMetadata.id,
          stepId: step.id,
        });
        return true;
      }

      const shouldRemoteValidate = step.remoteValidate || forceRemoteValidate;

      setValidationStatus(step.id, shouldRemoteValidate ?  ValidationStatus.initializedMultiphase : ValidationStatus.initialized);

      // Wait for clientside validation to complete on the step
      try {
        await waitForValidationToComplete(step.id);
      } catch (e) {
        console.error(e);
        return false;
      }

      // If server is requesting to remotely validate a step do it here.
      if (shouldRemoteValidate) {
        try {
          setValidationStatus(step.id, ValidationStatus.pending);
          const removeValidateRequest = {
            body: {
              workflowID: workflowMetadata.id as WorkflowId,
              stepID: step.id as StepId,
              data: transformWorkflowData(workflowData)
            }
          }
          const remoteValidateResponse = await remoteValiateStep(removeValidateRequest);
          if ( !remoteValidateResponse.success ) {
            setValidationStatus(step.id, ValidationStatus.failed);
            raiseErrorToast(remoteValidateResponse.errors.join(', '));
            return false;
          }
          
          setValidationStatus(step.id, ValidationStatus.success);

          // By having `validationSuccessNextButtonText` defined
          // this implicitly means that even if remote validation is successful
          // workflow progression should be paused and have the user manually
          // advance to the next step
          if (step?.validationSuccessNextButtonText) {
            return false;
          }

        } catch (e) {
          const errorMessage = await getErrorMessage(e)
          raiseErrorToast(errorMessage);
          setValidationStatus(step.id, ValidationStatus.failed);
          console.error(e);
          return false;
        }
      }

      // If this is the last step in addition to validating the step we will also 
      // attempt to complete the workflow
      if (isLastStep && fromNavigationButton) {
        try {
          setWorkflowInFlight(true);
          onCompleteBegin();
          const completeWorkflowRequest = {
            body: {
              workflowID: workflowMetadata.id as WorkflowId,
              data: transformWorkflowData(workflowData)
            }
          };
          const completeResponse = await completeWorkflow(completeWorkflowRequest);
          if (!completeResponse.success) {
            setWorkflowInFlight(false);
            raiseErrorToast(completeResponse.errors.join(', '));
            return false;
          }

          onComplete(completeResponse);
          setWorkflowInFlight(false);
          trackWorkflow({
            eventType: 'complete',
            workflowId: workflowMetadata.id,
          });

          return true;
        } catch (e) {
          const errorMessage = await getErrorMessage(e)
          raiseErrorToast(errorMessage);
          setWorkflowInFlight(false);
          console.error(e);
          return false;
        }
      }

      trackWorkflow({
        eventType: 'stepChange',
        workflowId: workflowMetadata.id,
        stepId: step.id,
      });
      return true;
    }
  }, [
    isValidated,
    onCompleteBegin,
    onComplete,
    setValidationStatus, 
    setWorkflowInFlight,
    waitForValidationToComplete, 
    workflowData,
    workflowMetadata.id, 
  ]);

  const handleButtonAction = React.useCallback((step: WorkflowStepMetadata, isLastStep: boolean) => (action: ButtonAction) => {
    if (action === ButtonAction.validateStep) {
      const triggerValidationFn = handleTriggerValidation(step, isLastStep, true);
      triggerValidationFn();
      return;
    }
  }, [handleTriggerValidation]);

  const handleSetValidationStatus = React.useCallback((step: { id: string; }) => {
    return (value: ValidationStatus) => {
      const currentValue = getValidationStatus(step.id);
      if (currentValue !== value) {
        setValidationStatus(step.id, value);
      }
    }
  }, [getValidationStatus, setValidationStatus]);

  const handleSetValidationError = React.useCallback((step: { id: string; }) => {
    return (value: string) => {
      if (!value) {
        return;
      }
      setValidationError(step.id, value);
    }
  }, [setValidationError]);

  const stepperSteps: StepProps[] = React.useMemo(() => {
    return workflowMetadata.steps.map((step, index) => {
      const { title } = step;
      const isLastStep = index === workflowMetadata.steps.length - 1;

      const navigationFn = step.isOptional && !isLastStep ? 
        () => true : handleTriggerValidation(step, isLastStep);

      const stepProps: Partial<StepProps> = {
        btnText: step.nextButtonText,
        description: getWorkflowStepDescription(step, workflowData, { isAdminPage, isAdminUser }),
        hasError: getStepperHasError(step),
        onNavigationAttempt: navigationFn,
        title: `${title}${(step.isOptional && step.displayOptionalMark) ? ' (Optional)' : ''}`,
      };

      // check if validation is complete on a step and if metadata
      if (step.validationSuccessNextButtonText && isValidated(step.id)) {
        stepProps.btnText = step.validationSuccessNextButtonText;
      }

      if (isLastStep) {
        const btnText = workflowMetadata.completeButtonText || 'Finish';
        stepProps.btnText = btnText;
        stepProps.showSpinnerOnSubmit = true;
        stepProps.isSubmitInProgress = workflowInFlight;
      }

      const resolveAntFormProps = () => {
        const formProps = {
          ...antFormProps,
        };

        if (typeof step.requiredMark !== 'undefined') {
          formProps.requiredMark = step.requiredMark;
        }

        return formProps; 
      };

      return {
        ...stepProps,
        content: (
          <DynamicWizardStep
            antFormProps={resolveAntFormProps()}
            flags={flags}
            fieldStyle={fieldStyle}
            isAdminPage={isAdminPage}
            isAdminUser={isAdminUser}
            onButtonAction={handleButtonAction(step, isLastStep)}
            onChange={updateWorkflowData}
            setValidationError={handleSetValidationError(step)}
            setValidationStatus={handleSetValidationStatus(step)}
            setWorkflowData={setWorkflowData}
            stepId={step.id}
            testIdPrefix={testIdPrefix || workflowId}
            userId={userId}
            validationStatus={getValidationStatus(step.id)}
            workflowData={workflowData}
            workflowId={workflowId}
          />
        )
      } as StepProps;
    });
  }, [
    antFormProps,
    getStepperHasError,
    fieldStyle,
    flags,
    getValidationStatus,
    handleButtonAction,
    handleSetValidationError,
    handleSetValidationStatus,
    handleTriggerValidation,
    isAdminPage,
    isAdminUser,
    isValidated,
    testIdPrefix,
    updateWorkflowData,
    userId,
    workflowData,
    workflowId,
    workflowInFlight,
    workflowMetadata,
  ]);

  if (isWorkflowMetadataLoading && !hasWorkflowMetadataLoaded || workflowMetadata.steps.length === 0) {
    return <StyledSpinningDominoLogo/>
  }

  if (workflowMetadata.steps.length === 1) {
    return (
      <StepperContent
        {...stepperProps}
        contentWidth={stepperProps.contentWidth || '400px'}
        onCancel={onCancel}
        hideSteps
        steps={stepperSteps}
        outlineSecondaryButton={true}
      />
    )
  }

  return (
    <StepperContent
      {...stepperProps}
      contentWidth={stepperProps.contentWidth || '400px'}
      onCancel={onCancel}
      steps={stepperSteps}
      outlineSecondaryButton={true}
    />
  )
}
