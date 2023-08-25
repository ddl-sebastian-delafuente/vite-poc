import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as R from 'ramda';
import styled from 'styled-components';
import { kebabCase } from 'lodash';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  DominoEnvironmentsApiEnvironmentDetails as UserEnvironments,
  DominoProjectsApiEnvironmentDetails as EnvironmentDetails,
  DominoProjectsApiEnvironmentOwner as OwnerType,
  DominoProjectsApiSelectedEnvironmentDto as SelectedEnvironment,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments,
} from '@domino/api/dist/types';
import Select from '@domino/ui/dist/components/Select/Select';
import * as colors from '@domino/ui/dist/styled/colors';
import { EnvironmentsIcon } from '@domino/ui/dist/components/Icons';
import { findEnvInComputeData, unsuitableEnvErr } from '@domino/ui/dist/components/ComputeEnvironmentDropdown';
import DangerBox from '@domino/ui/dist/components/Callout/DangerBox';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { useAccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import { themeHelper } from '..';
import { RouterType } from '../utils';
import Link from './Link';
import { ACTIVE_REVISION } from './utils/envUtils';

export type ChangeHandlerOptionType = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

type GroupedEnvironments = {
  Curated: ConsolidatedCustomEnvironmentType[];
  Global: ConsolidatedCustomEnvironmentType[];
  Private: ConsolidatedCustomEnvironmentType[];
  Organization: ConsolidatedCustomEnvironmentType[];
};

export const EMPTY_PLACEHOLDER_TEXT = 'Select Compute Environment';

const StyledSelect = styled(Select)`
  width: 410px;

  & .ant-select-selection-selected-value .mutedText {
    display: none;
  }

  & .ant-select-selection-selected-value .capacity {
    padding: 0;
    margin-top: -1px;
  }
`;

const StyledComputeSelect = styled(Select)<{ selectorHeight: string }>`
  &&& .ant-select-selector {
    height: ${({ selectorHeight }) => selectorHeight }px;
    .ant-select-selection-item > div {
      height: 100%;
    }
  }
`;

export const GroupTitle = styled.b`
  color: ${colors.secondaryBackground};
`;

export const StyledDropdownContent = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
    min-width: 16px;
  }
`;

export const ComponentLayout = styled.div`
  display: flex;
  flex-direction: row;

  .env-btn {
    min-width: 175px;
  }

  svg {
    margin-right: 10px;
    min-width: 16px;
  }
`;

export const StyledDiv = styled.div`
  margin-top: 6px;
  line-height: 18px;
`;

export const ErrorState = styled.div`
  font-style: italic;
  color: ${colors.rejectRedColor};
`;

const EnvName = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const RevDetails = styled.div`
  margin-left: ${themeHelper('paddings.small')};
  color: ${colors.neutral500};
`;

const HelpText = styled.div`
  color: ${colors.mediumGrey};
  font-size: ${themeHelper('fontSizes.small')};
  padding-top: ${themeHelper('paddings.tiny')};
`;

const StyledFlexLayout = styled(FlexLayout)`
  padding: ${themeHelper('margins.small')} 0 ${themeHelper('margins.small')} ${themeHelper('margins.large')};
  border-bottom: 1px solid ${colors.btnGrey};
  color:  ${colors.neutral900};
`;

export interface EnvironmentHelpBlockProps {
  environmentDetails?: EnvironmentDetails;
  environments?: Array<ConsolidatedCustomEnvironmentType>;
  children: React.ReactElement<any> | null;
}

// TODO version can never be 1
export const optionTitle = (env: ConsolidatedCustomEnvironmentType) =>
  `${env.name} ${'version' in env ? (env.version === 1 ? '*' : '') : ''}${env.archived ? ' (archived)' : ''}`.trim();

/**
 * Renders the group options for the dropdown list
 * @param groupTitle
 * @param dataSource
 * @param isRestrictedProject
 */
export const getOptions = (groupTitle: string, dataSource: Array<ConsolidatedCustomEnvironmentType>, isRestrictedProject?: boolean) => {
  const data: {
    label: JSX.Element;
    value: string;
    'data-title': string;
    'data-group-title': string;
    'data-test': string;
    'search-value': string;
  }[] = [];
  dataSource.sort((env1, env2) => env1.name.localeCompare(env2.name, 'en', { sensitivity: 'base' }))
    .map(env => {
      const title = optionTitle(env);
      data.push({
        label: <StyledDropdownContent>
          <EnvironmentsIcon width={16} height={16} />
          <EnvName title={env.name}>{title}</EnvName>
          {isRestrictedProject && env.restrictedRevisionNumber && (<RevDetails>
            Rev #{env.restrictedRevisionNumber}
          </RevDetails>)}
        </StyledDropdownContent>,
        value: env.id,
        'data-title': title,
        'data-group-title': groupTitle,
        'search-value': groupTitle + '-' + title,
        'data-test': kebabCase(title)
      });
    });
  return {
    label: <GroupTitle>{groupTitle}</GroupTitle>,
    options: data,
    'search-value': groupTitle,
  }
};

/**
 * Group the environments based onvisibility
 * @param environments
 */
export const transformResultsToDataSource = (environments: Array<ConsolidatedCustomEnvironmentType>): GroupedEnvironments => {
  const [curatedEnvs, rest] = R.partition(R.propEq('isCurated', true))(environments);
  const groupedEnvs = R.groupBy((data: ConsolidatedCustomEnvironmentType) => data.visibility)(rest);
  return {
    Curated: curatedEnvs,
    Global: groupedEnvs.Global || [],
    Private: groupedEnvs.Private || [],
    Organization: groupedEnvs.Organization || [],
  };
}

/**
 * Group the environments by username
 * @param environments
 */
export const transformResultsToOrganizationDataSource = (environments: Array<ConsolidatedCustomEnvironmentType>) =>
  R.groupBy((data: ConsolidatedCustomEnvironmentType) =>
    data.owner!.username)(environments as Array<ConsolidatedCustomEnvironmentType>);

/**
 * Groups organizations by the owner.username sub object and returns the list of organizations found
 * @param groupedData
 * @param isRestrictedProject
 */
export const findOrganizationGroupOptions = (groupedData: Array<ConsolidatedCustomEnvironmentType>, isRestrictedProject?: boolean) => {
  const groupedOrganization = transformResultsToOrganizationDataSource(groupedData);
  return Object.keys(groupedOrganization)
    .map(org => getOptions(org, groupedOrganization[org], isRestrictedProject));
};

/**
 * Find the groups and return them as options components to the dropdown
 * @param data
 * @param isRestrictedProject
 */
export const findGroupOptions = (data?: Array<ConsolidatedCustomEnvironmentType>, isRestrictedProject?: boolean) => {
  if (!R.isNil(data)) {
    const groupedData = transformResultsToDataSource(data);
    const curatedOptions = groupedData.Curated.length ? [getOptions('Curated', groupedData.Curated, isRestrictedProject)] : [];
    const globalOptions = getOptions('Global', groupedData.Global, isRestrictedProject);
    const privateOptions = getOptions('Private', groupedData.Private, isRestrictedProject);
    // group the organization based on the owner name
    const organizationOptions = findOrganizationGroupOptions(groupedData.Organization as Array<ConsolidatedCustomEnvironmentType>, isRestrictedProject);
    return [...curatedOptions, globalOptions, ...organizationOptions, privateOptions];
  }
  return [];
};

// Determines the state of the dropdown
const noDataLoadingState = (loading: boolean, hasItems: boolean, error?: boolean) => {
  if (error) {
    return <ErrorState>Error getting environments!</ErrorState>;
  } else if (loading) {
    return <em>Loading environments...</em>;
  } else if (!hasItems) {
    return <em>No environments found</em>;
  }
  return undefined;
};

export type VisibilityType = 'Global' | 'Private' | 'Organization';
export type EnvironmentOwnerType = 'Organization' | 'Individual';

export type ConsolidatedCustomEnvironmentType = {
  name: string;
  archived: boolean;
  visibility: VisibilityType;
  version?: string | number;
  owner?: Omit<OwnerType, 'environmentOwnerType'> & { environmentOwnerType?: 'Organization' | 'Individual' };
  restrictedRevisionNumber?: number
} & SelectedEnvironment;

export type ComputeEnvironmentSelectorProps = {
  id?: string;
  testId?: string;
  error?: boolean;
  customStyles?: React.CSSProperties;
  customDropdownStyles?: React.CSSProperties;
  environment?: ConsolidatedCustomEnvironmentType;
  environments?: Array<ConsolidatedCustomEnvironmentType>;
  selectedEnvironment?: SelectedEnvironment;
  canSelectEnvironment?: boolean;
  canEditEnvironments?: boolean;
  selectedEnvironmentId?: string;
  projectEnvironments?: ProjectEnvironments;
  forProjectSettings?: boolean;
  setEnvironment?: (environment?: ConsolidatedCustomEnvironmentType, option?: ChangeHandlerOptionType) => void;
  setSelectedEnvironmentId?: (id?: string, option?: ChangeHandlerOptionType) => void;
  onChangeEnvironment?: (environment?: ConsolidatedCustomEnvironmentType,
    option?: ChangeHandlerOptionType | ChangeHandlerOptionType[]) => void;
  projectId?: string;
  handleEnvChange?: (revision: string) => void;
  isRestrictedProject?: boolean;
} & Omit<EnvironmentHelpBlockProps, 'environments' | 'children'>;

export type ComputeEnvironmentSelectorWithRouterProps = ComputeEnvironmentSelectorProps & RouteComponentProps;

export const ComputeEnvironmentSelector: React.FC<ComputeEnvironmentSelectorWithRouterProps> = props => {
  const { environments, forProjectSettings, handleEnvChange, isRestrictedProject } = props;
  const [options, setOptions] = React.useState(findGroupOptions(environments));

  const accessControl = useAccessControl();

  React.useEffect(() => {
    if (!R.isNil(environments)) {
      setOptions(findGroupOptions(environments, isRestrictedProject));
    }
  }, [environments, isRestrictedProject]);

  const onSelect = (
    value: string,
    option: ChangeHandlerOptionType
  ) => {
    const { setEnvironment, setSelectedEnvironmentId } = props;
    if (!R.isNil(setSelectedEnvironmentId)) {
      setSelectedEnvironmentId(value, option);
    }
    if (!R.isNil(setEnvironment) && !R.isNil(environments)) {
      const findById = findEnvInComputeData(environments);
      setEnvironment(findById(value) as (ConsolidatedCustomEnvironmentType | undefined), option);
    }
  };

  const onChange = (
    value: string,
    option: ChangeHandlerOptionType
  ) => {
    const { onChangeEnvironment } = props;
    if (!R.isNil(onChangeEnvironment) && !R.isNil(environments)) {
      const findById = findEnvInComputeData(environments);
      onChangeEnvironment(findById(value) as (ConsolidatedCustomEnvironmentType | undefined), option);
    }
    if (handleEnvChange) {
      handleEnvChange(ACTIVE_REVISION);
    }
  };

  const dropdownStyle: React.CSSProperties = { zIndex: 2500, width: 400, ...props.customDropdownStyles };

  const projectEnvStyle: React.CSSProperties = {  ...props.customStyles, width: '100%', wordWrap: 'break-word'};

  const getLoadingOrErrorState = () => {
    const hasItems = (environments && environments.length > 0);
    const doEnvironmentsExist = R.isNil(environments);
    if (doEnvironmentsExist || props.error || !hasItems) {
      return noDataLoadingState(doEnvironmentsExist, !hasItems, props.error);
    }
    return undefined;
  }

  const loadingOrErrorState = getLoadingOrErrorState();
  return (
    <React.Fragment>
      {
        !R.isNil(loadingOrErrorState) ? (
          <div><StyledSelect placeholder={loadingOrErrorState} disabled={true} /></div>
        ) : (
          <div>
            {
              props.forProjectSettings && props.projectEnvironments?.currentlySelectedEnvironment &&
              !R.isEmpty(props.projectEnvironments.currentlySelectedEnvironment.supportedClusters) &&
              <DangerBox>{unsuitableEnvErr}</DangerBox>
            }
              <ComponentLayout>
              {/* @ts-ignore */}
              <StyledComputeSelect
                id={props.id}
                onSelect={onSelect}
                onChange={onChange}
                showSearch={true}
                placeholder={EMPTY_PLACEHOLDER_TEXT}
                filterOption={true}
                optionFilterProp={'search-value'}
                value={props.selectedEnvironmentId}
                disabled={!R.isNil(props.canSelectEnvironment) ? !props.canSelectEnvironment : false}
                style={projectEnvStyle}
                dropdownStyle={dropdownStyle}
                selectorHeight={forProjectSettings ? '32' : '36'}
                data-test={props.testId}
                className="select-compute-env"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
                options={options}
                useOptionsAsProp={true}
                aria-busy={R.isNil(environments) && !props.error}
                dropdownRender={(menu) => (
                  <>
                    {isRestrictedProject &&
                    <StyledFlexLayout justifyContent="flex-start" alignContent="center" itemSpacing={10}>
                      <InfoCircleOutlined style={{fontSize: '21px', color: colors.neutral500}}/>
                      <div>This project can only use “Restricted” environment revisions.</div>
                    </StyledFlexLayout>}
                    {menu}
                  </>
                )}
              />
            </ComponentLayout>
            {forProjectSettings && props.canEditEnvironments && props.environments && (
              <ProjectSettingsHelpText
                isProjectRestricted={isRestrictedProject ?? false}
                hasAccess={accessControl.hasAccess()}
                selectedEnvironmentId={props.selectedEnvironmentId}
                environments={props.environments}
              />
            )
            }
          </div>
        )
      }
    </React.Fragment>
  );
};

type ProjectSettingsHelpTextProps = {
  hasAccess: boolean;
  selectedEnvironmentId?: string;
  environments: Array<ConsolidatedCustomEnvironmentType>;
  isProjectRestricted: boolean;
};
const ProjectSettingsHelpText = ({ isProjectRestricted, hasAccess, selectedEnvironmentId, environments }: ProjectSettingsHelpTextProps) => {
  if (selectedEnvironmentId && environments.length > 0 ) {
    return (
        <div>
          <HelpText>
            This is the default environment for all collaborators in this project.
          </HelpText>
          {hasAccess && (
            <Link
              openInNewTab={true}
              className="env-btn"
              href={`/environments/${selectedEnvironmentId}`}
            >
              Manage Environment
            </Link>
          )}
        </div>
    );
  }

  return (
      <div>
        <HelpText>
          {!selectedEnvironmentId && `Please configure a default environment for ths project${environments.length ? ' by selecting one from the dropdown' : ''}.`}
          {!environments.length && 'No environments are available for this project.'}
        </HelpText>
        {!environments.length && (
          <Link
            openInNewTab={true}
            className="env-btn"
            href={`/environments`}
          >
            Create {isProjectRestricted ? 'a Restricted' : 'an' } Environment
          </Link>
        )}
      </div>
  );
};


export const ComputeEnvironmentSelectorWithRouter:
  RouterType<ComputeEnvironmentSelectorWithRouterProps, React.ComponentType<ComputeEnvironmentSelectorWithRouterProps>>
  = withRouter(ComputeEnvironmentSelector);

export type EnvironmentSelectorProps = {
  /**
   * Return type for `getUseableEnvironments` API. Used only for project based environments
   * viz. jobs/workspace/scheduled-jobs creation/edit flow.
   */
  projectEnvironments?: ProjectEnvironments,
  /**
   * Return type for `getCurrentUserEnvironments` API. Used for Environment creation/edit flow.
   */
  userEnvironments?: Array<UserEnvironments>
} & ComputeEnvironmentSelectorProps;

/**
 *
 * @param props - In most cases, when `projectEnvironments` is available, `userEnvironments` shouldn't be sent.
 * @returns a transformed `ComputeEnvironmentSelector` component where the environments are in the
 * `ConsolidatedCustomEnvironmentType`.
 */
export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = props => {
  const [transformedEnvironments, setTransformedEnvironments] = React.useState<ConsolidatedCustomEnvironmentType[]>();
  const { projectEnvironments, userEnvironments } = props;

  React.useEffect(() => {
    let environments: ConsolidatedCustomEnvironmentType[] | undefined;
    if (R.isNil(transformedEnvironments) || R.isEmpty(transformedEnvironments)) {
      if (!R.isNil(projectEnvironments)) {
        environments = R.reduce((environmentsList, projectEnvironment) =>
          [...environmentsList, { ...projectEnvironment }], [], projectEnvironments.environments);
      } else if (!R.isNil(userEnvironments)) {
        environments = R.reduce((environmentsList, userEnvironment) => {
          const { latestRevision, selectedRevision } = userEnvironment;
          if (!R.isNil(latestRevision) || !R.isNil(selectedRevision)) {
            delete userEnvironment.latestRevision;
            delete userEnvironment.selectedRevision;
            return [...environmentsList, {
              ...userEnvironment, id: selectedRevision?.id || latestRevision?.id || userEnvironment.id
            }];
          }
          return environmentsList;
        }, [], userEnvironments);
      }
      setTransformedEnvironments(environments);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectEnvironments, userEnvironments]);

  return <ComputeEnvironmentSelectorWithRouter {...props} environments={transformedEnvironments} />;
};

export default EnvironmentSelector;
