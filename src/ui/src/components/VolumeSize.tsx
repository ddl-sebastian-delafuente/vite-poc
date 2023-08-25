import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { gt, isNil, lt } from 'ramda';
import { Input } from 'antd';
import { InputRef } from 'antd/lib/input';
import styled from 'styled-components';
import {
  getProjectSettings,
  updateProjectSettings
} from '@domino/api/dist/Projects';
import { DominoNucleusProjectProjectSettingsDto as ProjectSettings } from '@domino/api/dist/types';
import DominoLogoOnSubmitButton from '@domino/ui/dist/components/DominoLogoOnSubmitButton';
import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import {
  error as errorToast,
  success as successToast
} from './toastr';
import FlexLayout from './Layouts/FlexLayout';

export const updateButtonLabel = 'Update';
export const volumeSizeUpdateButtonTest = 'volume-size-update-button';

const DashedLabel = styled.span`
  padding-bottom: 2px;
  border-bottom: 1px dashed ${colors.lightSilver};
  font-weight: ${themeHelper('fontWeights.normal')};
  line-height: 1;
  color: ${colors.lightBlackOne};
`;

const InputWrap = styled.div`
  .ant-input-affix-wrapper {
    width: 100px;
    border-radius: ${themeHelper('borderRadius.standard')};
  }
  .ant-input-affix-wrapper .ant-input{
    min-height: auto;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  /* work around for safari browser for the 'gap' property */
  & > * + * {
    margin-left: ${themeHelper('paddings.small')};
  }
`;

export const volumeSizeUnit = 'GiB';

export interface VolumeSizeProps {
  projectId: string;
}

export default function VolumeSize({projectId}: VolumeSizeProps) {
  const [defaultValue, setDefaultValue] = useState<number>();
  const [minValue, setMinValue] = useState<number>();
  const [maxValue, setMaxValue] = useState<number>();
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>();
  const [loading, setLoading] = useState<boolean>(false);
  const volumeSizeInputRef: React.Ref<InputRef> = useRef(null);

  useEffect(() => {
    getProjectSettings({ projectId })
    .then((settings: ProjectSettings) => {
      setDefaultValue(settings.defaultVolumeSizeGiB);
      setMinValue(settings.minVolumeSizeGiB);
      setMaxValue(settings.maxVolumeSizeGiB);
      setProjectSettings(settings);
      setLoading(false);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
      errorToast('Something went wrong while fetching Volume size settings.');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNewValue: () => number = () => {
    if (volumeSizeInputRef && volumeSizeInputRef.current) {
      return Number(volumeSizeInputRef.current.input?.value);
    } else {
      return defaultValue!;
    }
  };

  const validateInput = (newValue?: number) => {
    // If new value is not the same as default value than it must be invalid and rejected by onValueChange
    if (!minValue || !maxValue) {
      errorToast('Error loading min and max volume sizes. Please refresh page to try again');
    } else if (isNil(newValue) || Number.isNaN(newValue) || newValue !== defaultValue) {
      errorToast('Please enter a valid value');
    } else if (gt(minValue, newValue)) {
      errorToast(`New value (${newValue} GiB) must be greater than ${minValue.toFixed(1)} GiB`);
    } else if (lt(maxValue, newValue)) {
      errorToast(`New value (${newValue} GiB) must be less than ${maxValue.toFixed(1)} GiB`);
    } else {
      return true;
    }
    return false;
  };

  const onValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = ev.target.value;
    const inputValueNum = Number(inputValue);
    if (!!inputValue && !Number.isNaN(inputValueNum)) {
      setDefaultValue(inputValueNum);
    }
  };

  const onUpdate = async () => {
    const newValue = getNewValue();
    if (validateInput(newValue)) {
      setDefaultValue(defaultValue);
      setLoading(true);
      await updateProjectSettings({
        projectId,
        body: {
          defaultEnvironmentId: projectSettings ? projectSettings.defaultEnvironmentId : undefined,
          defaultEnvironmentRevisionSpec: projectSettings ? projectSettings.defaultEnvironmentRevisionSpec : undefined,
          defaultHardwareTierId: projectSettings ? projectSettings.defaultHardwareTierId : undefined,
          defaultVolumeSizeGiB: defaultValue
        }
      })
      .then(() => {
        successToast(`Project's default volume size set to ${defaultValue} GiB`);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        errorToast('Something went wrong while updating project volume size');
      });
      setLoading(false);
    }
  };

  return (
    <FlexLayout justifyContent="space-between" flexDirection="row" data-test="volumeSize-input">
      {!!minValue && !!maxValue && <>
        <InputWrapper>
          <InputWrap>
            <Input
              defaultValue={defaultValue && defaultValue.toFixed(1)}
              onChange={onValueChange}
              onPressEnter={onUpdate}
              suffix={volumeSizeUnit}
              ref={volumeSizeInputRef}
            />
          </InputWrap>
          <DashedLabel>
            Min Size: {minValue && minValue.toFixed(1)} {volumeSizeUnit},
            Max Size: {maxValue && maxValue.toFixed(1)} {volumeSizeUnit}
          </DashedLabel>
        </InputWrapper>
        <DominoLogoOnSubmitButton
          key="submit"
          label={updateButtonLabel}
          htmlType="button"
          submitted={loading || false}
          onClick={onUpdate}
          disabled={loading || false}
          data-test={volumeSizeUpdateButtonTest}
        />
      </>}
    </FlexLayout>
  );
}
