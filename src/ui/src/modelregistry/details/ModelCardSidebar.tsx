import React from 'react'
import type { RegisteredModelV1 } from '../types';
import { ModelApiSummary, ModelSpecSummary, ReviewSummary } from '../api';
import ReviewersInfo from './ReviewersInfo';
import ModelApisInfo from './ModelApis';
import ModelSpecsInfo from './ModelSpecs';
import ModelVersionTagsInfo from './ModelVersionTagsInfo';


type ModelCardSidebarProps = {
  model: RegisteredModelV1;
  version: number | undefined;
  reviewSummary?: ReviewSummary;
  loadingReviewSummary: boolean;
  modelApiSummary?: ModelApiSummary;
  loadingModelApis: boolean;
  currentUserName?: string;
}

const ModelCardSidebar: React.FC<ModelCardSidebarProps> = ({ model, version, reviewSummary, loadingReviewSummary, modelApiSummary, loadingModelApis, currentUserName }) => {
  
  const createModelSpecSummary = (model: RegisteredModelV1) => {
    const modelSpecTags = Object.entries(model.tags)
      .filter(([key]) => key.startsWith("mlflow.domino.specs."))
      .map(([key, value]) => ({
        modelSpecName: key.replace("mlflow.domino.specs.", ""),
        modelSpecValue: value.toString(),
      }));
    const modelSpecSummary: ModelSpecSummary = {
      ModelSpecs: modelSpecTags,
    };
    return modelSpecSummary;
  };
  const modelSpecSummary = createModelSpecSummary(model);

  return (
    <>
    <ReviewersInfo
      reviewSummary={reviewSummary}
      model={model}
      loadingReviewSummary={loadingReviewSummary}
      currentUserName={currentUserName}
    />
    <ModelApisInfo
      modelApiSummary={modelApiSummary}
      loadingModelApis={loadingModelApis}
    />
    <ModelSpecsInfo
      modelSpecSummary={modelSpecSummary}
    />
    <ModelVersionTagsInfo
      modelName={model.name}
      version={version}
    />
    </>
  )
}
export default ModelCardSidebar
