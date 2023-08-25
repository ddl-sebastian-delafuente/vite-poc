import React, { useState, useEffect } from 'react';
import { validate as validateEmail } from 'email-validator';
import { filter, isEmpty, isNil, not, replace, split } from 'ramda';
import {
  EmailSelectContainer,
  NotificationContainer,
  NotificationHeader,
  NotificationModal,
  SpinningDominoLogoContainer
} from './atoms';
import { error as ToastError } from '../components/toastr';
import { notificationApi } from '../dmmApis';
import SpinningDominoLogo from '../icons/SpinningDominoLogo';
import useStore from '../globalStore/useStore';
import { LoadingOutlined } from '@ant-design/icons';
import { fontSizes } from '../styled';

interface Props {
  visible: boolean;
  closeModal: () => void;
  dmmModelId: string;
}

export interface UseEmailAlerts {
  alertRecipients: Array<string>;
  setAlertRecipients: (alertRecipients: Array<string>) => void;
  alertConfigId: string | null;
  setAlertConfigId: (alertConfigId: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// API Calls
const fetchAlertRecipients = async (dmmModelId: string) => {
  try {
    const response = await notificationApi.getAlertConfigForModel(dmmModelId)
    const { data } = response;
    return data;
  } catch (err) {
    switch (err.response.status) {
      case 404:
        return undefined;
      default:
        ToastError('Something went wrong.');
        return undefined;
    }
  }
};

const handleNotificationSubmit = async (dmmModelId: string, emails: Array<string>) => {
  try {
    const modelAlertConfigUpdateRequestBody = {
      recipients: emails.join(','),
      useGlobalRecipients: isEmpty(emails)
    }
    await notificationApi.createOrUpdateModelAlertConfig(dmmModelId, modelAlertConfigUpdateRequestBody)
  } catch (err) {
    ToastError('Something went wrong.');
  }
};

export const parseAlertRecipients = (alertRecipientsString: string): Array<string> => {
  const commaSeparatedAlertRecipientsString = replace(/;/g, ',', alertRecipientsString);
  const cleanedAlertRecipientsString = replace(/ /g, '', commaSeparatedAlertRecipientsString);
  const alertRecipientsList = split(',', cleanedAlertRecipientsString);
  return filter((email) => not(isEmpty(email)), alertRecipientsList);
};

// States and effects
export const fetchAlertRecipientsEffectHook = async (
  dmmModelId: string,
  setAlertRecipients: (alertRecipients: Array<string>) => void,
  setAlertConfigId: (alertConfigId: string | null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  setIsLoading(true);
  const alertConfig = await fetchAlertRecipients(dmmModelId);
  if (alertConfig) {
    const {
      id,
      recipients: alertRecipientsString,
      useGlobalRecipients
    } = alertConfig;
    if (!useGlobalRecipients) {
      const filteredAlertRecipients = parseAlertRecipients(alertRecipientsString || "");
      setAlertRecipients(filteredAlertRecipients);
    }
    setAlertConfigId(id || null);
  }
  setIsLoading(false);
};

export const useEmailAlerts = (dmmModelId: string): UseEmailAlerts => {
  const [alertRecipients, setAlertRecipients] = useState(new Array<string>());
  const [alertConfigId, setAlertConfigId] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (() => fetchAlertRecipientsEffectHook(dmmModelId, setAlertRecipients, setAlertConfigId, setIsLoading))();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    alertRecipients,
    setAlertRecipients,
    alertConfigId,
    setAlertConfigId,
    isLoading,
    setIsLoading
  };
};

// Component
const AlertRecipients = ({ visible, closeModal, dmmModelId}: Props) => {
  const { alertRecipients, isLoading, setAlertRecipients } = useEmailAlerts(dmmModelId);
  const { whiteLabelSettings } = useStore();

  const handleSubmit = async () => {
    await handleNotificationSubmit(dmmModelId, alertRecipients);
    closeModal();
  };

  const handleEmailAdd = (recipientMail: string) => {
    const isEmailValid = validateEmail(recipientMail as string);
    if (isEmailValid) {
      setAlertRecipients([...alertRecipients, recipientMail]);
    }
  };

  const handleEmailDelete = (recipientMailToDelete: string) => {
    const updatedAlertRecipients = filter((recipientMail) => recipientMail !== recipientMailToDelete, alertRecipients);
    setAlertRecipients(updatedAlertRecipients);
  };

  return (
    <NotificationModal
      width="572px"
      destroyOnClose
      title="Configure Alert Recipients"
      maskClosable={false}
      closable={true}
      visible={visible}
      onCancel={closeModal}
      onOk={handleSubmit}
      okText="Save"
      testId="alert-recipients-modal-"
      data-test="alert-recipients-modal"
    >
      <NotificationContainer data-test="alert-recipients-notification">
        <NotificationHeader>Send alerts to these email addresses</NotificationHeader>
        {isLoading ? (
          <SpinningDominoLogoContainer>
            {
              isNil(whiteLabelSettings) ? <div /> : isNil(whiteLabelSettings?.appLogo) ? <SpinningDominoLogo height={15} width={15} /> :
                <LoadingOutlined style={{ fontSize: fontSizes.LARGE }} />
            }
          </SpinningDominoLogoContainer>
        ) : (
          <EmailSelectContainer
            mode={'tags'}
            dropdownStyle={{ display: 'none' }}
            tokenSeparators={[',', ';']}
            onSelect={handleEmailAdd}
            onDeselect={handleEmailDelete}
            value={alertRecipients}
          />
        )}
      </NotificationContainer>
    </NotificationModal>
  );
};

export default AlertRecipients;
