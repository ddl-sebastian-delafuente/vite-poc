import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  DominoDatasetrwApiDatasetRwProjectMountDto as Dataset
} from '@domino/api/dist/types';
import { getEnableDatasets } from '@domino/ui/dist/util';
import SaveSnapshotOfDatasets from '@domino/ui/dist/restartable-workspaces/SaveSnapshotOfDatasets';
import NavTabs, { NavTabPane } from '../components/NavTabs/NavTabs';
import DefaultInjectedDatasetsTable from '../datasets/datasetconfigtabs/DefaultInjectedDatasetsTable';
import HybridDataTable from '../datasets/datasetconfigtabs/HybridDataTable';
import {
  DatasetConfigLauncherType
} from '../datasets/datasetconfigtabs/DataSetConfigSelectionTabs';
import ExternalDataVolumeTab from '../datasets/datasetconfigtabs/ExternalDataVolumeTab';
import withStore, { StoreProps } from '../globalStore/withStore';

export const RW_DATASETS_TAB_KEY = 'Datasets';
export const EXTERNAL_VOLUME_TAB_KEY = 'External Volumes';

const Container = styled.div`
  && > .ant-tabs-small > .ant-tabs-bar {
    margin-bottom: 9px;
  }
`;

export interface Props {
  projectId: string;
  onDatasetsFetch?: (datasets: Array<Dataset>) => void;
  enableExternalDataVolumes?: boolean;
  currentUser: string;
  enableHybrid?: boolean;
  selectedDataPlaneId: string;
  saveSnapshot?: boolean;
  setSaveSnapshot?: (val: boolean) => void;
  showSaveSnapshotCheckbox?: boolean;
}

export interface State {
  activeTab: string;
}

function DatasetsStepContent(props: Props & StoreProps) {
  const { formattedPrincipal, selectedDataPlaneId, showSaveSnapshotCheckbox, saveSnapshot, setSaveSnapshot } = props;
  const enableDatasets = getEnableDatasets(formattedPrincipal);
  const [activeTab, setActiveTab] = useState<string>();

  useEffect(() => {
    if (enableDatasets) {
      setActiveTab(RW_DATASETS_TAB_KEY);
    } else {
      setActiveTab(EXTERNAL_VOLUME_TAB_KEY)
    }
  }, [enableDatasets]);

  return (
    <>
      {
        props.enableHybrid ? <Container>
        <HybridDataTable
          projectId={props.projectId}
          onDatasetsFetch={props.onDatasetsFetch}
          currentUser={props.currentUser}
          enableDatasets={enableDatasets}
          enableEdvs={!!props.enableExternalDataVolumes}
          selectedDataPlaneId={selectedDataPlaneId}
          />
      </Container> :
      <Container>
        {(enableDatasets || props.enableExternalDataVolumes) ? <NavTabs
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          {enableDatasets && <NavTabPane
            title={RW_DATASETS_TAB_KEY}
            key={RW_DATASETS_TAB_KEY}
            dataTest={`dataTest_${RW_DATASETS_TAB_KEY}`}
          >
            <DefaultInjectedDatasetsTable
              projectId={props.projectId}
              launchedBySelector={DatasetConfigLauncherType.Workspace}
              onDatasetsFetch={props.onDatasetsFetch}
              currentUser={props.currentUser}
            />
          </NavTabPane>}
          {!!props.enableExternalDataVolumes && (
            <NavTabPane
              title={EXTERNAL_VOLUME_TAB_KEY}
              key={EXTERNAL_VOLUME_TAB_KEY}
              dataTest={`dataTest_${EXTERNAL_VOLUME_TAB_KEY}`}
            >
              <ExternalDataVolumeTab
                projectId={props.projectId}
                launchedBySelector={DatasetConfigLauncherType.Workspace}
              />
            </NavTabPane>
          )}
        </NavTabs> :
        'Please configure any of the feature i.e, Datasets or External Data Volumes'}
      </Container>
      }
      {
        showSaveSnapshotCheckbox && <SaveSnapshotOfDatasets saveSnapshot={Boolean(saveSnapshot)} setSaveSnapshot={setSaveSnapshot}/>
      }
    </>
  );
}

export default withStore(DatasetsStepContent);
