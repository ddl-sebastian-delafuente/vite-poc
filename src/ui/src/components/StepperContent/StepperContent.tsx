import * as React from 'react';
import { useState, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Steps } from 'antd';
import { CheckOutlined, ExclamationCircleFilled, LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
import { ButtonProps as AntButtonProps } from 'antd/lib/button';
// eslint-disable-next-line no-restricted-imports
import { Button as AntButton } from 'antd';
import { DominoAdminInterfaceWhiteLabelConfigurations } from '@domino/api/dist/types';
import { themeHelper } from '../../styled/themeUtils';
import * as colors from '../../styled/colors';
import FlexLayout from '../Layouts/FlexLayout';
import Button, { ExtendedButtonProps } from '../Button/Button';
import SpinningDominoLogo from '../../icons/SpinningDominoLogo';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import useStore from '../../globalStore/useStore';
import { fontSizes } from '../../styled';

const { Step } = Steps;

const STEP_ERROR_TOOLTIP_TEXT = 'Resolve errors first';

// width is calculated on subtracting stepswidth and vertical divider(9px) width from modal width
export const Container = styled(FlexLayout)`
  height: ${({ height }: StyleProps) => height || '60vh'};
  @media screen and (max-width:958px) {
  .main-content-layout {
    width: ${({ stepsWidth }: StyleProps) => `calc(100% - ${stepsWidth} - 13px)`};
    overflow: auto;
    }
  }
  }
`;

export const StepsWrap = styled.div`
  padding: ${({ padding }: StyleProps) => padding};
  width: ${({ width }: StyleProps) => width};
`;

export const VerticalDivider = styled.div`
  height: ${({ height, actionsHeight }: StyleProps) => `calc(${height || '60vh'} - ${actionsHeight})`};
  width: 1px;
  background-color: ${colors.veryLightPink};;
`;

export const ContentAndActions = styled.div`
  margin-left: 0px;
  margin-right: 0px;
  width: ${({ width }: StyleProps) => width};
`;

export const Content = styled.div`
  height: ${({ height, actionsHeight }: StyleProps) => `calc(${height || '60vh'} - ${actionsHeight})`};
  @media screen and (max-width:958px) {
    height: ${({ height, actionsHeight }: StyleProps) => `calc(${height || '60vh'} - ${actionsHeight} - 15px)`};
  }
  overflow-y: auto;
  padding: 20px;
  display: ${({ isVisible }: StyleProps) => isVisible ? 'block' : 'none'};
`;

export const Actions = styled.div`
  display: flex;
  justify-content:flex-end;
`;

//@ts-ignore
export const StyledButton = styled((props: ExtendedButtonProps) => <Button {...props} />)`
  justify-content: center;
  min-width: ${({ width }: StyleProps) => width ? width : '85px'};
`;

export const FlexLayoutWithZeroMargin = styled(FlexLayout)`
  margin: 0;
`;

export const StyledSpinningDominoLogo = styled(SpinningDominoLogo)`
  margin-right: ${themeHelper('margins.tiny')};
`;

export const StyledSpinningLoadingOutlined = styled(LoadingOutlined)`
  margin-right: ${themeHelper('margins.tiny')};
`;

const StyledSteps = styled(Steps)`
  &.ant-steps-dot .ant-steps-item-content, .ant-steps-dot.ant-steps-small .ant-steps-item-content {
  width: auto;
  }
  &.ant-steps-vertical > .ant-steps-item > .ant-steps-item-container > .ant-steps-item-tail {
    display: none;
  }
  &.ant-steps-vertical.ant-steps-dot .ant-steps-item-icon {
    margin: 0;
    width: 24px;
    height: 12px;
  }
  .ant-btn {
    line-height: 8px;
  }
  &.ant-steps-vertical .ant-steps-item:not(:last-child) {
    margin-bottom: 10px;
  }
  &.ant-steps-vertical.ant-steps-small .ant-steps-item-container .ant-steps-item-title {
    line-height: 18px;
    width: 100%;
    padding-right: 8px;
  }
  &.ant-steps .ant-steps-item-disabled > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color: ${colors.grey70};
  }
  &.ant-steps .ant-steps-item:not(.ant-steps-item-finish) .ant-btn[disabled].ant-btn-circle {
    color: ${colors.grey70};
    border-color:  ${colors.grey70};
    pointer-events: none;
  }
  &.ant-steps .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-finish):not(.ant-steps-item-disabled) .ant-steps-item-container:hover .ant-btn.ant-btn-circle {
    color:  ${colors.btnDarkBlue};
    border-color:  ${colors.btnDarkBlue};
  }
  &.ant-steps .ant-steps-item-active:not(.ant-steps-item-disabled):not(.ant-steps-item-finish) .ant-steps-item-container:hover .ant-btn.ant-btn-circle {
    color:  ${colors.white};
    border-color:  ${colors.lightishBlue};
  }
  &.ant-steps .ant-steps-item-wait:not(.ant-steps-item-disabled) > .ant-steps-item-container:hover > .ant-steps-item-content > .ant-steps-item-title,
  &.ant-steps .ant-steps-item-finish:not(.ant-steps-item-disabled) > .ant-steps-item-container:hover > .ant-steps-item-content > .ant-steps-item-title,
  &.ant-steps .ant-steps-item-error:not(.ant-steps-item-disabled):not(.ant-steps-item-active) > .ant-steps-item-container:hover > .ant-steps-item-content > .ant-steps-item-title {
    color:  ${colors.btnDarkBlue};
  }
  .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title,
  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title,
  .ant-steps-item-error > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color:  ${colors.lightishBlue};
    font-weight: 400;
  }
  &.ant-steps .ant-steps-item-active > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color:  ${colors.lightishBlue};
    font-weight: 600;
  }
  &.ant-steps .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description,
  &.ant-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description,
  &.ant-steps .ant-steps-item-error > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
    color: ${colors.boulder};
  }
  &.ant-steps .ant-steps-item-wait:not(.ant-steps-item-active):not(.ant-steps-item-disabled) > .ant-steps-item-container:hover > .ant-steps-item-content > .ant-steps-item-description,
  &.ant-steps .ant-steps-item-finish:not(.ant-steps-item-active):not(.ant-steps-item-disabled) > .ant-steps-item-container:hover > .ant-steps-item-content > .ant-steps-item-description,
  &.ant-steps .ant-steps-item-error:not(.ant-steps-item-active):not(.ant-steps-item-disabled) > .ant-steps-item-container:hover > .ant-steps-item-content > .ant-steps-item-description {
    color: ${colors.boulder};
  }
  &.ant-steps .ant-steps-item-disabled > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
    color: ${colors.grey70};
  }
  &.ant-steps .ant-steps-item-active > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
    color: ${colors.mineShaftColor};
  }
  .ant-steps-item-icon > .ant-steps-icon {
    top: -0.5px;
  }
  .ant-steps-item-disabled > .ant-steps-item-container {
    cursor: not-allowed;
  }
  &.ant-steps .ant-steps-item-description {
    font-size: ${themeHelper('fontSizes.tiny')};
  }
`;

export const StyledContent = styled(Content)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

export const StyledFooter = styled.div`
  width: 100%;
  padding: 10px 24px;
  border-top: 1px solid ${colors.veryLightPink};
  margin: 0;
  .ant-btn.domino-button .anticon.anticon-left {
    margin-left: -3px;
  }
  .ant-btn.domino-button .anticon.anticon-right {
    margin-right: -3px;
  }
`;

export const StyledExclamationCircle = styled(ExclamationCircleFilled)`
  color: ${colors.cabaret};
  font-size: 24px;
`;

export const TitleWrapper = styled.div`
  padding-left: 16px;
  width:100%;
`;

export const DescriptionWrapper = styled.div`
  padding-left: 16px;
  width:100%;
`;

// @ts-ignore
const StepNumber = styled((props: AntButtonProps) => <AntButton {...R.omit(['isCompleted', 'isCurrent'], props)} />)`
  &.ant-btn-circle, &.ant-btn-circle:hover, &.ant-btn-circle:focus {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${themeHelper('margins.large')};
    min-width: ${themeHelper('margins.large')};
    height: ${themeHelper('margins.large')};
    font-size: ${themeHelper('fontSizes.tiny')};
    border-color: ${({ isCompleted }: StyleProps) => isCompleted ? colors.greenApple : colors.lightishBlue};
    color: ${({ isCompleted, isCurrent }: StyleProps) => (isCompleted || isCurrent) ?
    colors.white : colors.lightishBlue};
    background-color: ${({ isCompleted, isCurrent }: StyleProps) => isCompleted ?
    colors.greenApple : isCurrent ? colors.lightishBlue : colors.white};
  }
`;

export const DefaultNextBtnText = () =>
  <>
    <span> Next </span>
    <RightOutlined />
  </>;

export const DefaultBackBtnText = () =>
  <>
    <LeftOutlined />
    <span> Back </span>
  </>;

//  wait --> Next step (Not Finished/Error)
//  Process/Active --> Current step
//  Finish/Error --> Final state of a step
enum StatusType {
  Wait = 'wait',
  Process = 'process',
  Finish = 'finish',
  Error = 'error'
}

interface StyleProps {
  isCompleted?: boolean;
  isCurrent?: boolean;
  width?: string;
  isVisible?: boolean;
  height?: string;
  padding?: string;
  actionsHeight?: string;
  stepsWidth?: string;
}

export type FinalAction = {
  label: React.ReactNode;
  showSpinnerOnSubmit: boolean;
  testId?: string;
  ariaBusy?: boolean;
}

type FinalActionBtnProps = {
  stepInfo: StepProps;
  isDisabled?: boolean;
  onActionBtnClick: (onChangeFn: OnNavigationAttempt, isFinalAction: boolean) => void;
}

const FinalActionBtn: React.FC<FinalActionBtnProps> = props => {
  const { whiteLabelSettings } = useStore();

  return (
  <StyledButton
    disabled={props.isDisabled}
    onClick={() => props.onActionBtnClick(props.stepInfo.onNavigationAttempt, true)}
    data-test={props.stepInfo.finalAction?.testId}
    width={props.stepInfo.primaryBtnWidth}
    aria-busy={Boolean(props.stepInfo.finalAction?.ariaBusy)}
  >
    {
      props.stepInfo.finalAction?.showSpinnerOnSubmit && !!props.stepInfo.isSubmitInProgress &&
      (R.isNil(whiteLabelSettings?.appLogo) ?
      <StyledSpinningDominoLogo height={15} width={15} testId="loading-spinner" /> :
      <StyledSpinningLoadingOutlined data-test="loading-spinner" style={{ fontSize:fontSizes.LARGE}}/>)
    }
    {props.stepInfo.finalAction?.label}
  </StyledButton>
  )
};

const finalActioBtnWithTooltip = (FinalActionBtn: React.FC<FinalActionBtnProps>, tooltipContent: string) =>
  (props: FinalActionBtnProps) => {
    return tooltipRenderer(
      tooltipContent,
      <span><FinalActionBtn {...props} /></span>);
  };

const showSpinner = (whiteLabelSettings?: DominoAdminInterfaceWhiteLabelConfigurations) => {
  return (R.isNil(whiteLabelSettings) ? <div /> : R.isNil(whiteLabelSettings?.appLogo) ?
    <StyledSpinningDominoLogo height={15} width={15} testId="loading-spinner" /> :
    <StyledSpinningLoadingOutlined data-test="loading-spinner" style={{ fontSize: fontSizes.LARGE }} />)
}

type OnNavigationAttempt = (fromNavigationButton?: boolean) => boolean | Promise<boolean>;

export interface StepProps {
  btnText?: React.ReactNode;
  content: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  extraActions?: React.ReactNode;
  finalAction?: FinalAction;
  hasError?: boolean;

  /**
   * When set to true will hide a individual step from
   * the stepper navigation.
   */
  hideStep?: boolean;
  isSubmitInProgress?: boolean;
  onNavigationAttempt: OnNavigationAttempt;
  onStepLoad?: () => void;
  onViewPrevious?: () => void;
  primaryBtnWidth?: string;
  showSpinnerOnSubmit?: boolean;
  title: string | React.ReactNode;
}

export interface StepRenderHelperProps {
  stepIndex: number;
  isCurrentStep: boolean;
  onClick: (idx: number, isCurrentStep: boolean) => void;
}

export interface StepperContentProps {
  steps: Array<StepProps>;
  stepsWidth?: string;
  contentWidth: string;
  cancelBtnText?: React.ReactNode;
  onCancel: () => void;
  viewPrevStepBtnText?: string | React.ReactNode;
  outlineSecondaryButton?: boolean;
  height?: string;
  stepsPadding?: string;
  actionsStyle?: React.CSSProperties;
  mainContentStyle?: React.CSSProperties;
  defaultStep?: number;
  hideSteps?: boolean;

  // @TODO for lite users this is v0 flag to hide this control
  hideNextButton?: boolean;
  allowForwardNavigationWithErrors?: boolean;
}

export interface StepperContentState {
  currentStepIdx: number;
}

const StepperContent: React.FC<StepperContentProps> = ({
  allowForwardNavigationWithErrors = true,
  hideNextButton,
  ...props
}) => {
  const stepCount = props.steps.length;
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(props.defaultStep || 0);
  const [stepsValidation, setStepsValidation] = React.useState<boolean[]>(Array(stepCount).fill(false));
  const isFinalBtnDisabled = props.steps.some((step, index) => step.hasError && stepsValidation[index]);

  const onActionBtnClick = async (onChangeFn: OnNavigationAttempt, isFinalAction: boolean) => {
    const isFinalStep = R.equals(currentStepIdx, (R.length(props.steps) - 1));
    if (isFinalAction) {
      for (let i = currentStepIdx; i < stepCount; i++) {
        const step = props.steps[i];
        updateStepsValidation(true, i);
        const canChange = await step.onNavigationAttempt(true);
        if (!canChange) {
          return;
        }
      }
      return;
    }

    const allowChange = await onChangeFn(true);
    const canNavigateForward = !isFinalStep && (allowForwardNavigationWithErrors ?
      (stepsValidation[currentStepIdx] || allowChange) : !!allowChange);
    updateStepsValidation(true, currentStepIdx);
    
    if (canNavigateForward) {
      setCurrentStepIdx((prevStepIdx: number) => prevStepIdx + 1);
    }
  }

  const updateStepsValidation = (isValidated: boolean, index: number) => {
    setStepsValidation(data => {
      const newValidationStatus = [...data];
      newValidationStatus[index] = isValidated;
      return newValidationStatus
    });
  }

  const onStepLoad = (step: StepProps) => {
    if(step.onStepLoad){
      step.onStepLoad();
    }
  }

  useEffect(() => {
    const newStep = props.steps[currentStepIdx]
    onStepLoad(newStep);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIdx]);

  const onStepClick = (newStepIdx: number) => {
    if (newStepIdx < currentStepIdx) {
      props.steps[currentStepIdx].onNavigationAttempt();
      setCurrentStepIdx(newStepIdx);
    } else {
      // Check each step between current step and new step to ensure you can't bypass
      // a step
      const allowChange = props.steps[currentStepIdx].onNavigationAttempt();
      for (let i = currentStepIdx; i < newStepIdx; i++) {
        updateStepsValidation(true, i);
        if (!allowForwardNavigationWithErrors && (allowChange === false)) {
          break;
        }
        props.steps[i].onNavigationAttempt();
      }

      const canNavigateForward = allowForwardNavigationWithErrors ? (stepsValidation[currentStepIdx] || allowChange) : !!allowChange;
      if (canNavigateForward) {
        setCurrentStepIdx(newStepIdx);
      }
    }
  }

  const onViewPrevious = () => {
    setCurrentStepIdx((prevStepIdx: number) => prevStepIdx - 1);
  }

  const GetFirstStepActions = () => {
    const { cancelBtnText, onCancel, steps } = props;
    const { whiteLabelSettings } = useStore();
    const currentStep = steps[currentStepIdx];
    const isNextBtnDisabled = !allowForwardNavigationWithErrors && (!!currentStep.hasError || currentStep.isSubmitInProgress);
    const NextButton = () => <StyledButton
    disabled={isNextBtnDisabled}
    onClick={() => onActionBtnClick(currentStep.onNavigationAttempt, false)}
    data-test={`step-${currentStepIdx}-change`}
    width={currentStep.primaryBtnWidth}
    btnType={!R.isNil(currentStep.finalAction) ? 'secondary' : 'primary'}
    aria-busy={Boolean(currentStep.finalAction?.ariaBusy)}
    >
      {
        currentStep.showSpinnerOnSubmit && !!currentStep.isSubmitInProgress &&
        showSpinner(whiteLabelSettings)
      }
      {currentStep.btnText ?? <DefaultNextBtnText />}
    </StyledButton>;
    const FinalAction = isFinalBtnDisabled ?
    finalActioBtnWithTooltip(FinalActionBtn, currentStep.error ?? STEP_ERROR_TOOLTIP_TEXT)
    : FinalActionBtn;

    return (
      <FlexLayout data-test={`step-${currentStepIdx}-actions`}>
        <Button
          btnType="tertiary"
          onClick={onCancel}
          data-test={`step-${currentStepIdx}-cancel`}
        >
          {cancelBtnText ?? "Cancel"}
        </Button>
        {!hideNextButton && (isNextBtnDisabled ?
          tooltipRenderer(currentStep.error ?? STEP_ERROR_TOOLTIP_TEXT, <span><NextButton /></span>) : <NextButton />
        )}
        {!R.isNil(currentStep.extraActions) && currentStep.extraActions}
        {!R.isNil(currentStep.finalAction) &&
          <FinalAction
            isDisabled={isFinalBtnDisabled || props.steps[currentStepIdx]?.isSubmitInProgress}
            stepInfo={currentStep}
            onActionBtnClick={onActionBtnClick}
          />
        }
      </FlexLayout>);
  }

  const GetOtherStepActions = () => {
    const { whiteLabelSettings } = useStore();
    const { viewPrevStepBtnText, outlineSecondaryButton, steps, onCancel, cancelBtnText } = props;
    const isFinalStep = R.equals(currentStepIdx, (R.length(steps) - 1));

    const currentStep = steps[currentStepIdx];
    const isNextBtnDisabled = allowForwardNavigationWithErrors ?
      isFinalStep ? (steps.some(step => step.hasError) || currentStep.isSubmitInProgress)  : false :
      (!!currentStep.hasError || currentStep.isSubmitInProgress);

    const NextButton = () => <StyledButton
      disabled={isNextBtnDisabled}
      onClick={() => onActionBtnClick(currentStep.onNavigationAttempt, false)}
      data-test={`step-${currentStepIdx}-change`}
      width={currentStep.primaryBtnWidth}
      btnType={!R.isNil(currentStep.finalAction) ? 'secondary' : 'primary'}
    >
      {
        currentStep.showSpinnerOnSubmit && !!currentStep.isSubmitInProgress &&
        showSpinner(whiteLabelSettings)
      }
      {currentStep.btnText ?? <DefaultNextBtnText />}
    </StyledButton>;
     const FinalAction = isFinalBtnDisabled ?
     finalActioBtnWithTooltip(FinalActionBtn, currentStep.error ?? STEP_ERROR_TOOLTIP_TEXT)
     : FinalActionBtn;

    return (
      <FlexLayout data-test={`step-${currentStepIdx}-actions`}>
        <Button
          btnType="tertiary"
          onClick={onCancel}
          data-test={`step-${currentStepIdx}-cancel`}
        >
          {cancelBtnText ?? "Cancel"}
        </Button>
        {outlineSecondaryButton ?
          <StyledButton
            btnType="secondary"
            onClick={() => {
              onViewPrevious();
              currentStep.onNavigationAttempt();
              if (currentStep.onViewPrevious) {
                currentStep.onViewPrevious();
              }
            }
            }
            data-test={`step-${currentStepIdx}-back`}
          >
            {viewPrevStepBtnText ?? <DefaultBackBtnText />}
          </StyledButton> :
          <Button
            btnType="tertiary"
            onClick={() => {
              onViewPrevious();
              if (currentStep.onViewPrevious) {
                currentStep.onViewPrevious();
              }
            }
            }
            data-test={`step-${currentStepIdx}-back`}
          >
            {viewPrevStepBtnText ?? <DefaultBackBtnText />}
          </Button>
        }
        {!hideNextButton && (isNextBtnDisabled && currentStep.hasError ?
          tooltipRenderer(currentStep.error ?? STEP_ERROR_TOOLTIP_TEXT, <span><NextButton /></span>) : <NextButton />
        )}
        {!R.isNil(currentStep.extraActions) && currentStep.extraActions}
        {!isFinalStep && (!R.isNil(currentStep.finalAction) &&
          <FinalAction
            isDisabled={isFinalBtnDisabled || props.steps[currentStepIdx]?.isSubmitInProgress}
            stepInfo={currentStep}
            onActionBtnClick={onActionBtnClick}
          />)
        }
      </FlexLayout>);
  }

  const getStatus = (isCurrentStep: boolean, index: number, hasError?: boolean) => {
    return R.cond([
      [() => R.equals(hasError, true), R.always(StatusType.Error)],
      [() => R.equals(hasError, false), R.always(StatusType.Finish)],
      [() => isCurrentStep, R.always(StatusType.Process)],
      [R.T, R.always(StatusType.Wait)]
    ])();
  }

  const getIsStepDisabled = (steps: Array<StepProps>, index: number) => {
    if (allowForwardNavigationWithErrors) {
      return false;
    }
    const hasError = R.pathEq(['hasError'], true);
    const stepsWithId: Array<StepProps & { id: number }> = steps.map((data, index) => {
      return { ...data, id: index }
    })
    return R.any((step: StepProps & { id: number }) => hasError(step))(stepsWithId.slice(0, index));
  }

  const {
    steps,
    stepsWidth = '185px',
    contentWidth,
    height,
    stepsPadding = '20px 0 0 20px',
    actionsStyle,
    hideSteps,
    mainContentStyle
  } = props;
  const mapIndexed = R.addIndex(R.map);

  return (
    <Container justifyContent="flex-start" alignItems="flex-start" height={height} stepsWidth={stepsWidth}>
      {!hideSteps &&
        (<>
          <StepsWrap width={stepsWidth} padding={stepsPadding}>
            <FlexLayout flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
              <StyledSteps
              // @ts-ignore
                progressDot={(dot, { status, index }) => {
                  const isCompleted = status === StatusType.Finish;
                  const isDisabled = getIsStepDisabled(steps, index);
                  const stepNumber = <StepNumber
                    shape="circle"
                    isCompleted={isCompleted}
                    isCurrent={index === currentStepIdx}
                    disabled={isDisabled}
                  >
                    {
                      isCompleted ? <CheckOutlined/> : index + 1
                    }
                  </StepNumber>;
                  return status == StatusType.Error ?
                    <StyledExclamationCircle /> :
                    isDisabled ? tooltipRenderer(STEP_ERROR_TOOLTIP_TEXT, <span>{stepNumber}</span>) :
                      stepNumber;
                }
                }
                current={currentStepIdx}
                size="small"
                direction="vertical"
                onChange={onStepClick}>
                {mapIndexed((stepProps: StepProps, idx: number) => {
                  const isCurrentStep = (idx === currentStepIdx);
                  const isDisabled = getIsStepDisabled(steps, idx);
                  const title = isDisabled ?
                    tooltipRenderer(STEP_ERROR_TOOLTIP_TEXT, <TitleWrapper>{stepProps.title}</TitleWrapper>)
                    : <TitleWrapper>{stepProps.title}</TitleWrapper>;
                  const description = isDisabled ?
                    tooltipRenderer(STEP_ERROR_TOOLTIP_TEXT, <DescriptionWrapper>{stepProps.description}</DescriptionWrapper>)
                    : <DescriptionWrapper>{stepProps.description}</DescriptionWrapper>;

                  return <Step
                    key={idx}
                    title={title}
                    description={description}
                    status={getStatus(isCurrentStep, idx, stepProps.hasError)}
                    disabled={isDisabled}
                    data-test={`step-${idx + 1}-jump`}
                    data-deny-data-analyst={stepProps.hideStep}
                    aria-busy={stepProps.finalAction?.ariaBusy}
                  />;
                }, steps) as React.ReactNode
                }
              </StyledSteps>
            </FlexLayout>
          </StepsWrap>
          <VerticalDivider
            height={height}
            actionsHeight={(!!actionsStyle && !!actionsStyle.height) ? (actionsStyle.height as string) : '53px'}
          />
        </>
        )}
      <FlexLayoutWithZeroMargin
        justifyContent="flex-start"
        flexDirection="column"
        alignItems="flex-start"
        className="main-content-layout"
      >
        <ContentAndActions
          // @ts-ignore
          style={mainContentStyle}
          width={contentWidth}
        >
          {
            mapIndexed(
              (step: StepProps, idx: number) => (
                <StyledContent
                  key={idx}
                  isVisible={idx === currentStepIdx}
                  height={height}
                  actionsHeight={(!!actionsStyle && !!actionsStyle.height) ? (actionsStyle.height as string) : '53px'}
                  data-test={`step-${idx + 1}-content`}
                  className="step-content"
                >
                  {step && step.content}
                </StyledContent>),
              steps) as React.ReactNode
          }
        </ContentAndActions>
      </FlexLayoutWithZeroMargin>
      <StyledFooter>
        {/* @ts-ignore */}
        <Actions style={actionsStyle}>
          {
            R.ifElse(
              R.equals(0),
              GetFirstStepActions,
              GetOtherStepActions
            )(currentStepIdx)
          }
        </Actions>
      </StyledFooter>
    </Container>
  );
}

export default StepperContent;
