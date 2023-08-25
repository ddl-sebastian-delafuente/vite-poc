import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { RouteComponentProps, StaticContext } from 'react-router';
import NavTabs, { NavTabPane } from '../../components/NavTabs/NavTabs';
import DefaultInjectedDatasetsTable from './DefaultInjectedDatasetsTable';
import withProjectSectionRouting from '../../containers/WithProjectSectionRouting';
import projectSectionProjectFetcher, {
  withProjectToMapping,
} from '../../containers/ProjectSectionProjectFetcher';
import WaitSpinner from '../../components/WaitSpinnerWithErrorHandling';
import DatasetsConfigCollapse from './DatasetsConfigCollapse';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project
} from '@domino/api/dist/types';
import ExternalDataVolumeTab from './ExternalDataVolumeTab';
import withStore, { StoreProps } from '../../globalStore/withStore';
import { getEnableDatasets } from '../../util';
import { themeHelper } from '../../styled/themeUtils';

const StyledNavTabs = styled(NavTabs)`
  & {
    margin-top: ${themeHelper('margins.small')};
  }
`;

const DatasetsConfigHeader = styled.h4`
  margin-bottom: 0px;
`;

export const RW_DATASETS_TAB_KEY = 'Datasets';
export const EXTERNAL_VOLUME_TAB_KEY = 'External Volumes';

export enum DatasetConfigLauncherType {
  Workspace = 'Workspace',
  Run = 'Run',
  App = 'App',
  ScheduledRun = 'Scheduled Run',
}

type FetchResultProps = {
  projectId: string;
  loadingAll?: boolean;
  project?: Project;
};

type Props = {
  collapsed?: boolean;
  launchedBySelector?: DatasetConfigLauncherType;
  isCollapsible?: boolean;
  enableExternalDataVolumes?: boolean;
  currentUser?: string;
  filterRemoteDataMounts?: boolean;
} & FetchResultProps;

export type CollapseViewProps = {
  collapsed?: boolean;
} & Props;

const DataSetConfigSelectionTabsCollapseView =
  ({ isCollapsible = true, collapsed = true, ...rest }: CollapseViewProps) => {
    return R.cond([
      [
        () => isCollapsible,
        () => (
          <DatasetsConfigCollapse collapsed={collapsed}>
            <DataSetConfigSelectionTabs {...rest}/>
          </DatasetsConfigCollapse>
        )
      ],
      [
        R.T,
        () => (
          <DataSetConfigSelectionTabs {...rest}/>
        )
      ]
    ])();
  };

const DataSelectionTabs = (props: Props & StoreProps) => {
  const { projectId, loadingAll = false, launchedBySelector = DatasetConfigLauncherType.Workspace,
    enableExternalDataVolumes, currentUser = 'Anonymous', filterRemoteDataMounts, formattedPrincipal } = props;
  const enableDatasets = getEnableDatasets(formattedPrincipal);
  const [activeTab, setActiveTab] = React.useState<string>(enableDatasets ? RW_DATASETS_TAB_KEY : EXTERNAL_VOLUME_TAB_KEY);
  const onTabChange = (tab: string) => setActiveTab(tab);
  return (
      <div data-test="data-selection-tabs">
        <DatasetsConfigHeader>
          Data Configuration
        </DatasetsConfigHeader>
        <StyledNavTabs
          activeKey={activeTab}
          onChange={onTabChange}
        >
          {enableDatasets && <NavTabPane title={RW_DATASETS_TAB_KEY} key={RW_DATASETS_TAB_KEY}>
            {(loadingAll) ? (
              <WaitSpinner>
                Loading default configurations...
              </WaitSpinner>
            ) : (
              <DefaultInjectedDatasetsTable
                projectId={projectId}
                launchedBySelector={launchedBySelector}
                currentUser={currentUser}
              />
            )}
          </NavTabPane>}
          {enableExternalDataVolumes && <NavTabPane title={EXTERNAL_VOLUME_TAB_KEY} key={EXTERNAL_VOLUME_TAB_KEY}>
            {(loadingAll) ? (
              <WaitSpinner>
                Loading external volumes...
              </WaitSpinner>
            ) : (
              <ExternalDataVolumeTab
                projectId={projectId}
                launchedBySelector={launchedBySelector}
                filterRemoteDataMounts={filterRemoteDataMounts}
              />
            )}
          </NavTabPane>}
        </StyledNavTabs>
      </div>
  );
};

const DataSetConfigSelectionTabs = withStore(DataSelectionTabs)

const projectDetailsGetter = (project: Project) => ({
    projectId: project.id
});

const ProjectSectionDataSetConfigSelectionTabs =
  withProjectSectionRouting(
    projectSectionProjectFetcher(
      withProjectToMapping(projectDetailsGetter)(
        DataSetConfigSelectionTabsCollapseView
      )
    )
  );

export {
  DataSetConfigSelectionTabsCollapseView,
  FetchResultProps,
  ProjectSectionDataSetConfigSelectionTabs,
  Props,
  DataSetConfigSelectionTabs,
  StaticContext,
  RouteComponentProps,
};

export default DataSetConfigSelectionTabsCollapseView;
