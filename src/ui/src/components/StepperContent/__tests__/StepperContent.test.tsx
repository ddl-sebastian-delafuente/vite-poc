import * as React from 'react';
import {
  fullClick,
  getByLabelText,
  render,
  screen,
  waitFor
} from '@domino/test-utils/dist/testing-library';
import StepperContent, {
  StepperContentProps,
  StepProps
} from '../StepperContent';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';

type MockStepProps = Omit<StepProps, 'onNavigationAttempt'>;

const MOCK_STEP: MockStepProps = {
  btnText: 'Next',
  content: <div />,
  title: 'Step 1',
  hasError: false
}


const mockProfile: MockProfile = {
  admin: {
    getWhiteLabelConfigurations: {},
  }
};

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
});

afterAll(() => {
  mocks.unmock();
});

const useIsSubmitInProgress = () => {
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState<boolean>(false);
  const handleOnChange = () => {
    setIsSubmitInProgress(true);
    return false;
  }
  return { isSubmitInProgress, handleOnChange };
}

describe('Stepper Content', () => {
  let props: StepperContentProps;

  beforeEach(() => {
    props = {
      cancelBtnText: 'Cancel',
      contentWidth: '300px',
      onCancel: jest.fn(),
      steps: [
        {
          ...MOCK_STEP,
          onNavigationAttempt: jest.fn(() => true),
        },
        {
          ...MOCK_STEP,
          btnText: 'Next',
          onNavigationAttempt: jest.fn(() => true),
          title: 'Step 2'
        },
        {
          ...MOCK_STEP,
          btnText: 'Finish',
          onNavigationAttempt: jest.fn(() => true),
          title: 'Step 3'
        }
      ],
      viewPrevStepBtnText: 'Prev',
    };
  });

  it('Should render steps', async () => {
    render(<StepperContent {...props} />);

    await waitFor(() => expect(screen.getByText('Cancel')).not.toBeNull());

    for (let i=0; i<props.steps.length; i++) {
      await waitFor(() => expect(screen.getByText(`Step ${i + 1}`)).not.toBeNull());
    }
  });

  it('Should render steps with different default step', async () => {
    const { getByDominoTestId } = render(<StepperContent {...props} defaultStep={1} />);

    await waitFor(() => expect(getByDominoTestId('step-1-change')).not.toBeNull());
    await waitFor(() => expect(getByDominoTestId('step-2-jump').className.indexOf('ant-steps-item-active')).toBeGreaterThanOrEqual(0));
  });

  it('Should show spinner when isSubmitInProgress and showSpinnerOnSubmit props are true', async () => {
    const [step1, step2, step3] = props.steps;

    const StepperWrapper = (wrapperProps: StepperContentProps) => {
      const { isSubmitInProgress, handleOnChange } = useIsSubmitInProgress();

      return (
        <StepperContent
          {...wrapperProps}
          steps={[
            {
              ...step1,
              isSubmitInProgress,
              onNavigationAttempt: handleOnChange,
              showSpinnerOnSubmit: true,
              hasError: false,
            },
            {
              ...step2,
            },
            {
              ...step3,
            }
          ]}
        />
      )
    }

    const { getByDominoTestId } = render(<StepperWrapper {...props} />);
    await waitFor(() => expect(screen.getByText('Cancel')).not.toBeNull());
    const step0next = getByDominoTestId('step-0-change');
    fullClick(step0next);

    await waitFor(() => expect(getByDominoTestId('loading-spinner')).not.toBeNull());
  });

  it('Should be able to navigate between steps with the left side panel', async () => {
    const [step1, step2, step3] = props.steps;

    const { getByDominoTestId } = render(<StepperContent
      {...props}
      steps={[
        {
          ...step1,
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    await waitFor(() => expect(screen.getByText('Cancel')).not.toBeNull());
    const step3Button = getByDominoTestId('step-3-jump');
    fullClick(step3Button.children[0] as HTMLElement);

    await waitFor(() => expect(getByDominoTestId('step-2-change')).not.toBeNull());

    const step2Button = getByDominoTestId('step-2-jump');
    fullClick(step2Button.children[0] as HTMLElement);
    await waitFor(() => expect(getByDominoTestId('step-1-change')).not.toBeNull());
  });

  it('Should be able to navigate between steps with content controls', async () => {
    const { getByDominoTestId } = render(<StepperContent
      {...props}
    />);

    await waitFor(() => expect(screen.getByText('Cancel')).not.toBeNull());
    const step0next = getByDominoTestId('step-0-change');
    fullClick(step0next);

    await waitFor(() => expect(getByDominoTestId('step-1-change')).not.toBeNull());

    const step1back = getByDominoTestId('step-1-back');
    fullClick(step1back);
    await waitFor(() => expect(getByDominoTestId('step-0-change')).not.toBeNull());
  });

  it('Should disable the Next button when allowForwardNavigationWithErrors is false and errors in current step', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId } = render(<StepperContent
      {...props}
      allowForwardNavigationWithErrors={false}
      steps={[
        {
          ...step1,
          hasError: true,
          onNavigationAttempt: () => false
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    const step0next = getByDominoTestId('step-0-change');
    fullClick(step0next);
    await waitFor(() => expect(getByDominoTestId('step-0-change').hasAttribute('disabled')).toBeTruthy());
  });

  it('Should enable Next button when allowForwardNavigationWithErrors is true and errors in current step', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId } = render(<StepperContent
      {...props}
      steps={[
        {
          ...step1,
          hasError: true,
          onNavigationAttempt: () => false
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    const step0next = getByDominoTestId('step-0-change');
    fullClick(step0next);
    await waitFor(() => expect(getByDominoTestId('step-0-change').hasAttribute('disabled')).toBeFalsy());
  });

  it('Should show the error icon on the step when the step is validated and the step has validation errors', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId } = render(<StepperContent
      {...props}
      steps={[
        {
          ...step1,
          hasError: true,
          onNavigationAttempt: () => false
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    const step0next = getByDominoTestId('step-0-change');
    fullClick(step0next);
    await waitFor(() => expect(getByLabelText(getByDominoTestId('step-1-jump'), 'exclamation-circle')).toBeTruthy());
  });

  it('Should disable the following steps when allowForwardNavigationWithErrors is false and errors in previous step', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId } = render(<StepperContent
      {...props}
      allowForwardNavigationWithErrors={false}
      steps={[
        {
          ...step1,
          hasError: true,
          onNavigationAttempt: () => false
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    const step0next = getByDominoTestId('step-0-change');
    fullClick(step0next);
    await waitFor(() => expect(getByDominoTestId('step-2-jump').className.indexOf('ant-steps-item-disabled')).toBeGreaterThanOrEqual(0));
    await waitFor(() => expect(getByDominoTestId('step-3-jump').className.indexOf('ant-steps-item-disabled')).toBeGreaterThanOrEqual(0));
  });

  it('Should disable the final action when allowForwardNavigationWithErrors is true and errors in the previous steps', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId } = render(<StepperContent
      {...props}
      steps={[
        {
          ...step1,
          hasError: true,
          onNavigationAttempt: () => true
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    const step3Jump = getByDominoTestId('step-3-jump');
    fullClick(step3Jump.children[0] as HTMLElement);
    await waitFor(() => expect(getByDominoTestId('step-2-change').hasAttribute('disabled')).toBeTruthy());
  });

  it('Should disable the final action when allowForwardNavigationWithErrors is false and errors in the final step', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId } = render(<StepperContent
      {...props}
      allowForwardNavigationWithErrors={false}
      steps={[
        {
          ...step1,
        },
        {
          ...step2,
        },
        {
          ...step3,
          hasError: true,
          onNavigationAttempt: () => true
        }
      ]}
    />);
    // step-3-jump is antd step wrapper in the left pane
    // step3Jump.children[0] is the acutal buttton 
    const step3Jump = getByDominoTestId('step-3-jump');
    fullClick(step3Jump.children[0] as HTMLElement);
    await waitFor(() => expect(getByDominoTestId('step-2-change')).not.toBeNull());
    const step2Change = getByDominoTestId('step-2-change');
    fullClick(step2Change);
    await waitFor(() => expect(getByDominoTestId('step-2-change').hasAttribute('disabled')).toBeTruthy());
  });

  it('Should be able to configure next button text via btnText prop', async () => {
    const nextBtnText = 'Proceed';
    const [step1, step2, step3] = props.steps;
    render(<StepperContent
      {...props}
      steps={[
        {
          ...step1,
          hasError: true,
          btnText: nextBtnText,
          onNavigationAttempt: () => true
        },
        {
          ...step2,
          btnText: nextBtnText,
        },
        {
          ...step3,
          btnText: nextBtnText,
        }
      ]}
    />);

    await waitFor(() => expect(screen.getByText(nextBtnText)).toBeTruthy());
  });

  it('Should not display tooltip when final button submit is in progress', async () => {
    const [step1, step2, step3] = props.steps;
    const { getByDominoTestId, baseElement } = render(<StepperContent
      {...props}
      steps={[
        {
          ...step1,
          hasError: false,
          onNavigationAttempt: () => true,
          isSubmitInProgress: true,
          finalAction: {
            label: 'submit buttton text',
            showSpinnerOnSubmit: true,
            testId: 'final-action'
          },
        },
        {
          ...step2,
        },
        {
          ...step3,
        }
      ]}
    />);

    const startJobButton = getByDominoTestId('final-action');
    fullClick(startJobButton);
    await waitFor(() => expect(getByDominoTestId('loading-spinner')).not.toBeNull());
    await waitFor(() => expect(getByDominoTestId('final-action').hasAttribute('disabled')).toBeTruthy());
    await waitFor(() => expect(baseElement.querySelector('.ant-tooltip')).toBeFalsy());
  });
  
});
