import React, { useEffect, useState } from 'react';
import { error } from '@domino/ui/dist/components/toastr';
import { getDatasetsV2 } from '@domino/api/dist/Datasetrw';
import { getProjectSummary } from '@domino/api/dist/Projects';
import { getModelPredictionDatasetLink } from '../core/routes';
import { AddDataHeader, PredictionDatasetLink, RecordedModelDataText } from './atoms';
import FlexLayout from '../components/Layouts/FlexLayout';
import WaitSpinner from '../components/WaitSpinner';
import HelpLink from '../components/HelpLink';
import { SUPPORT_ARTICLE } from '../core/supportUtil';

const predictionDatasetName = `prediction_data`;

export const getProjectPredictionDataset = async (projectId: string) => {
  const datasets = await getDatasetsV2({ projectIdsToInclude: [projectId] });
  const found = datasets.find(({ datasetRwDto }) => datasetRwDto.name === predictionDatasetName);

  return found && found!.datasetRwDto;
};

export const predictionDataSettingsEffectHook = async (
  projectId: string,
  modelVersionId: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLink: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const predictionDataset = await getProjectPredictionDataset(projectId);
    if (predictionDataset) {
      const { name: projectName, ownerUsername } = await getProjectSummary({ projectId });
      const { name: datasetName, id: datasetId } = predictionDataset;
      const link = getModelPredictionDatasetLink(ownerUsername, projectName, datasetId, datasetName, modelVersionId);
      setLink(link);
    }
  } catch (e) {
    console.error(e);
    error('Failed to get Prediction Dataset details.');
  } finally {
    setLoading(false);
  }
};

export const usePredictionDataSettings = (projectId: string, modelVersionId: string) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [link, setLink] = useState<string>('');
  useEffect(() => {
    (() => predictionDataSettingsEffectHook(projectId, modelVersionId, setLoading, setLink))();
  }, [projectId, modelVersionId]);
  return { isLoading, link };
};

const PredictionDataSettings: React.FC<{
  projectId: string;
  modelVersionId: string;
  modelName: string;
  versionNumber: number;
}> = ({ projectId, modelVersionId, modelName, versionNumber }) => {
  const { isLoading, link } = usePredictionDataSettings(projectId, modelVersionId);
  if (isLoading) {
    return (
      <FlexLayout style={{ width: '100%' }}>
        <WaitSpinner height={30} width={30} margin="20px 0" />
      </FlexLayout>
    );
  }

  return (
    <React.Fragment>
      <AddDataHeader>Prediction Data</AddDataHeader>
      {link && (
        <PredictionDatasetLink
          onClick={() => window.open(link)}>{`${modelName}/version_${versionNumber}/`}</PredictionDatasetLink>
      )}
      <RecordedModelDataText data-test="recorded-model-data-text">
        Model data is required for all monitoring. It is generated based on this model’s prediction capture function.{' '}
        <HelpLink
          text="Learn more"
          iconAfter={true}
          articlePath={SUPPORT_ARTICLE.MONITORING_MODEL_REGISTRATION}
        />
      </RecordedModelDataText>
    </React.Fragment>
  );
};

export default PredictionDataSettings;
