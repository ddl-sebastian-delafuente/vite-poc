import { Form } from 'antd';
import pluralize from 'pluralize';
import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../../styled/themeUtils';
import { numberRegexp } from '../../utils/regex';
import Button from '../Button/Button';
import {
  error as errorToast,
  success as successToast,
} from '../toastr';
import { QuotaSizeInputProps, QuotaSizeInput } from './QuotaSizeInput';
import { QuotaTableProps } from './QuotaTable';
import {
  BaseQuota,
  QuotaTarget,
  QuotaTargetSelectorProps,
  TransformPrefix2Abs,
} from './QuotaEditor.types';
import {
  QuotaTargetSelector as DefaultQuotaTargetSelector
} from './QuotaTargetSelector';

export const FormItem = styled(Form.Item)`
  .ant-form-item-label {
    font-weight: ${themeHelper('fontWeights.thick')};
    padding-bottom: 2px;
  }

  .ant-select-selection__placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }

  .ant-input::placeholder,
  .ant-input-number-input-wrap > input::placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }
`;

const LeftSide = styled.div`
  display: flex;

  & > * {
    margin-right: ${themeHelper('margins.tiny')};
  }
`;

const Wrapper = styled.div`
  align-items: end;
  display: flex;
  margin-bottom: ${themeHelper('margins.small')};

  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.tiny')};
  }

  & > *:first-child {
    flex: 1;
  }

  & > :last-child {
    margin-left: auto;
  }

  .ant-form-item {
    margin: 0;
  }
`

export interface QuotaEditorInputProps<T> extends
  Pick<QuotaTableProps<T>, 'targetType'>,
  Pick<QuotaTargetSelectorProps<T>, 'existingRecords'>,
  Pick<QuotaSizeInputProps, 'units'> {

  /**
   * Callback used to handle persisting with a API
   */
  performAdd: (newRecords: T[]) => Promise<void>;

  /**
   * A Optional custom label to display above the `QuotaTargetSelector`Input
   * Defaults to the value of `targetType`
   */
  quotaLimitLabel?: string;

  /**
   * A Optional custom label to display above the QuotaLimit Input
   * Defaults to "Quota"
   */
  quotaTargetLabel?: string;

  /**
   * A Optional custom target selector that must implement `QuotaTargetSelectorProps`
   * defaults to internal selector if not defined
   */
  QuotaTargetSelector?: React.FC<QuotaTargetSelectorProps<T>>;

  /**
   * A empty record with all the required props defined
   */
  recordInitializer: Readonly<T>;

  /**
   * Optional method that converts a value that has a unit prefix back to a absolute value.
   * This is useful if unit has different SI prefixes like bytes
   * If not defined will just pass through value
   */
  transformPrefix2Abs: TransformPrefix2Abs;
}

export const QuotaEditorInput = <T extends BaseQuota>({
  existingRecords = [],
  performAdd,
  quotaLimitLabel = 'Quota',
  quotaTargetLabel = 'Users',
  QuotaTargetSelector = DefaultQuotaTargetSelector,
  recordInitializer,
  targetType,
  transformPrefix2Abs,
  units,
}: QuotaEditorInputProps<T>) => {
  const [reload, setReload] = React.useState(false);
  const [selectedTargets, setSelectedTarget] = React.useState<QuotaTarget[]>([]);
  const [limit, setLimit] = React.useState<string>();

  const canAddException = React.useMemo(() => {
    const isValidLimit = limit && /^\d*(\.\d+)?$/.test(limit);
    return Boolean(selectedTargets.length > 0 && isValidLimit);
  }, [limit, selectedTargets]);

  const clearInputs = React.useCallback(() => {
    setLimit(undefined);
    setSelectedTarget([]);
  }, [setLimit, setSelectedTarget]);

  const handleLimitChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!numberRegexp.test(newValue)) {
      return;
    }
    
    setLimit(newValue);
  }, [setLimit]);

  const handleAddException = React.useCallback(async () => {
    const newRecords = selectedTargets.reduce((memo, { targetId, targetName }) => memo.concat([{
      ...recordInitializer,
      targetId,
      targetName,
      limit: transformPrefix2Abs(Number(limit))
    }]), [] as T[]);

    try {
      await performAdd(newRecords);
      successToast(`Added ${newRecords.length} ${pluralize('override', newRecords.length)}`);
    } catch (e) {
      errorToast('Failed to add overrides');
    }
    clearInputs();
    setReload(true);
  }, [
    clearInputs,
    limit,
    performAdd,
    recordInitializer,
    selectedTargets,
    setReload,
    transformPrefix2Abs
  ]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  return (
    <Wrapper>
      <LeftSide>
        {!reload && (
          <>
            <FormItem colon={false} label={quotaTargetLabel || targetType} labelCol={{span: 24}} wrapperCol={{span: 22}}>
              <QuotaTargetSelector existingRecords={existingRecords} onChange={setSelectedTarget} />
            </FormItem>
            <FormItem colon={false} label={quotaLimitLabel} labelCol={{span: 24}}>
              <QuotaSizeInput
                onChange={handleLimitChange}
                units={units}
                value={typeof limit === 'undefined' ? '' : limit}
              />
            </FormItem>
          </>
        )}
      </LeftSide>
      <Button
        disabled={!canAddException}
        onClick={handleAddException}
      >Add Override</Button>
    </Wrapper>
  );
}
