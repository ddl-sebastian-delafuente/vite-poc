import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Divider, InputNumber } from 'antd';
import { Checkbox, CheckboxChangeEvent } from '@domino/ui/dist/components';
import FlexLayout from '../../components/Layouts/FlexLayout';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import { DDFormItem } from '../../components/ValidatedForm';
import { themeHelper } from '../../styled/themeUtils';
import { colors } from '../../styled';

const ClusterSizeLabel = styled.span`
  font-weight: ${themeHelper('fontWeights.thick')};
  line-height: 16px;
  color: ${colors.mineShaftColor};
`;

const ClusterSizeLimit = styled.span`
  margin-left: 19px;
  font-weight: ${themeHelper('fontWeights.normal')};
  line-height: 16px;
  color: ${colors.darkerGray};
`;

const StyledDDFormItemWrapper = styled.div`
  margin: 0;
  .ant-legacy-form-item-children-icon {
    display: none;
  }
  .ant-legacy-form-explain {
    display: none;
  }
  .has-error .ant-input-number-focused, .has-error .ant-input-number:focus {
    border-color: ${colors.sunsetOrange};
  }
`;

const Wrapper = styled(FlexLayout)`
  & > * {
    margin-left: 0;
  }
  .ant-legacy-form-item-label span {
    font-weight: ${themeHelper('fontWeights.normal')};
    line-height: 16px;
    color: ${colors.mineShaftColor};
  }
  .ant-legacy-form-item {
    margin: 0 0 ${themeHelper('margins.tiny')};
  }
  .ant-checkbox-wrapper > span {
    padding: 0;
    font-weight: ${themeHelper('fontWeights.normal')};
  }
  .ant-divider {
    width: 60px;
    height: 1px;
    background: ${colors.cardHoverBorderColor};
  }
  .ant-divider-horizontal {
    display: inline-block;
    margin: 0;
    min-width: auto;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox {
    margin-left: 17px;
    margin-right: 7px;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  &.ant-input-number {
    width: 48px;
    height: 34px;
    margin-left: 0;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
`;

const CheckboxLabel = styled.span`
  font-weight: ${themeHelper('fontWeights.normal')};
  color: ${colors.mineShaftColor};
  line-height: 16px;
`;

const Capitalize = styled.span`
  text-transform: capitalize;
`;

const BlockLevelFlexLayout = styled(FlexLayout)`
  width: 100%;
`;

const StyledErrorMessage = styled.div`
 color: ${colors.sunsetOrange};
`;
export interface AutoScaleWorkerProps {
  workerLabel: string;
  limit?: number;
  minWorkerCount?: number;
  maxWorkerCount?: number;
  defaultMaxWorkerCount?: number;
  onMinWorkerCountChange?: (minValue?: number) => void;
  onMaxWorkerCountChange?: (maxValue?: string | number) => void;
  onClusterAutoScaleOptionChange?: (isEnabled: boolean) => void;
  executorsError?: boolean;
}

const AutoScaleWorker: React.FC<AutoScaleWorkerProps> = ({
  workerLabel,
  limit,
  minWorkerCount,
  maxWorkerCount,
  executorsError,
  defaultMaxWorkerCount,
  onMinWorkerCountChange,
  onMaxWorkerCountChange,
  onClusterAutoScaleOptionChange,
}) => {
  const [checked, setChecked] = React.useState<boolean>(Boolean(maxWorkerCount));
  const onCheck = (ev: CheckboxChangeEvent) => {
    const isChecked = ev.target.checked;
    setChecked(isChecked);
    if (onClusterAutoScaleOptionChange) {
      onClusterAutoScaleOptionChange(isChecked);
    }
    if (onMaxWorkerCountChange) {
      if (isChecked) {
        let count;
        if (maxWorkerCount) {
          count = maxWorkerCount;
        } else if (defaultMaxWorkerCount) {
          count = defaultMaxWorkerCount;
        } else if (minWorkerCount) {
          if (!R.isNil(limit) && minWorkerCount < limit) {
            count = minWorkerCount + 1;
          } else {
            count = minWorkerCount;
          }
        }
        onMaxWorkerValueChange(count);
      } else {
        onMaxWorkerCountChange(undefined);
      }
    }
  };

  const onMinWorkerValueChange = (value: number) => {
    if (onMinWorkerCountChange) {
      onMinWorkerCountChange(value);
    }
  };

  const onMaxWorkerValueChange = (value?: string | number) => {
    if (onMaxWorkerCountChange) {
      onMaxWorkerCountChange(value);
    }
  };

  const getErrorText = () => {
    if (executorsError) {
      if (R.isNil(minWorkerCount)) {
        return `Please enter min ${workerLabel}s value`;
      }
      else if (checked && R.isNil(maxWorkerCount)) {
        return `Please enter max ${workerLabel}s value`;
      }
      else if (!Number.isInteger(minWorkerCount)) {
        return `Min needs to be an integer`;
      }
      else if (maxWorkerCount && !Number.isInteger(maxWorkerCount)) {
        return `Max needs to be an integer`;
      }
      else if (minWorkerCount && limit && minWorkerCount > limit) {
        return `Min exceeds the limit of ${limit} workers`;
      }
      else if (minWorkerCount < 1) {
        return `Min needs to be at least 1`;
      }
      else if (minWorkerCount && !R.isNil(maxWorkerCount) && minWorkerCount >= maxWorkerCount) {
        return `Max needs to be greater than the min`;
      }
      else if (maxWorkerCount && limit && maxWorkerCount > limit) {
        return `Max exceeds the limit of ${limit} workers`;
      }
    }
    return null;
  }

  const minExecutorHasError = () => {
    if (executorsError) {
      if (!!minWorkerCount && minWorkerCount >= 1 && Number.isInteger(minWorkerCount)) {
        if (limit) {
          return minWorkerCount > limit;
        }
      } else {
        return true;
      }
    }
    return undefined;
  }

  const maxExecutorHasError = () => {
    if (!!executorsError && !!checked) {
      if (!!maxWorkerCount && Number.isInteger(maxWorkerCount)) {
        if (!!minWorkerCount && !!limit) {
          return maxWorkerCount <= minWorkerCount || maxWorkerCount > limit;
        }
      } else {
        return true;
      }
    }
    return undefined;
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // type="number" only allows below characters other than numbers from 0-9, so ignoring them
    const arrowDown = 'ArrowDown';
    if (event.key === '-' || event.key === '+' || event.key === 'e' || event.key === 'E' ||
      (event.key === arrowDown && Number(event.currentTarget.value) <= 0)
    ) {
      event.preventDefault();
    }
    event.stopPropagation();
  }

  React.useEffect(() => {
    if (!R.isNil(maxWorkerCount) && onClusterAutoScaleOptionChange) {
      onClusterAutoScaleOptionChange(true);
    }
    return () => {
      if (onClusterAutoScaleOptionChange) {
        onClusterAutoScaleOptionChange(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (Boolean(maxWorkerCount) && !checked) {
      setChecked(true);
    }
  }, [maxWorkerCount, checked]);

  return (
    <Wrapper alignItems="center" justifyContent="flex-start">
      <BlockLevelFlexLayout justifyContent="flex-start">
        <ClusterSizeLabel>Cluster Size</ClusterSizeLabel>
        <ClusterSizeLimit data-test="worker-sizeLimit">Limit: {limit} {workerLabel}s</ClusterSizeLimit>
      </BlockLevelFlexLayout>
      <FlexLayout>
        <StyledDDFormItemWrapper data-test="worker-minSize-form-control" >
          <DDFormItem label={`Min ${workerLabel}s`} error={minExecutorHasError()}>
            <StyledInputNumber
              min={0}
              data-test="worker-minSize"
              value={minWorkerCount}
              formatter={value => `${value}`.replace(/[^0-9.]/g, '')}
              onKeyDown={onInputKeyDown}
              type="number"
              onChange={onMinWorkerValueChange}
            />
            <Divider />
          </DDFormItem>
        </StyledDDFormItemWrapper>
        <StyledDDFormItemWrapper data-test="worker-maxSize-form-control">
          <DDFormItem label={`Max ${workerLabel}s`} error={maxExecutorHasError()}>
            <>
              {
                tooltipRenderer(
                  `Used for auto-scaling ${workerLabel}s`,
                  <span data-test="worker-maxSize-wrapper">
                    <StyledInputNumber
                      min={0}
                      data-test="worker-maxSize"
                      disabled={!checked}
                      value={maxWorkerCount}
                      type="number"
                      onKeyDown={onInputKeyDown}
                      formatter={value => `${value}`.replace(/[^0-9.]/g, '')}
                      // @ts-ignore
                      onChange={onMaxWorkerValueChange}
                    />
                  </span>
                )
              }
              <StyledCheckbox
                onChange={onCheck}
                checked={checked}
                data-test="enable-worker-autoscale"
              >
                {
                  tooltipRenderer(
                    <span>
                      <Capitalize>{workerLabel}</Capitalize>
                      <span> will be automatically scaled up to the max {workerLabel}s you set.</span>
                    </span>,
                    <CheckboxLabel data-test="enable-worker-autoscale-checkbox-label">
                      Auto-scale {workerLabel}s
                    </CheckboxLabel>
                  )
                }
              </StyledCheckbox>
            </>
          </DDFormItem>
        </StyledDDFormItemWrapper>
      </FlexLayout>
      <BlockLevelFlexLayout justifyContent="flex-start">
        {!!getErrorText() &&
          <StyledErrorMessage>{getErrorText()}</StyledErrorMessage>}
      </BlockLevelFlexLayout>
    </Wrapper>
  );
};

export default AutoScaleWorker;
