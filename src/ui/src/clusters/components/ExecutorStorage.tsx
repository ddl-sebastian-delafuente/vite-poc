import { Information } from '@domino/api/dist/types';
import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { InputNumber } from 'antd';
import { Checkbox, CheckboxChangeEvent } from '@domino/ui/dist/components';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { themeHelper } from '../../styled/themeUtils';
import { colors } from '../../styled';
import { convertToUnit, convertToUnitOrUndefined } from '../../utils/common';
import { EXECUTOR_STORAGE_LABEL_TEXT } from '../../constants';

const DEFAULT_EXECUTOR_STORAGE: Information = { value: 30, unit: 'GiB' };

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox {
    margin-right: 5px;
  }

  span {
    font-weight: ${themeHelper('fontWeights.thick')};
    color: ${colors.lightBlackThree};
    line-height: 1;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  width: 55px !important;
  margin-left: 6px !important;

  .ant-input-number-handler-wrap {
    display: none;
  }
`;

const LabelWrapper = styled.span`
  color: ${colors.lightBlackThree};
  font-size: ${themeHelper('fontSizes.TINY')};
`;

export interface ExecutorStorageProps {
  executorStorage?: Information;
  label?: string;
  dataTest?: string;
  onChange: (computeClusterExecutorStorage?: Information) => void;
}

const ExecutorStorage: React.FC<ExecutorStorageProps> = ({
  executorStorage,
  label = EXECUTOR_STORAGE_LABEL_TEXT,
  dataTest,
  onChange
}) => {
  const [checked, setChecked] = React.useState<boolean>(!R.isNil(executorStorage));
  const [executorStorageGiB, setExecutorStorageGiB] = React.useState<number>();

  React.useEffect(() => {
    const storageGiB = convertToUnitOrUndefined('GiB', executorStorage, 0);
    if (!R.isNil(storageGiB) && storageGiB > 0) {
      setExecutorStorageGiB(storageGiB);
    } else if (storageGiB == 0) {
      const defaultStorageGiB = convertToUnitOrUndefined('GiB', DEFAULT_EXECUTOR_STORAGE, 0)
      setExecutorStorageGiB(defaultStorageGiB);
    }
  }, []);

  const onCheck = (ev: CheckboxChangeEvent) => {
    const isChecked = ev.target.checked;
    setChecked(isChecked);
    const resolvedStorage = executorStorage ?
      executorStorage : DEFAULT_EXECUTOR_STORAGE;

    if (isChecked) {
      setExecutorStorageGiB(convertToUnit('GiB', resolvedStorage));
      onChange(resolvedStorage);
    } else {
      onChange(undefined);
    }
  };

  const onExecutorStorageChange = (storageGiB: number) => {
    if (!R.equals(storageGiB, executorStorageGiB)) {
      setExecutorStorageGiB(storageGiB);
      onChange({ value: storageGiB, unit: 'GiB' });
    }
  };

  const onExecutorStorageBlur = (ev: React.FocusEvent<HTMLInputElement, Element>) => {
    if (R.isNil(ev.target.value) || R.isEmpty(ev.target.value)) {
      setExecutorStorageGiB(convertToUnit('GiB', DEFAULT_EXECUTOR_STORAGE));
      onChange({ value: convertToUnit('GiB', DEFAULT_EXECUTOR_STORAGE), unit: 'GiB' });
    }
  };

  return (
    <FlexLayout alignItems="center" justifyContent="flex-start" data-test={dataTest}>
      <StyledCheckbox
        data-test={Boolean(dataTest) ? `${dataTest}-checkbox` : 'enable-local-storage'}
        checked={checked}
        onChange={onCheck}
        className="enable-local-storage-checkbox"
      >
        {label}
      </StyledCheckbox>
      <StyledInputNumber
        data-test={Boolean(dataTest) ? `${dataTest}-input` : 'local-storage-for-executors'}
        min={1}
        precision={0}
        formatter={value => `${value}`.replace(/[^0-9.]/g, '')}
        disabled={!checked}
        value={executorStorageGiB}
        onChange={onExecutorStorageChange}
        onBlur={onExecutorStorageBlur}
      />
      <LabelWrapper>{` GiB`}</LabelWrapper>
    </FlexLayout>
  );
};

export default ExecutorStorage;
