import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { useEffect, useState, useCallback } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Tag, Tooltip } from 'antd';
import { kebabCase } from 'lodash';
import Highlight from 'highlight-react/dist/highlight';
import Select, { SelectProps as AbstractSelectProps } from '@domino/ui/dist/components/Select';
import {
  getProjectSettings,
  listHardwareTiersForProject,
  updateProjectSettings,
} from '@domino/api/dist/Projects';
import {
  DominoHardwaretierApiHardwareTierCapacity as HardwareTierCapacity,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';
import { useAccessControl, AccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import useStore from '@domino/ui/dist/globalStore/useStore';
import * as toastr from '../components/toastr';
import { colors } from '../styled';
import { hardwareTierCapacityInfoMap } from '../utils/hardwareTierCapacityUtil';
import { switchCase } from '../utils/prelude';
import { HardwareBubble } from './Icons';
import WarningBox from '@domino/ui/dist/components/Callout/WarningBox';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';


// STYLES

const selectDropdownStyle = { zIndex: 2500 };

const Option = Select.Option;
const OptGroup = Select.OptGroup;

const StyledSelect = styled(Select) <SelectProps>`
  width: ${props => props.width ? props.width + 'px' : '100%'};

  &&& .ant-select-selector {
    height: 36px;
  }

  .ant-select-selection-item {
    width: 100%;
    .description {
      height: 100%;
      .capacity {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0;
      }
      .tiercontainer {
        height: 100%;
        .tierinfo {
          display: flex;
          flex-direction: column;
          gap: 0;
          justify-content: center;
          .tiername {
            display: flex;
            height: 60%;
            margin: 0;
            line-height: 180%;
            align-items: flex-start;
          }
          .mutedText {
            height: 40%;
            margin: 0;
            line-height: 100%;
            justify-self: start;
            align-self: start;
          }
        }
      }
    }
  }

  svg {
    margin-right: 10px;
  }
`;

const PlaceholderNameDiv = styled.div`
  color: ${colors.lightBlackTwo};
`;
const TierNameDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;

  mark{
    background-color: ${colors.parisDiasy};
    padding:0;
  }
`;
const MutedTextDiv = styled.div`
  color: ${colors.secondaryTextGray};
  margin-top: -4px;
  font-size: 11px;

   mark{
    background-color: ${colors.parisDiasy};
    padding:0;
  }
`;
const DescriptionContainer = styled.div`
  padding-left: 1px;
`;
const CapacityLabel = styled.div`
  float: right;
  padding-top: 3px;
`;

const ErrorState = styled.div`
  font-style: italic;
  color: ${colors.rejectRedColor};
`;

const StyledSpecContainer = styled.div`
  display: flex;
  flex-direction: row;

  svg {
    margin-right: 10px;
    margin-top: 9px;
  }
`;

const StyledTag = styled(Tag)`
  &.ant-tag-has-color {
    color: ${props => props.color};
    background-color: transparent !important;
    font-weight: bold;
  }
`;

const WarningContent = styled(WarningBox)`
  width: 100%;
  line-height: ${themeHelper('fontSizes.medium')};
`;

// TYPES

export enum ExecutionType {
  Job = "Job",
  Workspace = "Workspace",
  App = "App",
  Cluster = "Cluster",
  ModelApi = "ModelApi",
  // When selector is displayed when not starting a run (project settings, etc.)
  None = "None",
}

export type DataItem = {
  key: string;
  label: JSX.Element;
};

export type CustomSelectProps = {
  width?: number;
};

type SelectProps = CustomSelectProps & AbstractSelectProps;

export type HardwareTierProps = {
  changeHandler?: (hardwareTier: HardwareTierWithCapacity | undefined) => void;
  data: HardwareTierWithCapacity[];
  disabled?: boolean;
  error?: boolean | undefined;
  getContainer?: () => HTMLElement;
  loading: boolean;
  selectedId?: string;
  setData?: (date: HardwareTierWithCapacity[]) => void;
  setError?: any;
  // Used to get through typing issues
  setLoading?: any;
  setSelected?: any;
  testId?: string;
  updateDefaultHardwareTierSettings?: (hardwareTier: HardwareTierWithCapacity) => void;
  updateProjectOnSelect?: boolean;
  width?: number;
  hybridEnabled?: boolean;
  restrictToDataPlaneId?: string;
  isError?: boolean;
  placeholderText?: string;
};

export type ComputeClusterRestrictions = {
  restrictToSpark: boolean;
  restrictToRay: boolean;
  restrictToDask: boolean;
  restrictToMpi: boolean,
};

export type HardwareTierWithDataFetchDataProps = {
  changeHandler?: (hardwareTier: HardwareTierWithCapacity | undefined) => void;
  computeClusterRestrictions?: ComputeClusterRestrictions;
  disabled?: boolean;
  executionType?: ExecutionType;
  getContainer?: () => HTMLElement;
  hardwareTiersData?: HardwareTierWithCapacity[];
  overrideDefaultValue?: boolean;
  projectId: string;
  selectedId?: string;
  testId?: string;
  updateProjectOnSelect?: boolean;
  width?: number;
  restrictToDataPlaneId?: string;
  isError?: boolean;
  placeholderText?: string;
};

export type GpuConfiguration = {
  numberOfGpus: number,
  gpuKey: string
};

// FUNCTIONS

async function getHardwareTiers(
  projectId: string
) {
  return await listHardwareTiersForProject({ projectId });
}

const formatPrice = (price: number) => Number((price / 100).toFixed(4));

export const getHardwareTierPrice = (hardwareTierPrice: number) =>
  hardwareTierPrice > 0 ? ` \u00b7 $${formatPrice(hardwareTierPrice)}/min` : '';

function getGpuLabel(numberOfGpus?: number) {
  if (R.isNil(numberOfGpus) || numberOfGpus === 0) {
    return '';
  } else if (numberOfGpus === 1) {
    return `\u00b7 1 GPU`;
  } else {
    return `\u00b7 ${numberOfGpus} GPUs`;
  }
}

const HardwareTierSpecs =
  ({ cores, memory, centsPerMinute, gpuConfiguration, searchWord }: { cores: number, memory: number, centsPerMinute: number, gpuConfiguration?: GpuConfiguration, searchWord?: string }) => {
    const priceLabel = getHardwareTierPrice(centsPerMinute);
    const coresLabel = cores === 1 ? '1 core' : `${cores} cores`;
    const ramLabel = `${memory} GiB RAM`;
    const gpuLabel = getGpuLabel(gpuConfiguration?.numberOfGpus);
    const label = `${coresLabel} \u00b7 ${ramLabel} ${gpuLabel} ${priceLabel}`;
    return <MutedTextDiv className="mutedText"><Highlight search={searchWord}>{label}</Highlight></MutedTextDiv>;
  };

const HardWareTierFilterSpecs = (cores: number, memory: number, centsPerMinute: number, gpuConfiguration?: GpuConfiguration) => {
  const priceLabel = getHardwareTierPrice(centsPerMinute);
  const coresLabel = cores === 1 ? '1 core' : `${cores} cores`;
  const ramLabel = `${memory} GiB RAM`;
  const gpuLabel = getGpuLabel(gpuConfiguration?.numberOfGpus);
  const label = `${coresLabel} - ${ramLabel} - ${gpuLabel} - ${priceLabel}`;
  return label;
};

// function to lookup hardware tier info from key
const propsForHardwareTier = switchCase(hardwareTierCapacityInfoMap)({});

// generate the label tag component
const HardwareTierCapacityLabel = ({ capacity }: { capacity: HardwareTierCapacity }) => {
  // have to set it to any as the type doesnt include name
  const { formattedPrincipal, whiteLabelSettings } = useStore();
  const hardwareTierCapacityFetchingEnabled = formattedPrincipal!.hardwareTierCapacityFetchingEnabled;
  if (hardwareTierCapacityFetchingEnabled) {
    const name = capacity.capacityLevel;
    const { tagColor, labelText, tooltipText } = propsForHardwareTier(name);
    return (
      <Tooltip title={replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(tooltipText)}>
        <StyledTag color={tagColor}>
          {labelText}
        </StyledTag>
      </Tooltip>
    );
  } else {
    return null;
  }
};

type HardwareTierDescriptionProps = HardwareTierWithCapacity & { selectedHwtId?: string, dropdownOpen: boolean, hybridEnabled?: boolean, searchWord: string }
// description in the selection menu list component
const HardwareTierDescription = ({
  hardwareTier,
  capacity,
  dataPlane,
  selectedHwtId,
  dropdownOpen,
  hybridEnabled,
  searchWord
}: HardwareTierDescriptionProps) => (
  <Highlight search={searchWord}>
    <DescriptionContainer className="description">
      <CapacityLabel className="capacity">
        {hybridEnabled && !dropdownOpen && hardwareTier.id === selectedHwtId && <Tag>{dataPlane.name}</Tag>}
        <HardwareTierCapacityLabel capacity={capacity} />
      </CapacityLabel>
      <StyledSpecContainer className="tiercontainer">
        <HardwareBubble height={16} width={16} />
        <span className="tierinfo">
          <TierNameDiv className="tiername">
            {hardwareTier.name}
          </TierNameDiv>
          <HardwareTierSpecs {...hardwareTier} searchWord={searchWord} />
        </span>
      </StyledSpecContainer>
    </DescriptionContainer>
  </Highlight>
);

type ExtendedDataItem = DataItem & { name: string, dataPlaneName: string, isHealthy: boolean };
const generateDataItem = (key: string, label: any, name: string, dataPlaneName: string, isHealthy: boolean): ExtendedDataItem => ({ key, label, name, dataPlaneName, isHealthy });

const generateSelectItemFromHardwareTierCapacity = (hwt: HardwareTierWithCapacity, selectedHwtId: string, dropdownOpen: boolean, searchWord: string, hybridEnabled?: boolean) =>
  generateDataItem(hwt.hardwareTier.id as string, <HardwareTierDescription {...hwt} selectedHwtId={selectedHwtId} dropdownOpen={dropdownOpen} hybridEnabled={hybridEnabled} searchWord={searchWord} />, hwt.hardwareTier.name, hwt.dataPlane.name, hwt.dataPlane.isHealthy);

const generateOptionsFromDataItems = (items: ExtendedDataItem[], testId?: string) => {

  return (
    (items.map(hwt =>
      <Option
        value={hwt.key}
        key={hwt.key}
        data-test={kebabCase(`${testId ? testId : ''}-${hwt.name ?? hwt.label.props.name}`)}
        disabled={!hwt.isHealthy}
        search-value={`${hwt.name}-${HardWareTierFilterSpecs(hwt.label.props.hardwareTier.cores, hwt.label.props.hardwareTier.memory, hwt.label.props.hardwareTier.centsPerMinute, hwt.label.props.hardwareTier.gpuConfiguration)}`}
      >
        {hwt.label}
      </Option >
    )))
}

const submitSelectedItem = (
  callback: (item?: HardwareTierWithCapacity) => void,
  updateHwtSettings: (hardwareTier?: HardwareTierWithCapacity) => void
) => (items: HardwareTierWithCapacity[]) =>
    (hwt: DataItem) => {
      if (hwt.key) {
        const item = items.find(x => x.hardwareTier.id === hwt.key);
        updateHwtSettings(item);
        callback(item);
      } else {
        callback();
      }
    };

interface GetSelectedHwtProps {
  accessControl: AccessControl,
  data: HardwareTierWithCapacity[],
  selectedId?: string,
  projectDefaultHardwareTierId?: string,
  restrictToDataPlaneId?: string,
}
const getSelectedHwt = ({
  accessControl,
  data,
  selectedId,
  projectDefaultHardwareTierId,
  restrictToDataPlaneId,
}: GetSelectedHwtProps): HardwareTierWithCapacity | undefined => {

  // If user is a data analyst select the first item
  if (accessControl.isDataAnalystUser && data.length === 1) {
    const [dataAnalystHwt] = data;
    return dataAnalystHwt;
  }

  // Filter out hwt's on restriced data planes
  const validHwts = restrictToDataPlaneId ? data.filter(hwt => hwt.dataPlane.id == restrictToDataPlaneId) : data;

  // find the selected whether passed as props or it's the project's default HWT
  return selectedId ?
    validHwts.find(hwt => hwt.hardwareTier.id === selectedId) :
    validHwts.find(hwt => hwt.hardwareTier.id === projectDefaultHardwareTierId);
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (hwt?: any) => undefined;

export const GenericHardwareTierSelect = (props: HardwareTierProps) => {
  const [dropdownOpen, setOpen] = useState(false);
  const { data, changeHandler, selectedId, disabled, loading, error, testId, updateDefaultHardwareTierSettings = noop,
    updateProjectOnSelect = false, width, hybridEnabled, restrictToDataPlaneId, isError } = props;
  const [searchWord, setSearchWord] = React.useState<string>('');

  const accessControl = useAccessControl();
  const computedDisabled = React.useMemo(() => {
    if (disabled) {
      return disabled;
    }

    return !accessControl.hasAccess();
  }, [accessControl, disabled]);

  const selected = getSelectedHwt({ accessControl, data, selectedId, restrictToDataPlaneId });

  const selectedHwtId = selected ? selected.hardwareTier.id : ''

  // setup the change handler
  const updateSettingsFunc = updateProjectOnSelect ? updateDefaultHardwareTierSettings : noop;
  const handleChange = submitSelectedItem(changeHandler || noop, updateSettingsFunc)(data);

  // Backend sends the sorted list. FE doesn't have to worry about sorting anymore.
  const items = data.map((item) => generateSelectItemFromHardwareTierCapacity(item, selectedHwtId, dropdownOpen, searchWord, hybridEnabled));

  // determined the state of the dropdown
  const displayNoDataState = React.useMemo(() => {
    if (error) {
      return <ErrorState>Error getting hardware tiers!</ErrorState>;
    }
    if (loading) {
      return <i>Loading hardware tiers...</i>;
    }

    if (!items.length && !accessControl.hasAccess()) {
      return <i>Data Analyst Hardware Tier not selected. Ask your admin to select one</i>;
    }

    if (!items.length) {
      return <i>No hardware tiers found</i>;
    }
    return;
  }, [
    accessControl,
    loading,
    items,
    error
  ]);

  const options = React.useMemo(() => {
    if (hybridEnabled) {
      const groups = items.reduce((groups, item) => {
        groups[item.dataPlaneName] = [...groups[item.dataPlaneName] || [], item];
        return groups;
      }, {});
      return Object.keys(groups).map(key =>
        <OptGroup key={key} label={(key === "" ? "Local" : key) + (groups[key][0].isHealthy ? "" : " (unhealthy)")}>
          {generateOptionsFromDataItems(groups[key], testId)}
        </OptGroup>
      );

    }

    return generateOptionsFromDataItems(items, testId);
  }, [
    hybridEnabled,
    items,
    testId
  ]);

  const placeholder = <PlaceholderNameDiv>{props.placeholderText || 'Choose a hardware tier'}</PlaceholderNameDiv>;
  return (
    <div>
      {
        displayNoDataState ?
          // Looks odd, but we need to have the div's in here for the default selection to show as selected
          <div><StyledSelect aria-busy={loading} width={width} placeholder={displayNoDataState} disabled={true} /></div> :
          <StyledSelect
            getPopupContainer={(trigger: { parentNode: any; }) => trigger.parentNode}
            data-test={testId}
            placeholder={placeholder}
            dropdownStyle={selectDropdownStyle}
            labelInValue={true}
            value={selected ? selectedHwtId : undefined}
            width={width}
            onChange={handleChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
            disabled={computedDisabled}
            aria-busy={loading}
            open={dropdownOpen}
            onDropdownVisibleChange={(visible) => setOpen(visible)}
            status={isError ? 'error' : undefined}
            showSearch={true}
            onSearch={(value: string) => setSearchWord(value)}
            optionFilterProp={'search-value'}
            filterOption={true}
            onSelect={() => setSearchWord('')}
          >
            {options}
          </StyledSelect>
      }
    </div>
  );
};

export const updateSettings = async (projectId: string, defaultHardwareTierId: string) => {
  try {
    await updateProjectSettings({ projectId, body: { defaultHardwareTierId } });
    toastr.success('Hardware Tier updated for project');
  } catch (err) {
    console.warn('updateSettings', err);
    toastr.error('Could not set Hardware Tier');
  }
};

const GenericHardwareTierSelectContainer = (props: HardwareTierWithDataFetchDataProps) => {
  const { projectId, selectedId, changeHandler, hardwareTiersData, restrictToDataPlaneId } = props;
  const [data, setData] = useState<HardwareTierWithCapacity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [selected, setSelected] = useState<HardwareTierWithCapacity>();
  const [projectDefaultHardwareTierId, setProjectDefaultHardwareTierId] = useState<string>();
  const { formattedPrincipal, whiteLabelSettings } = useStore();
  const accessControl = useAccessControl();

  const hybridEnabled = formattedPrincipal?.enableHybrid || false;
  let hybridSupported = false;
  switch (props.executionType) {
    case ExecutionType.Job:
      hybridSupported = true;
      break;
    case ExecutionType.Workspace:
      hybridSupported = true;
      break;
    case ExecutionType.Cluster:
      hybridSupported = true;
      break;
    case ExecutionType.ModelApi:
      hybridSupported = true
  }

  async function fetchData() {
    try {
      setLoading(true);
      let hardwareTiers = !R.isNil(hardwareTiersData) ? hardwareTiersData : await getHardwareTiers(projectId);

      // Hybrid Checks
      if (restrictToDataPlaneId) {
        // If restricted to data plane, filter for this id.
        hardwareTiers = hardwareTiers.filter(hwt => hwt.dataPlane.id === props.restrictToDataPlaneId);
      } else if (!hybridEnabled || !hybridSupported) {
        // Else if Hybrid disabled or execution type not supported, filter all non-local data planes
        hardwareTiers = hardwareTiers.filter(hwt => hwt.dataPlane.isLocal);
      }

      // Restrict workspaces to data planes where the hostname is configures
      if (props.executionType && props.executionType == ExecutionType.Workspace) {
        hardwareTiers = hardwareTiers.filter(hwt => hwt.dataPlane.isLocal || !R.isNil(hwt.dataPlane.configuration.address))
      }

      /*
      We want to present users with the correct hardware tiers that correspond to the compute cluster restrictions
      that they'd like to enforce

      For some generic things, such as launching generic workspaces, jobs, apps, etc -- we want to show users the
      UNRESTRICTED HWT's
      This means HWT's that have `false` values for Spark, Ray, and Dask restrictions in the HWT admin panel

      For specific compute clusters, we want to present users with those HWT's that are either unrestricted OR are
      restricted to that particular cluster
       */

      // this filter gives us all HWT's that are false for all compute cluster restrictions -- aka unrestricted
      const unrestrictedTiers = hardwareTiers.filter(hwt =>
        !!hwt.hardwareTier.computeClusterRestrictions &&
        !hwt.hardwareTier.computeClusterRestrictions.restrictToSpark &&
        !hwt.hardwareTier.computeClusterRestrictions.restrictToRay &&
        !hwt.hardwareTier.computeClusterRestrictions.restrictToDask &&
        !hwt.hardwareTier.computeClusterRestrictions.restrictToMpi
      );

      // we've introduced a new prop computeClusterRestrictions, which tells us which clusters that we want to restrict to and should
      // inform the HWT dropdown
      // this filter gives us all hardware tiers that match the computeClusterRestrictions prop for each particular cluster
      const computeClusterFilteredTiers = hardwareTiers.filter(hwt =>
        (!!hwt.hardwareTier.computeClusterRestrictions && !!props.computeClusterRestrictions) &&
        (
          (hwt.hardwareTier.computeClusterRestrictions.restrictToSpark &&
            props.computeClusterRestrictions.restrictToSpark) ||
          (hwt.hardwareTier.computeClusterRestrictions.restrictToRay &&
            props.computeClusterRestrictions.restrictToRay) ||
          (hwt.hardwareTier.computeClusterRestrictions.restrictToDask &&
            props.computeClusterRestrictions.restrictToDask) ||
          (hwt.hardwareTier.computeClusterRestrictions.restrictToMpi &&
            props.computeClusterRestrictions.restrictToMpi)
        )
      );

      // if computeClusterRestrictions does not exist, get ONLY the unrestricted HWT's
      // if computeClusterRestrictions exists and is false for all clusters, get ONLY the unrestricted HWT's
      // if computeClusterRestrictions exists and is true for at least one cluster, get the restricted HWT's for those
      // clusters ONLY
      // this filter will select between showing either the unrestricted tiers or the compute cluster filtered tiers
      const filteredHardwareTiers = !props.computeClusterRestrictions ||
        (!!props.computeClusterRestrictions &&
          !props.computeClusterRestrictions.restrictToSpark &&
          !props.computeClusterRestrictions.restrictToRay &&
          !props.computeClusterRestrictions.restrictToDask &&
          !props.computeClusterRestrictions.restrictToMpi) ?
        unrestrictedTiers : computeClusterFilteredTiers;

      // per the requirements, if the number of HWT's AFTER filtering for specific CC restrictions is 0,
      // then show all HWT's
      const hardwareTiersToShow = (filteredHardwareTiers.length > 0) ? filteredHardwareTiers : hardwareTiers;

      const projectSettings = await getProjectSettings({ projectId });

      const projectsDefaultHardwareTierId = projectSettings.defaultHardwareTierId;
      setProjectDefaultHardwareTierId(projectsDefaultHardwareTierId);

      const selectedHwt = getSelectedHwt({
        data: hardwareTiersToShow,
        selectedId,
        projectDefaultHardwareTierId: projectsDefaultHardwareTierId,
        accessControl,
        restrictToDataPlaneId,
      });

      if (selectedId && selectedHwt && selectedHwt.hardwareTier.id !== selectedId) {
        setSelected(selectedHwt);
        (changeHandler || noop)(selectedHwt);
      }
      if (setData) {
        setData(hardwareTiersToShow);
      }
    } catch (err) {
      console.warn(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restrictToDataPlaneId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardwareTiersData]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedPrincipal]);

  useEffect(() => {
    if (data) {
      const newSelected = getSelectedHwt({
        accessControl,
        data,
        projectDefaultHardwareTierId,
        selectedId,
        restrictToDataPlaneId,
      });
      if (newSelected && (!selected || newSelected.hardwareTier.id !== selected.hardwareTier.id)) {
        setSelected(newSelected);
        (changeHandler || noop)(newSelected);
      }
    }
  }, [accessControl, selectedId, changeHandler, data, selected, projectDefaultHardwareTierId, restrictToDataPlaneId]);

  const updateDefaultHardwareTierSettings = useCallback(async ({ hardwareTier }: HardwareTierWithCapacity) => {
    await updateSettings(projectId, hardwareTier.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GenericHardwareTierSelect
        {...props}
        data={data}
        loading={loading}
        error={error}
        setData={setData}
        setLoading={setLoading}
        setError={setError}
        setSelected={setSelected}
        updateDefaultHardwareTierSettings={updateDefaultHardwareTierSettings}
        hybridEnabled={hybridEnabled}
        placeholderText={props.placeholderText}
      />
      {selected?.dataPlane.configuration.fileSyncDisabled &&
        <WarningContent>{`File syncing has been disabled in the selected Data Plane & Hardware Tier by your ${getAppName(whiteLabelSettings)} Admin.Contact your Admin for more information.`}</WarningContent>}
    </>
  );
};
export default GenericHardwareTierSelectContainer;
