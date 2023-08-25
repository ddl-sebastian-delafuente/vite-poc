import * as React from 'react';
import styled, { useTheme } from 'styled-components';
import { error, success } from '@domino/ui/dist/components/toastr';
import Link from '@domino/ui/dist/components/Link/Link';
import ModalWithButton from '@domino/ui/dist/components/ModalWithButton';
import InvisibleButton from '@domino/ui/dist/components/InvisibleButton';
import { DDFormItem } from '@domino/ui/dist/components/ValidatedForm';
import { colors, themeHelper } from '@domino/ui/dist/styled';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import TextArea from 'antd/lib/input/TextArea';
import Radio from './Radio/Radio';
import { RadioChangeEvent } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { httpRequest } from '@domino/api/dist/httpRequest';
import { InfoCircleOutlined } from '@ant-design/icons';
import TooltipRenderer from './renderers/TooltipRenderer';
import Input from './TextInput/Input';
import { getErrorMessage } from './renderers/helpers';
import { Feedback, SadFaceIcon, SuggestionFaceIcon } from './Icons';
import Button from './Button/Button';
import { validate as validateEmail } from 'email-validator';

const Description = styled.div`
  margin-bottom: ${themeHelper('paddings.small')};
`;
const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
    width: 100%;
  }
`;

const Title = styled.div`
  color: ${colors.greyishBrown};
  font-size: ${themeHelper('fontSizes.large')};
  margin-left: ${themeHelper('margins.small')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;

const StyledDDFormItem = styled(DDFormItem)`
  label {
    font-weight: 400;
  }
  &&.ant-legacy-form-item.email {
    margin-bottom: 0px;
  }
  .has-error.has-feedback .ant-legacy-form-item-children-icon {
    display: none;
  }
  &&.ant-legacy-form-item.feedback {
    margin-bottom: 5px;
  }
`;

const StyledRadio = styled(Radio)`
  margin-top: 5px;
  .ant-radio-button-wrapper {
    border: none !important;
    background: ${themeHelper('radio.default.container.background')};
    padding: 0;
  }
  .ant-radio-button-wrapper-checked, .ant-radio-button-wrapper:hover, .ant-radio-button-wrapper:active, .ant-radio-button-wrapper:focus {
    color: ${themeHelper('radio.default.selected.borderColor')} !important;
    border: none !important;
    margin: 0;
  }
`;

const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
  }
`;

const StyledImageContainer = styled.div`
  background: ${themeHelper('button.secondary.disabled.container.borderColor')};
  display: inline-block;
  padding: 46px 36px;
`;

const StyledRemoveSSButton = styled(InvisibleButton)`
  color: ${themeHelper('button.secondary.container.color')};
  display: block;
  padding: 5px 0;
`;

const tooltipMessage = <span>
  This form submits feedback directly to our Product Managers and Designers and could help improve the Domino experience for releases to come.
  <br />
  <br />
  We’d appreciate if you could share any thoughts on our product’s usability or how its capabilities meet your needs.
</span>
  ;

export interface Props {
  projectId?: string;
  openButtonLabel?: React.ReactNode;
  visibility?: boolean;
  userEmail?: string;
}

const Help = styled.div`
  position: relative;
  padding-top: 3px;
  margin-bottom: -1px;
  margin-left: 10px;
`;

export const GENERAL_ERROR = 'The feedback could not be sent. Make sure that the SMTP server is set up correctly, and the feedback recipient email has been verified.';

const sendFeedback = async (formData: any) => {
  try {
    await httpRequest('POST',
      `${window.location.origin}/sendFeedback`,
      {},
      {},
      {'Csrf-Token': 'nocheck'}, // TODO update once we have a way to get CSRF tokens on the client
      formData
    );
    success('Feedback sent. Thank you!');
  } catch (e) {
    error(await getErrorMessage(e, GENERAL_ERROR));
  }
}

const FeedbackModal = (props: Props) => {

  const canvas = React.useRef() as any;
  const hiddenCanvas = React.useRef() as any;
  const [score, setScore] = React.useState<string>('');
  const [takeScreenshot, setTakeScreenshot] = React.useState<boolean>();
  const [canvasHW, setCanavasHW] = React.useState({ height: 0, width: 0 });
  const [feedback, setFeedback] = React.useState('');
  const [email, setEmail] = React.useState(props.userEmail);
  const [canSendEmail, setCanSendEmail] = React.useState(true);
  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const theme = useTheme();

  const clearStates = React.useCallback(() => {
    setScore('');
    setTakeScreenshot(false);
    setCanavasHW({ height: 0, width: 0 });
    setFeedback('');
    setCanSendEmail(true);
    setEmail(props.userEmail);
  }, [props.userEmail]);

  const onTakeScreenshot = async () => {
    setTakeScreenshot(true);
    const context = (canvas.current! as HTMLCanvasElement).getContext("2d");
    const hiddenCanvasContext = (hiddenCanvas.current! as HTMLCanvasElement).getContext("2d");

    if (context && hiddenCanvasContext) {
      const video = document.querySelector("video");
      const modal = document.querySelector('div[data-test=feedback-modal]') as any;
      if (video && modal) {
        setCanavasHW({ height: 250, width: 470 });
        modal.style.visibility = "hidden";
        try {
          // @ts-ignore
          const captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true, preferCurrentTab: true });
          setTimeout(() => {
            video.srcObject = captureStream;
            video.onloadedmetadata = () => {
              video.play();
              video.pause();

              hiddenCanvasContext.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
              context.drawImage(video, 0, 0, 470, 250);
              // @ts-ignore
              captureStream.getVideoTracks().forEach(track => track.stop());
              modal.style.visibility = "visible";
            }
          }, 500);
        } catch (e) {
          console.error(e);
          if (e.name === 'NotAllowedError') {
            error('Failed to create screenshot, Please enable permission for screen recording.');
          }
          modal.style.visibility = "visible";
          setCanavasHW({ height: 0, width: 0 });
          setTakeScreenshot(false);
        }
      }
    }
  };

  const onRemoveScreenshot = () => {
    setTakeScreenshot(false);
    setCanavasHW({ height: 0, width: 0 });
  }

  const onSubmit = () => {
    const formData = new FormData();
    const content = {
      'pageUrl': window.location.href,
      'feedback': feedback,
      'score': score,
      'senderEmail': canSendEmail ? email: 'None'
    };
    formData.append('json', JSON.stringify(content));

    const hiddenCanvas = document.getElementById('feedback-screenshot-hidden') as HTMLCanvasElement;

    if (takeScreenshot && hiddenCanvas && typeof hiddenCanvas.toBlob === 'function') {
      hiddenCanvas.toBlob((blob) => {
        if (blob) {
          formData.append('file', blob, 'screenshot.jpg');
        }
        sendFeedback(formData);
      },'image/jpeg');
    } else {
      sendFeedback(formData);
    }
    clearStates();
  };

  return (
    <ModalWithButton
      ModalButton={StyledInvisibleButton}
      openButtonLabel={props.openButtonLabel}
      modalProps={{
        title: (
          <FlexLayout justifyContent="flex-start" alignItems="center">
            <Title>Tell us what you think!</Title>
            {
              TooltipRenderer(tooltipMessage,
                <Help>
                  <InfoCircleOutlined style={{ fontSize: '20px' }} />
                </Help>)
            }
          </FlexLayout>
        ),
        destroyOnClose: true,
        width: 644,
        height: 740,
        bodyStyle: { paddingTop: '12px' },
      }}
      modalSubmitButtonLabel="Send"
      modalSubmitButtonDisable={feedback.trim().length === 0 || (canSendEmail && !isValidEmail)}
      testId='feedback-modal'
      visibility={props.visibility}
      closable={true}
      handleCancel={clearStates}
      handleSubmit={onSubmit}
    >
      <Description>
        For product questions or support needs, file a <Link
          href="https://tickets.dominodatalab.com/hc/en-us/requests/new#numberOfResults=5" openInNewTab>Support
          Ticket</Link> instead.
      </Description>
      <StyledDDFormItem label="Feedback">
        <TextArea
          data-test="feedback-textArea"
          placeholder="Please write your feedback here..."
          size='large'
          onChange={(e) => {
            setFeedback(e.target.value);
            e.stopPropagation();
          }}
        />
      </StyledDDFormItem>
      <StyledDDFormItem label="How would you characterize your above feedback?" className='feedback'>
        <StyledRadio
          direction="horizontal"
          optionType="button"
          items={[
            {
              key: 'good',
              value: 'Good Experience',
              label:
                <StyledLabel>
                  <Feedback
                    height={20}
                    width={20}
                    primaryColor={
                      (score && score === 'good')
                        ? themeHelper('radio.default.selected.borderColor')({ theme }) :
                        themeHelper('radio.default.container.icon')({ theme })} />
                  Good Experience
                </StyledLabel>
            },
            {
              key: 'bad',
              value: 'Bad Experience',
              label:
                <StyledLabel>
                  <SadFaceIcon
                    height={20}
                    width={20}
                    primaryColor={(score && score === 'bad')
                      ? themeHelper('radio.default.selected.borderColor')({ theme }) :
                      themeHelper('radio.default.container.icon')({ theme })} />
                  Bad Experience
                </StyledLabel>
            },
            {
              key: 'suggestion',
              value: 'Suggestion',
              label:
                <StyledLabel>
                  <SuggestionFaceIcon
                    height={20}
                    width={20}
                    primaryColor={(score && score === 'suggestion')
                      ? themeHelper('radio.default.selected.borderColor')({ theme }) :
                      themeHelper('radio.default.container.icon')({ theme })} />
                  Suggestion
                </StyledLabel>
            },
          ]}
          onChange={(e: RadioChangeEvent) => {
            setScore(e.target.value);
            e.stopPropagation();
          }} value={score}
        />
      </StyledDDFormItem>
      <StyledDDFormItem label="Screenshot (optional)">
        
        <video playsInline autoPlay style={{ width: 0, height: 0 }}></video>
        {!takeScreenshot && <StyledImageContainer>
          <Button onClick={onTakeScreenshot}> Create Screenshot </Button>
        </StyledImageContainer>
        }
        <canvas id="feedback-screenshot" ref={canvas} height={canvasHW.height} width={canvasHW.width} />
        <canvas hidden={true} id="feedback-screenshot-hidden" ref={hiddenCanvas} height={window.innerHeight-52} width={window.innerWidth} />
        {takeScreenshot && <StyledRemoveSSButton onClick={onRemoveScreenshot}>Remove screenshot</StyledRemoveSSButton>}
      </StyledDDFormItem>
      <StyledDDFormItem 
      className='email'
      error={canSendEmail && !isValidEmail && 'Please enter a valid email'}
      >
        <Checkbox 
        checked={canSendEmail}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setCanSendEmail(isChecked);
        }}
        >
          You may reach out to me for further feedback
        </Checkbox>
        <Input
          value={email}
          data-test="feedback-email"
          placeholder="enter your email address"
          onChange={(e) => {
            const emailText = e.target.value;
            setEmail(emailText);
            setIsValidEmail(validateEmail(emailText));
            e.stopPropagation();
          }}
        />
      </StyledDDFormItem>
    </ModalWithButton>
  );
};

export default FeedbackModal;
