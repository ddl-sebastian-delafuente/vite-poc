import * as React from 'react';
import { useState, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import Table from '../../components/Table/Table';
import WaitSpinner from '../../components/WaitSpinnerWithErrorHandling';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import {
  DominoDatasetrwApiDatasetRwProjectMountDto,
  DominoDataplaneDataPlaneDto
} from '@domino/api/dist/types';
import { DominoDatamountApiDataMountDto } from '@domino/api/dist/types';
import {
  getLocalDatasetProjectMountsV2, getSharedDatasetProjectMountsV2
} from '@domino/api/dist/Datasetrw';
import {
  findDataMountsByProject,
  checkAndUpdateDataMountStatus,
 } from '@domino/api/dist/Datamount';
 import { Typography, Tag } from 'antd';
 import { colors } from '../../styled';

const { Text } = Typography;

const Container = styled.div`
  margin-bottom: ${themeHelper('margins.medium')};
`;

const StyledTitleContainer = styled.div`
    margin-bottom: ${themeHelper('margins.tiny')};
`

const StyledTitle = styled(Text)`
    font-size: 14px;
    font-weight: bold;
`;

const StyledTable = styled(Table)`
    margin-bottom: ${themeHelper('margins.medium')};
`

interface ExternalVolume extends DominoDatamountApiDataMountDto {
  dataType: string;
  dataKind: string;
}

interface DataSet extends DominoDatasetrwApiDatasetRwProjectMountDto {
  dataType: string;
  dataKind: string;
}

export type HybridDataTableProps = {
  projectId: string;
  onDatasetsFetch?: (datasets: Array<DominoDatasetrwApiDatasetRwProjectMountDto>) => void;
  currentUser: string;
  enableDatasets: boolean;
  enableEdvs: boolean;
  selectedDataPlaneId: string;
};

const HybridDataTable: React.FC<HybridDataTableProps> = (props) => {
  const [dataRows, setDataRows] = useState<(DataSet|ExternalVolume)[]>([]);
  const [unavailableDataRows, setUnavailableDataRows] = useState<(DataSet|ExternalVolume)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const getDefaultDataRows = async() => {
    const {
      projectId,
      onDatasetsFetch
    } = props;
    if (projectId) {
      let datasets: DataSet[] = [];
      let edvs: ExternalVolume[] = [];
      try {
        if (props.enableDatasets) {
          const rwDatasets = await getLocalDatasetProjectMountsV2({ projectId });
          const parsedDatasets: DataSet[] = rwDatasets.map(dataset => ({
            ...dataset,
            dataType: "Dataset",
            dataKind: "Project",
          }));

          const sharedRwDatasets = await getSharedDatasetProjectMountsV2({ projectId });
          const parsedSharedRwDatasets: DataSet[] = sharedRwDatasets.map(dataset => ({
            ...dataset,
            dataType: "Dataset",
            dataKind: "Shared",
          }));

          datasets = parsedDatasets.concat(parsedSharedRwDatasets);
          datasets = R.filter(dataset => R.equals(dataset.versionNumber, 0), datasets);
        }

        if (props.enableEdvs) {
          const edvData = await findDataMountsByProject({projectId: projectId});
          const dataMountsWithStatus = await checkAndUpdateDataMountStatus({
            body: {
              datamountIds: R.pluck('id')(edvData)
            }
          });
          edvs = dataMountsWithStatus.map(edv => ({
            ...edv,
            dataType: "EDV",
            dataKind: edv["volumeType"],
          }));
        }

        if (onDatasetsFetch) { onDatasetsFetch(datasets); }
        const combinedRows = [...datasets ,...edvs];
        const dataPlaneFilter = (row: DataSet|ExternalVolume) => (row.dataPlanes || []).filter(dataPlane => dataPlane.id == props.selectedDataPlaneId).length > 0;

        setDataRows(combinedRows.filter(dataPlaneFilter));
        setUnavailableDataRows(combinedRows.filter(row => !dataPlaneFilter(row)));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false);
      }
    }
  }

    useEffect(() => {
      getDefaultDataRows();
    }, [props.selectedDataPlaneId]);

    const generateColumns = (disabled: boolean) => {
      const tagColor = disabled ? colors.greylight3 : colors.grey70;
      return [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: (name: string) => <Text disabled={disabled}>{name}</Text>
      },
      {
        key: 'dataType',
        title: 'Data type',
        dataIndex: 'dataType',
        sorter: false,
        render: (dataType: string) => <Text disabled={disabled}>{dataType}</Text>
      },
      {
        key: 'dataPlanes',
        title: 'Data plane',
        dataIndex: 'dataPlanes',
        render: (dataPlanes: DominoDataplaneDataPlaneDto[]) => dataPlanes.map(dataPlane => <Tag key={dataPlane.name} color={tagColor}>{dataPlane.name}</Tag>)
      },
      {
        key: 'kind',
        title: 'Kind',
        dataIndex: 'dataKind',
        render: (dataKind: string) => <Text disabled={disabled}>{dataKind}</Text>
      }
    ]}

    const columns = generateColumns(false);
    const unavailableColumns = generateColumns(true);

    if(loading){
      return (
        <WaitSpinner errored={!!error}/>
      );
    }
  return (
        <Container>
            <StyledTitleContainer>
                <StyledTitle>Data that will be mounted</StyledTitle>
            </StyledTitleContainer>
            <StyledTable
                columns={columns}
                dataSource={dataRows}
                hideRowSelection={true}
                hideColumnFilter={true}
                showPagination={false}
                showSearch={false}
                />
                <StyledTitleContainer>
                    <StyledTitle>Unavailable in selected Dataplane</StyledTitle>
                    <div>
                        {"Change your Hardware Tier to mount currently unavailable data."}
                    </div>
                </StyledTitleContainer>
                <StyledTable
                columns={unavailableColumns}
                dataSource={unavailableDataRows}
                hideRowSelection={true}
                hideColumnFilter={true}
                showPagination={false}
                showSearch={false}
                />
        </Container>
  );
};

export default HybridDataTable;
