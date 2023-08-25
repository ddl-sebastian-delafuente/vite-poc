import { Form } from 'antd';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';
import { capitalize } from 'lodash';

import { themeHelper } from '../../styled/themeUtils';
import { numberRegexp } from '../../utils/regex';
import Modal, { DominoModalProps } from '../Modal';
import {
  success as successToast,
  error as errorToast,
} from '../toastr';
import { QuotaSizeInputProps, QuotaSizeInput } from './QuotaSizeInput';
import { 
  BaseQuota,
  TransformAbs2Prefix,
  TransformPrefix2Abs,
} from './QuotaEditor.types';

export interface QuotaExceptionModalProps<T> extends
  Pick<DominoModalProps, 'visible'>,
  Pick<QuotaSizeInputProps, 'units'> {
  onClose: () => void;

  /**
   * Called after `performUpdate` is successful
   */
  onUpdate: (updatedQuotaRecord: T ) => void;

  /**
   * Callback used to handle persisting with a API
   * should return a copy of the updated record.
   */
  performUpdate: (existingRecord: T, newLimit: number) => Promise<T>;
  quotaRecord: T | null;

  /**
   * Optional defines a custom data index for `targetName`
   *
   * Defaults: `targetName`
   */
  targetNameDataIndex: string | string[];

  /**
   * Defines the entity type of the target example Users or Projects
   */
  targetType: string;

  /**
   * Defines the override type for action confirmation or label
   */
  overrideType?: string;
  transformAbs2Prefix: TransformAbs2Prefix;
  transformPrefix2Abs: TransformPrefix2Abs;
}

export const StyledFormItem = styled(Form.Item)`
  font-weight: ${themeHelper('fontWeights.medium')};
`;

export const QuotaExceptionModal = <T extends BaseQuota>({
  onClose,
  onUpdate,
  performUpdate,
  quotaRecord,
  targetNameDataIndex = 'targetName',
  targetType,
  overrideType,
  transformAbs2Prefix,
  transformPrefix2Abs,
  units,
  visible,
}: QuotaExceptionModalProps<T>) => {
  const [inputValue, setInputValue] = React.useState<string>();

  const targetNamePath = React.useMemo(() => {
    if (!Array.isArray(targetNameDataIndex)) {
      return [targetNameDataIndex];
    }

    return targetNameDataIndex;
  }, [targetNameDataIndex]);

  const targetName = React.useMemo(() => {
    return R.path(targetNamePath, quotaRecord);
  }, [quotaRecord, targetNamePath]);

  const handleEdtQuota = React.useCallback(async () => {
    const newLimit = transformPrefix2Abs(Number(inputValue));

    try {
      if (!quotaRecord?.targetId) {
        throw new Error();
      }

      const updatedQuotaRecord = await performUpdate(quotaRecord, newLimit);
      successToast(`${capitalize(overrideType)} updated for ${targetName}`);
      onUpdate(updatedQuotaRecord)
    } catch (e) {
      errorToast(`Failed to update ${overrideType} for ${targetName}`);
    }
  }, [inputValue, onUpdate, performUpdate, quotaRecord, targetName, overrideType, transformPrefix2Abs]);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!numberRegexp.test(newValue)) {
      return;
    }
    
    setInputValue(newValue);
  }, [setInputValue]);

  React.useEffect(() => {
    if (quotaRecord && quotaRecord.limit) {
      const limit = transformAbs2Prefix(quotaRecord.limit);
      setInputValue(limit.toString());
    }
  }, [quotaRecord, setInputValue, transformAbs2Prefix]);

  const canSave = React.useMemo(() => {
    const inputValueNumber = Number(inputValue);
    return !isNaN(inputValueNumber) && inputValueNumber !== 0;
  }, [inputValue]);

  return (
    <Modal
      cancelText="Cancel"
      onCancel={onClose}
      okButtonProps={{
        disabled: !canSave
      }}
      onOk={handleEdtQuota}
      okText="Save"
      title={`Change ${capitalize(overrideType)} Override`}
      visible={visible}
    >
      <div>{`${targetType}: ${targetName}`}</div>
      <StyledFormItem label={`${capitalize(overrideType)} Per ${targetType} (${units})`}>
        <QuotaSizeInput onChange={handleInputChange} value={typeof inputValue === 'undefined' ? '' : inputValue} units={units}/>
      </StyledFormItem>
    </Modal>
  );
}
