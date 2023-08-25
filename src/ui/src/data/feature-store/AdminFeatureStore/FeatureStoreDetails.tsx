import { deleteFeatureStore } from '@domino/api/dist/Featurestore';
import { DominoFeaturestoreApiFeatureStoreDto as FeatureStoreDto } from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button/Button';
import ConfirmationModal from '../../../components/Modals/ConfirmationModal';
import Card from '../../../components/Card';
import { 
  DynamicFieldDisplay, 
  FieldType, 
  LayoutFieldMutable,
  Layout
} from '../../../components/DynamicField'
import { 
  OFFLINE_STORE_SPECIFIC_FIELDS,
  getOnlineSpecificFields,
} from '../../../components/DynamicWizard/ProxiedRequestClientSideStaticData/CreateFeatureStore';
import {
  error as raiseErrorToast,
  success
} from '../../../components/toastr';
import {
  OfflineStoreType,
  OnlineStoreType,
} from '../../../proxied-api/types';
import { themeHelper } from '../../../styled/themeUtils';
import { FeatureStoreDescription } from './FeatureStoreDescription';

const nestPath = (prefix: string, fields: LayoutFieldMutable[]) => {
  return fields.map(field => ({
    ...field,
    path: [prefix, field.path].join('.'),
  }));
}

const getFieldLayout = (offlineStoreType: OfflineStoreType, onlineStoreType?: OnlineStoreType, onlineConfig?: {}): Layout => {
  const offlineConfigFields = OFFLINE_STORE_SPECIFIC_FIELDS[offlineStoreType] || [];
  
  const onlineConfigFields = getOnlineSpecificFields({
    onlineStoreType,
    redisType: (onlineConfig as { redisType?: string })?.redisType,
  });

  return {
    elements: [
      {
        elements: [
          { fieldType: FieldType.horizontalSeperator },
          {
            elements: [
              {
                canEdit: false,
                label: 'Offline Data Store',
                path: 'offlineStoreType',
              },
              offlineConfigFields.length > 0 ? {
                justify: 'flex-start',
                elements: nestPath('offlineStoreConfig', offlineConfigFields),
              } : null,
            ].filter(Boolean) as Layout['elements']
          },
          { fieldType: FieldType.horizontalSeperator },
        ]
      },
      onlineStoreType ? {
        elements: [
          {
            elements: [
              {
                canEdit: false,
                label: 'Online Data Store',
                path: 'onlineStoreType',
              },
              onlineConfigFields.length > 0 ? {
                justify: 'flex-start',
                elements: nestPath('onlineStoreConfig', onlineConfigFields)
              } : null,
            ].filter(Boolean) as Layout['elements']
          },
          { fieldType: FieldType.horizontalSeperator },
        ]
      }: null,
      {
        justify: 'flex-start',
        elements: [
          {
            fieldType: FieldType.link,
            label: 'Git Repo',
            path: 'gitRepo',
          },
          {
            canEdit: false,
            fieldType: FieldType.date,
            label: 'Created',
            path: 'creationTime',
          },
          {
            canEdit: false,
            fieldType: FieldType.date,
            label: 'Last Updated',
            path: 'lastUpdatedTime',
          },
          {
            canEdit: false,
            label: 'Last Sync Status',
            path: 'syncStatus',
          }
        ]
      },
    ].filter(Boolean) as Layout['elements'],
  }
};

const CardHeading = styled.div`
  font-weight: ${themeHelper('fontWeights.medium')};
`;

const Container = styled.div``;

const ControlContainer = styled.div`
  margin-top: ${themeHelper('margins.medium')};

  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.small')}
  }
`

export interface FeatureStoreDetailsProps {
  featureStore: FeatureStoreDto,
  onDelete?: () => void;
}

export const FeatureStoreDetails = ({
  featureStore,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onDelete = () => {}
}: FeatureStoreDetailsProps) => {
  const [confirmationVisible, setConfirmationVisible] = React.useState(false);

  const handleDeleteFeatureStore = React.useCallback(async () => {
    try {
      await deleteFeatureStore({ featureStoreId: featureStore.id });
      success('Deleted Feature Store');
      onDelete();
    } catch (e) {
      raiseErrorToast(`There was a error while attempting to delete the feature store: ${e}`)
    }

    setConfirmationVisible(false);
  }, [featureStore.id, onDelete, setConfirmationVisible]);

  const layout = React.useMemo(() => {
    return getFieldLayout(featureStore.offlineStoreType, featureStore.onlineStoreType, featureStore.onlineStoreConfig);
  }, [
    featureStore.offlineStoreType,
    featureStore.onlineStoreConfig,
    featureStore.onlineStoreType,
  ]);

  const handleRaiseConfirmation = React.useCallback(() => {
    setConfirmationVisible(true);
  }, [setConfirmationVisible])

  return (
    <Container>
      <FeatureStoreDescription/>
      <Card width="100%">
        <CardHeading>Details</CardHeading>
        <DynamicFieldDisplay
          data={{
            ...featureStore,
            ignoreContents: '.ipynb_checkpoints'
          }}
          layout={layout}
        />
      </Card>
      <ControlContainer>
        <Button
          btnType="secondary"
          disabled={!featureStore.id}
          isDanger
          onClick={handleRaiseConfirmation}
        >Delete Feature Store</Button>
        <ConfirmationModal
          description="Are you sure you want to delete the feature store?"
          header="Delete Feature Store"
          handleOk={handleDeleteFeatureStore}
          isVisible={confirmationVisible}
          okText="Yes, Delete Feature Store"
          setVisible={setConfirmationVisible}
        />
      </ControlContainer>
    </Container>
  )
}
