import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd';
import styled from 'styled-components';
import copyToClipboard from 'copy-to-clipboard';
import InfoBox from '../../components/Callout/InfoBox';
import WarningBox from '@domino/ui/dist/components/WarningBox';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import Modal, { Title } from '@domino/ui/dist/components/Modal';
import Button from '@domino/ui/dist/components/Button/Button';
import DangerDarkButton from '@domino/ui/dist/components/DangerButtonDark';
import { themeHelper } from '@domino/ui/dist/styled';
import ApiKey from './styled/ApiKey';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

export const horizontalPadding = 10;
export const verticalPadding = 5;
export const buttonPadding = 5;

const handleSelectText = (textSelector: (elt: HTMLElement) => void) => (event: any) => textSelector(event.target);

const InfoBoxContainer = styled(InfoBox)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  font-size: ${themeHelper('fontSizes.tiny')};
  font-weight: ${themeHelper('fontWeights.bold')};
`;

const StyledDangerDarkButton = styled(DangerDarkButton)`
  margin-left: 5px;
  && button {
    font-size: ${themeHelper('fontSizes.tiny')};
    font-weight: ${themeHelper('fontWeights.bold')};
  }
`;

const StyledRegenerateButton = styled(StyledButton)`
  border: none;
  color: grey;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const Compactcontainer = styled.div`
  margin-bottom: 15px;
  background: #f6f6f6;
  border-radius: 2px;
  border: 1px solid #e1e6ee;

  padding: ${verticalPadding}px ${horizontalPadding}px;
  // allow buttons to be snug against the container
  & button:first-child {
    margin-left: ${buttonPadding - horizontalPadding}px;
  }
  & button:last-child {
    margin-right: ${buttonPadding - horizontalPadding}px;
  }
`;

const Flexbox = styled.div`
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

export type DefaultProps = {
  generating: boolean;
};

export type Props = {
  confirmationModalVisible?: boolean;
  apiKey?: string;
  error?: any;
  onRegenerateButtonClick?: () => void;
  onConfirmationModalCancelButtonClick?: () => void;
  onConfirmationModalConfirmButtonClick?: () => void;
  onConfirmationModalHide: () => void;
  onCopyToClipboardButtonClick?: () => void;
} & DefaultProps;

export const ApiKeyGenerator = ({
  confirmationModalVisible,
  generating,
  apiKey,
  error,
  onRegenerateButtonClick,
  onConfirmationModalCancelButtonClick,
  onConfirmationModalConfirmButtonClick,
  onConfirmationModalHide,
  onCopyToClipboardButtonClick,
}: Props) => {
  const Container = ({ children }: { children: any }) => {
    return (
      <div>
        {error ? <ErrorAlert /> : undefined}
        <Compactcontainer>
          <Flexbox>
            {children}
          </Flexbox>
        </Compactcontainer>
        <ConfirmationModal />
      </div>
    );
  };

  function ErrorAlert() {
    return (
      <WarningBox>
        Couldn’t regenerate API key: “
          <span title={error.message}>{error.message}</span>
          ”
      </WarningBox>
    );
  }

  const RegenerateButton = () => {
    if (generating) {
      return (
        <StyledRegenerateButton
          type="ghost"
          btnType="link"
          disabled={true}
        >
          Generating...
        </StyledRegenerateButton>
      );
    }
    return (
      <StyledButton
        btnType="secondary"
        title="Regenerate API Key"
        onClick={onRegenerateButtonClick}
      >
        Regenerate
      </StyledButton>
    );
  };

  function ConfirmationModal() {
    const { whiteLabelSettings } = useStore();
    return (
      <Modal
        visible={confirmationModalVisible}
        onCancel={onConfirmationModalHide}
        title={<Title>Regenerate API Key</Title>}
        footer={
          <FlexLayout justifyContent={'flex-end'}>
            <StyledButton
              btnType="secondary"
              onClick={onConfirmationModalCancelButtonClick}
            >
              Cancel
            </StyledButton>
            <StyledDangerDarkButton
              onClick={onConfirmationModalConfirmButtonClick}
            >
              Yes, Regenerate API Key
            </StyledDangerDarkButton>
          </FlexLayout>}
        data-test="api-key-generator"
        closable={true}
      >
        Are you sure you want to generate a new API key? Any applications
        using this key will no longer have access to the {`${getAppName(whiteLabelSettings)}`} API or API
        Endpoints. This cannot be undone.
      </Modal>
    );
  }

  if (apiKey) {
    return (
      <div>
        <InfoBoxContainer>
          Make sure to copy your new API key
          now. You won’t be able to see it again.
        </InfoBoxContainer>
        <Container>
          <ApiKey onClick={handleSelectText(selectText)}>
            {apiKey}
          </ApiKey>
          <Tooltip
            title="Copied!"
            trigger="click"
            placement="top"
          >
            <StyledButton
              type="text"
              btnType="secondary"
              onClick={onCopyToClipboardButtonClick}
            >
              Copy to Clipboard
            </StyledButton>
          </Tooltip>
        </Container>
      </div>
    );
  }
  return (
    <Container>
      <span>
        If you regenerate this API key, applications using this key will need to
        be updated.
      </span>
      <RegenerateButton />
    </Container>
  );
};

type OuterProps = {
  apiKey?: string;
  generating: boolean;
  error?: any;
  onRegenerate: () => void;
};

export const ApiKeyGeneratorWithState = (props: OuterProps) => {
  const [confirmationModalVisible, setConfirmationModalVisible] = React.useState<boolean>(false);

  const onRegenerateButtonClick = () => {
    setConfirmationModalVisible(true);
  };

  const onConfirmationModalCancelButtonClick = () => {
    setConfirmationModalVisible(false);
  };

  const onConfirmationModalConfirmButtonClick = () => {
    setConfirmationModalVisible(false);
    props.onRegenerate();
  };

  const onConfirmationModalHide = () => {
    setConfirmationModalVisible(false);
  };

  const onCopyToClipboardButtonClick = () => {
    copyToClipboard(props.apiKey || '');
  };

  return (
    <ApiKeyGenerator
      {...props}
      confirmationModalVisible={confirmationModalVisible}
      onRegenerateButtonClick={onRegenerateButtonClick}
      onConfirmationModalCancelButtonClick={onConfirmationModalCancelButtonClick}
      onConfirmationModalConfirmButtonClick={onConfirmationModalConfirmButtonClick}
      onConfirmationModalHide={onConfirmationModalHide}
      onCopyToClipboardButtonClick={onCopyToClipboardButtonClick}
    />
  )
};

function selectText(domElement: HTMLElement): void {
  if (document.createRange && window.getSelection) {
    const range = document.createRange();
    range.selectNodeContents(domElement);
    const selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export default ApiKeyGeneratorWithState;
