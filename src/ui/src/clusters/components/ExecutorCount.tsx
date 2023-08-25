import * as React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd';
import { isNil, type } from 'ramda';
import { isNumber } from 'lodash';
import { QUOTA_MAX_HELP_TEXT } from '../../constants';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { themeHelper } from '../../styled/themeUtils';
import { colors } from '../../styled';
import { checkHwtierMessageForWorkerCount } from '../../clusters/util';
import HwtierError from '../../clusters/HwtierError';
import { DynamicFieldDisplay, FieldValue, FieldStyle } from '@domino/ui/dist/components/DynamicField';
import { FieldType, Layout } from '@domino/ui/dist/components/DynamicField/DynamicField.types';
const minValue = 1;

const invalidInputErr = 'Must be a positive integer less than or equal to the execution quota max.';

const HelpText = styled.span`
  padding-bottom: 2px;
  margin-left: ${themeHelper('margins.tiny')};
  border-bottom: 1px dashed ${colors.lightSilver};
  cursor: pointer;
`;

const ErrorText = styled.div`
  max-width: 300px;
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: 14px;
  color: ${colors.torchRed};
`;

const StyledFlexLayout = styled(FlexLayout)`
  .ant-legacy-form-item-control {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .ant-legacy-form-item {
    margin-bottom: ${({ reducedBottomMargin }: {reducedBottomMargin: boolean}) =>
      reducedBottomMargin ? '6px' : '14px'} !important;
  }

  .ant-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const StyledHwtierError = styled(HwtierError)`
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const DynamicFieldDisplayWrapper = styled.div`
  .ant-form-item-label {
    padding-bottom: 4px;
    line-height: 32px;
  }
  .ant-input-number {
    width: 55px !important;
    margin-left: 6px;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }
  .ant-form-item-control {
    flex-direction: row;
    align-items: center;
  }
  .ant-form-item-explain  {
    margin-left: ${themeHelper('margins.tiny')};
    span {
      border-bottom: 1px dashed ${colors.lightSilver};
    }
  }
`;

export interface ExecutorCountProps {
  label: string;
  workerCount?: number;
  quota?: number;
  testId?: string;
  maxValue?: number;
  checkForHwTierError: boolean;
  onChange: (executorCount?: number) => void;
}

const ExecutorCount: React.FC<ExecutorCountProps> = ({
  label = `Number of Executors`,
  workerCount,
  testId,
  maxValue,
  checkForHwTierError,
  onChange
}) => {

  const [validationError, setValidationError] = React.useState<string>();

  React.useEffect(() => {
    if (maxValue === 0 && !isNil(workerCount)) {
      onChange(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxValue]);

  const handleChange = (field: string, value: FieldValue) => {
    const validationErrorText = (type(value) !== 'Number' || (!isNil(value) && value <= 0)) ?
    invalidInputErr : undefined;
      setValidationError(validationErrorText);

    if (isNil(value)) {
      onChange(Number(value));
    }
    if (!isNil(value) && isNumber(value) && value > 0) {
      if (!isNil(maxValue) && value > maxValue) {
        (maxValue > 0) ? onChange(maxValue) : onChange(undefined);
      } else {
        onChange(Number(value));
      }
    }
  };

  const hwtierErrorMsg = checkForHwTierError ? checkHwtierMessageForWorkerCount(maxValue) : undefined;

  return (
    <StyledFlexLayout
      justifyContent="flex-start"
      alignItems="center"
      reducedBottomMargin={!isNil(hwtierErrorMsg) || !isNil(validationError)}
    >
      <DynamicFieldDisplayWrapper>
        <DynamicFieldDisplay
          data={{ workerCount: workerCount}}
          onChange={handleChange}
          editable={true}
          fieldStyle={FieldStyle.FormItem}
          testIdPrefix={testId}
          layout={{
            elements: [{
              fieldType: FieldType.inputNumber,
              label: label,
              path: 'workerCount',
              min: minValue,
              max: maxValue,
              helpText:  <Tooltip placement="bottomLeft" title={QUOTA_MAX_HELP_TEXT}>
                <HelpText data-test="quota">{`Max: ${maxValue}`}</HelpText>
              </Tooltip>
            }]
          } as Layout}
        />
      </DynamicFieldDisplayWrapper>
      {!isNil(hwtierErrorMsg) && <StyledHwtierError hwTierMessage={hwtierErrorMsg} />}
      {isNil(hwtierErrorMsg) && !isNil(validationError) && <ErrorText>{validationError}</ErrorText>}
    </StyledFlexLayout>
  );
};

export default ExecutorCount;
