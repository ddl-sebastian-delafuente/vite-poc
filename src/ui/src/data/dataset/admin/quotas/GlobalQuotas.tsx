import * as Quota from '@domino/api/dist/Quota';
import { Form } from 'antd';
import * as React from 'react';

import Button from '../../../../components/Button/Button';
import {
  error as errorToast,
  success as successToast,
} from '../../../../components/toastr';
import { QuotaSizeInput } from '../../../../components/QuotaEditor/QuotaSizeInput';
import { StyledFormItemComposite } from '../../../../components/QuotaStyles';
import { numberRegexp } from '../../../../utils/regex';
import { gigabytesToBytes } from '../quota.utils';

export interface GlobalQuotas {
  onUpdate?: () => void;
  quota?: number
}

export const GlobalQuotas = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdate = () => {},
  quota,
}: GlobalQuotas) => {
  const [internalQuota, setInternalQuota] = React.useState(quota);
  const [inputValue, setInputValue] = React.useState<string>(quota ? quota.toString() : '')
  const [form] = Form.useForm();

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!numberRegexp.test(newValue)) {
      return;
    }

    setInputValue(newValue);
  }, [setInputValue]);

  const handleClear = React.useCallback(async () => {
    try {
      await Quota.updateQuota({
        body: {
          quotaLimit: 0,
        }
      });

      successToast('Quota Cleared');
      setInternalQuota(undefined);
      setInputValue('');
      onUpdate();
    } catch (e) {
      errorToast('Failed to clear Quota');
    }
  }, [onUpdate, setInternalQuota, setInputValue]);

  const handleUpdate = React.useCallback(async () => {
    const inputValueNumber = Number(inputValue);
    const quotaInBytes = gigabytesToBytes(inputValueNumber);
    try {
      await Quota.updateQuota({
        body: {
          quotaLimit: quotaInBytes,
        }
      });

      successToast('Quota Saved');
      setInternalQuota(inputValueNumber)
      onUpdate();
    } catch (e) {
      errorToast('Failed to save Quota');
    }
  }, [inputValue, onUpdate, setInternalQuota]);

  const isClearDisabled = React.useMemo(() => {
    return !quota;
  }, [quota]);

  const isSaveDisabled = React.useMemo(() => {
    const inputValueNumber = Number(inputValue);

    return isNaN(inputValueNumber) || inputValueNumber === 0 || internalQuota === inputValueNumber;
  }, [internalQuota, inputValue]);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
      >
        <StyledFormItemComposite label="User Datasets & Snapshots quota">
          <QuotaSizeInput placeholder="Enter Quota Value" onChange={handleChange} value={typeof inputValue === 'undefined' ? '' : inputValue}/>
          <Button disabled={isSaveDisabled} onClick={handleUpdate}>Save</Button>
          <Button disabled={isClearDisabled} onClick={handleClear}>Clear Default Quota</Button>
        </StyledFormItemComposite>
      </Form>
    </div>
  );
}
