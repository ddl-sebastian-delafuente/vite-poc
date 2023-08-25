import * as React from 'react';
import { equals, map } from 'ramda';
import styled from 'styled-components';
import { themeHelper } from '../styled';
import { btnGrey, brownishGrey, mineShaftColor } from '../styled/colors';
import Radio, { RadioChangeEvent, ItemsWithRadioProps } from '@domino/ui/dist/components/Radio';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const StyledRadioContent = styled.div`
  margin-left: ${themeHelper('margins.tiny')};
	display: inline-block;
	vertical-align: middle;
  white-space: normal;
`;

const VolumeSizeTitle = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  margin-top: ${({ $marginTop }: {$marginTop: string}) => $marginTop};
  color: ${mineShaftColor};
  line-height: 1;
`;

const VolumeSizeValue = styled.span`
  font-weight: ${themeHelper('fontWeights.bold')};
`;

const RecommendedVolumeSizeNote = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  margin-top: 6px;
  color: ${brownishGrey};
`;

interface VolumeSizeOption {
  key: string;
  value: number;
  content: React.ReactNode;
  style: Record<string, string>;
}

interface VolumeSizeSelectorProps {
	projectVolumeSizeInGiB: number;
  recommendedVolumeSizeInGiB?: number;
  onVolumeSizeChange?: (volumeSize: number) => void;
  isVolumeSizeDataFetching?: boolean;
}

const Wrapper = styled.div`
  .ant-radio-group {
    width: 100%;
  }
	.ant-radio-wrapper {
		margin: 0;
    width: 100%;
    margin-bottom: 7px;
    padding: 12px ${themeHelper('margins.medium')};
    background-color: white;
    border: 1px solid ${btnGrey};
    border-radius: ${themeHelper('borderRadius.standard')};
	}
  .ant-radio {
    top: 0;
  }
`;

const VolumeSizeSelector: React.FC<VolumeSizeSelectorProps> = ({
  projectVolumeSizeInGiB,
  recommendedVolumeSizeInGiB,
  onVolumeSizeChange,
  isVolumeSizeDataFetching
}) => {
  const { whiteLabelSettings } = useStore();
  const [volumeSize, setVolumeSize] = React.useState(projectVolumeSizeInGiB);

  const volumeSizeOptions: Array<VolumeSizeOption> = React.useMemo(() => {
    const projectSetting: VolumeSizeOption = {
      key: 'projectSetting',
      value: projectVolumeSizeInGiB,
      content: (
        <VolumeSizeTitle $marginTop="-8px">
          Use current volume size of <VolumeSizeValue>{projectVolumeSizeInGiB}GiB</VolumeSizeValue>
        </VolumeSizeTitle>),
      style: { height: '40px' }
    }
    const recommendedSetting: VolumeSizeOption = {
      key: 'recommendedSetting',
      value: recommendedVolumeSizeInGiB ?? 0,
      content: (
        <VolumeSizeTitle $marginTop="-4px">
          Use {getAppName(whiteLabelSettings)}’s recommended volume size of <VolumeSizeValue>{recommendedVolumeSizeInGiB}GiB</VolumeSizeValue>
          <RecommendedVolumeSizeNote>This calculation is based on your project size.</RecommendedVolumeSizeNote>
        </VolumeSizeTitle>),
      style: { height: '48px' }
    }
    setVolumeSize(projectVolumeSizeInGiB);
    if (onVolumeSizeChange) {
      onVolumeSizeChange(projectVolumeSizeInGiB);
    }
    return recommendedVolumeSizeInGiB && !equals(recommendedVolumeSizeInGiB, projectVolumeSizeInGiB) ?
      [projectSetting, recommendedSetting] : [projectSetting];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectVolumeSizeInGiB, recommendedVolumeSizeInGiB, whiteLabelSettings]);

  const onOptionSelect = (ev: RadioChangeEvent) => {
    setVolumeSize(ev.target.value);
    if (onVolumeSizeChange) {
      onVolumeSizeChange(ev.target.value);
    }
  };

  return (
    <Wrapper>
      { !isVolumeSizeDataFetching ? <Radio
        dataTest="volume-size"
        onChange={onOptionSelect}
        value={volumeSize}
        spaceSize="small"
        items={map(
          ({ key, value, content, style }) => {
            return {
              key: key,
              value: value,
              style: style,
              'data-test': `volume-size-${key}`,
              label: <StyledRadioContent data-test={`volume-size-${key}-content`}>
                {content}
              </StyledRadioContent>,
            } as ItemsWithRadioProps<string | number>;
          },
          volumeSizeOptions)}
      >
      </Radio> :
        <em>Loading volume size options...</em>
      }
    </Wrapper>
	);
};

export default VolumeSizeSelector;
