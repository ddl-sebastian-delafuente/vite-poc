import {
  updateDataSourceDataPlanes
} from '@domino/api/dist/Datasource';
import {
  DominoDatasourceApiDataSourceDto as DataSourceDto,
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button/Button';
import Card from '../../../components/Card';
import {
  DynamicFieldDisplay,
  FieldStyle,
  FieldValue,
  LayoutElements,
} from '../../../components/DynamicField';
import {
  DataplanesSelectorFieldConfig,
} from '../../../components/DynamicWizard/ProxiedRequestClientSideStaticData/datasourceSharedFields';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import {
  error as raiseErrorToast,
  success as raiseSuccessToast,
} from '../../../components/toastr';
import { themeHelper } from '../../../styled';
import { EngineType } from '../CommonData';
import {
  CardTitle,
  CardWrapper,
} from '../CommonStyles';

const StyledCardWrapper = styled(CardWrapper)`
  .ant-card-body {
    padding: ${themeHelper('margins.small')};
  }
`;

interface InternalData {
  dataPlanes: string[];
  useAllDataPlanes: boolean;
}

export interface DataplanesCardProps extends
  Pick<DataSourceDto, 'engineInfo' | 'dataPlanes' | 'useAllDataPlanes'> {
  datasourceId: string;
  isAdminOrOwner?: boolean;
  onUpdate?: () => void;
  isIndividualCredentials: boolean;
}

export const DataplanesCard = ({
  datasourceId,
  dataPlanes,
  engineInfo,
  isAdminOrOwner,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdate = () => {},
  useAllDataPlanes,
  isIndividualCredentials,
}: DataplanesCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [reload, setReload] = React.useState(false);

  const [data, setData] = React.useState<InternalData>({
    dataPlanes: useAllDataPlanes ? [] : (dataPlanes || []).map(({ dataPlaneId }) => dataPlaneId),
    useAllDataPlanes: useAllDataPlanes || false,
  });

  const handleBeginEdit = React.useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleChange = React.useCallback((field: string, value: FieldValue) => {
    const newData = {
      ...data,
      [field]: value,
    };

    if (field === 'useAllDataplanes' && value === true) {
      newData.dataPlanes = [];
    }

    setData(newData);
  }, [data, setData]);

  const handleCancelEdit = React.useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const handleSaveChanges = React.useCallback(async () => {
    try {
      await updateDataSourceDataPlanes({
        dataSourceId: datasourceId,
        body: {
          dataPlanes: data.dataPlanes.map((dataPlaneId) => ({ dataPlaneId })),
        }
      });

      setTimeout(() => {
        onUpdate();
        setReload(true);
        handleCancelEdit();
        raiseSuccessToast('Updated dataplanes');
      }, 1000);
    } catch (e) {
      if(data.dataPlanes.length == 0){
        raiseErrorToast('Unable to update data planes: data source must be accessible in at least one data plane');
      } else {
        raiseErrorToast(`Unable to update data planes: ${e}`);
      }
    }
  }, [data, datasourceId, handleCancelEdit, onUpdate, setReload]);

  const cardActions = React.useMemo(() => {
    if (!isEditing) {
      return undefined;
    }

    return [
      <FlexLayout justifyContent="flex-end" key="dataplanes-edit-actions">
        <Button
          btnType="secondary"
          onClick={handleCancelEdit}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveChanges}
        >Save Changes</Button>
      </FlexLayout>
    ]
  }, [handleCancelEdit, handleSaveChanges, isEditing]);

  const cardExtra = React.useMemo(() => {
    if (!isAdminOrOwner || engineInfo?.engineType === EngineType.Starburst || isIndividualCredentials) {
      return undefined;
    }

    return (
      <Button btnType="secondary" onClick={handleBeginEdit}>edit</Button>
    );
  }, [engineInfo, handleBeginEdit, isAdminOrOwner, isIndividualCredentials]);

  const fieldLayout = React.useMemo(() => {
    const dataplanesField = {
      ...DataplanesSelectorFieldConfig,
      selectAllByDefault: data.useAllDataPlanes,
      useAllDataplanes: data.useAllDataPlanes,
    };
    if (isEditing) {
      return {
        elements: [
          dataplanesField,
        ].filter(Boolean) as LayoutElements
      }
    }

    return {
      elements: [
        dataplanesField,
      ]
    }
  }, [data.useAllDataPlanes, isEditing]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  React.useEffect(() => {
    setData({
      dataPlanes: useAllDataPlanes ? [] : (dataPlanes || []).map(({ dataPlaneId }) => dataPlaneId),
      useAllDataPlanes: useAllDataPlanes || false,
    });
  }, [dataPlanes, setData, useAllDataPlanes]);

  return (
    <StyledCardWrapper>
      <Card
        actions={cardActions}
        extra={cardExtra}
        showTitleSeparator
        title={<CardTitle>Data Planes</CardTitle>}
        width="100%"
      >
        {!reload && (
          <DynamicFieldDisplay
            data={{
              ...data,
            }}
            onChange={handleChange}
            editable={isEditing}
            fieldStyle={FieldStyle.FormItem}
            layout={fieldLayout}
          />
        )}
      </Card>
    </StyledCardWrapper>
  )
}
