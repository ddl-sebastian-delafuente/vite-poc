import * as React from 'react';
import { isEmpty, isNil } from 'ramda';
import { StopOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ComputeClusterType } from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import dominoManagedInfoMessage, { labels } from './constants';
import StyledHeading from '../components/styled/elements/FormHeader';
import { CreateEnvironmentFormSection } from './styled/CreateEnvironmentFormSection';
import { InfoBox } from '@domino/ui/dist/components/Callout/InfoBox';
import SparkStarIcon from '../icons/SparkStarIcon';
import RayIcon from '../icons/RayIcon';
import DaskIcon from '../icons/DaskIcon';
import MPIIcon from '../icons/MPIIcon';
import { themeHelper } from '../styled';
import { greyishBrown, mineShaftColor } from '../styled/colors';
import * as R from 'ramda';
import Radio, { RadioChangeEvent, ItemsWithRadioProps } from '@domino/ui/dist/components/Radio';
import useStore from '../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

const ClusterTitle = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
  line-height: 16px;
  color: ${greyishBrown};
`;

const ComponentLayout = styled.div`
  margin-top: 0;
  .ant-radio {
    display: none; /* radio selector isn't needed */
  }
  && .ant-row {
    padding: 0;
  }
  .ant-legacy-form-item {
    margin-bottom: 5px;
  }
  .cluster-button-option{
    margin-bottom:8px;
  }
`;

const noClusterId = undefined;

const clusterIcon = {
  none: <StopOutlined style={{ color: mineShaftColor }}/>,
  Spark: <SparkStarIcon />,
  Ray: <RayIcon />,
  Dask: <DaskIcon />,
  MPI: <MPIIcon />
};

const StyledRadioOptionContent = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    font-size: ${themeHelper('fontSizes.small')};
    width: 60px;
`;

export type ClusterCheckboxProp = {
  clusterType: ComputeClusterType;
  label: string;
  infoMessage?: string;
};

export const allClusterTypes: ClusterCheckboxProp[] = [
  {
    clusterType: ComputeClusterLabels.Spark,
    label: labels.SPARK,
    infoMessage: dominoManagedInfoMessage.SPARK
  },
  {
    clusterType: ComputeClusterLabels.Ray,
    label: labels.RAY,
    infoMessage: dominoManagedInfoMessage.RAY
  },
  {
    clusterType: ComputeClusterLabels.Dask,
    label: labels.DASK,
    infoMessage: dominoManagedInfoMessage.DASK
  },
  {
    clusterType: ComputeClusterLabels.MPI,
    label: labels.MPI,
    infoMessage: dominoManagedInfoMessage.MPI
  }
];

export type Props = {
  selectedClusterTypes?: ComputeClusterType[];
  disabled: boolean;
  standalone?: boolean;
  isEditMode?: boolean;
  onClusterChange?: (clusterType: ComputeClusterType | undefined) => void;
};

const SupportedClusterTypesInput: React.FC<Props> = ({
  selectedClusterTypes = [],
  disabled,
  standalone = false,
  isEditMode = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClusterChange = (clusterType: ComputeClusterType | undefined) => undefined,
}) => {
  const { whiteLabelSettings } = useStore();
  const defaultSelectedCluster = React.useMemo(() => {
    if (isNil(selectedClusterTypes) || isEmpty(selectedClusterTypes)) {
      return undefined;
    }
    return selectedClusterTypes[0];
  }, [selectedClusterTypes]);

  const [selectedCluster, setSelectedCluster] = React.useState<ComputeClusterType | undefined>(defaultSelectedCluster);

  const setCluster = (clusterType: ComputeClusterType | undefined) => {
      onClusterChange(clusterType);
      setSelectedCluster(clusterType);
  };

  const Container = standalone ? 'div' : CreateEnvironmentFormSection;
  
  const getTextWithFixedWhiteLabel = replaceWithWhiteLabelling(getAppName(whiteLabelSettings));

  const items = [
    {
      key: 'none',
      value: noClusterId,
      disabled: isEditMode ? disabled : R.equals(selectedCluster, undefined) === false && disabled,
      'data-test': 'none-cluster',
      label: <StyledRadioOptionContent>
        {clusterIcon['none']}
        <ClusterTitle>{'none'}</ClusterTitle>
      </StyledRadioOptionContent>
    },
    ...(!R.isEmpty(allClusterTypes) ?
      R.map(({ clusterType, infoMessage }: ClusterCheckboxProp) => {
        const clusterName = clusterType === undefined ? 'none' : clusterType;
        const isSelected = R.equals(selectedCluster, clusterType);
        return {
          key: clusterName,
          value: clusterName,
          disabled: isEditMode ? disabled : isSelected === false && disabled,
          'data-test': `${clusterName}-cluster`,
          disabledReason: getTextWithFixedWhiteLabel(infoMessage ?? ''),
          label: <StyledRadioOptionContent>
            {clusterIcon[clusterName]}
            <ClusterTitle>{clusterName}</ClusterTitle>
          </StyledRadioOptionContent>,
        } as ItemsWithRadioProps<string | number>;
      }, allClusterTypes) : [])
  ];

  return (
    <Container data-test="clusterSelection">
      <ComponentLayout>
        {!standalone && (<StyledHeading>Supported Clusters</StyledHeading>)}
        {!isNil(selectedCluster) && (
          <input type="hidden" name="clusterTypes[]" value={selectedCluster} data-test="selected-cluster" />
        )}
        <Radio
          onChange={(ev: RadioChangeEvent) => setCluster(ev.target.value)}
          value={selectedCluster}
          optionType="button"
          size="large"
          spaceSize="large"
          items={items}
          style={{ marginBottom: '10px' }}
          direction="horizontal"
        />
        {isEditMode &&
          <InfoBox className={"info-box"} fullWidth={true} alternativeIcon={true}>
            Changing the supported clusters setting may cause errors in existing Workspaces, Jobs, and Scheduled Jobs
            using this Environment. Select "none" if you're unsure which supported clusters to use.
          </InfoBox>
        }
      </ComponentLayout>
    </Container>
  );
};

export default SupportedClusterTypesInput;
