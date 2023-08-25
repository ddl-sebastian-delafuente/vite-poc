import { httpRequest } from '@domino/api/dist/httpRequest';
import { ModelStages, RegisteredModelV1, RegisteredModelVersionDetailsV1 } from './types';

export enum ReviewDecisions  {
  APPROVED = 'Approved',
  REQUESTED = 'RequestChanges'
}
export type ReviewerItems = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}
export type ResponseItems = {
  reviewer: ReviewerItems;
  decision?: ReviewDecisions;
}
export type ReviewSummary = {
  modelReviewId: string;
  notes: string;
  reviewerResponses: ResponseItems[];
  status: string;
  targetStage: string;
}
export type ModelVersion = RegisteredModelVersionDetailsV1 & {
  reviewSummary?: ReviewSummary;
}
export type ModelApiItems = {
  modelApiName: string;
  modelApiId: string;
  status: string;
  lastModified: string;
}
export type ModelApiSummary = {
  ModelApis?: ModelApiItems[];
  projectId?: string;
}
export type ModelSpecItems = {
  modelSpecName: string;
  modelSpecValue: string;
}
export type ModelSpecSummary = {
  ModelSpecs?: ModelSpecItems[];
}

export enum ReviewStatus {
  OPEN = 'Open',
  APPROVED = 'Approved'
}

const headers = {
  accept: '*/*',
  'Content-Type': 'application/json',
};

export const getModelStages: () => Promise<ModelStages> = () => {
  return httpRequest('GET',
    `${window.location.origin}/api/registeredmodelstages/beta`,
    undefined,
    {},
    undefined,
    null,
    true,
  );
};

export const getRegisteredModelByName: (params: {modelName: string}) => Promise<RegisteredModelV1> = ({ modelName }) => {
  return httpRequest('GET',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}`,
    undefined,
    {},
    undefined,
    null,
    true,
  );
}

export const getRegisteredModelVersions: (params: {modelName: string, version: number}) => Promise<ModelVersion> = ({ modelName, version}) => {
  return httpRequest('GET',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}`,
    undefined,
    {},
    undefined,
    null,
    true,
  );
}

export const getRegisteredModelVersionModelApis: (params: {modelName: string, version: number}) => Promise<any> = ({ modelName, version}) => {
  return httpRequest('GET',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}/modelapis`,
    undefined,
    {},
    undefined,
    null,
    true,
  );
}

export const startReview: (params: {
  modelName: string,
  version: number,
  targetStage: string,
  reviewers: any[],
  notes?: string
}) => Promise<void> = ({modelName, version, targetStage, reviewers, notes}) => {
  return httpRequest('POST',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}/reviews`,
    {targetStage, notes, reviewers},
    {},
    headers,
    null,
    true,
  )
}

export const cancelReview: (params: {
  modelName: string,
  version: number,
  modelReviewId: string
}) => Promise<void> = ({modelName, version, modelReviewId}) => {
  return httpRequest('PATCH',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}/reviews/${modelReviewId}`,
    {status: "CANCELED"},
    {},
    headers,
    null,
    true,
  )
}

export const editReview: (params: {
  modelName: string,
  version: number,
  modelReviewId: string,
  reviewers: any[],
  notes?: string
}) => Promise<void> = ({modelName, version, modelReviewId, reviewers, notes}) => {
  return httpRequest('PATCH',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}/reviews/${modelReviewId}`,
    {notes, reviewers},
    {},
    headers,
    null,
    true,
  )
}

export const submitReview: (params: {
  modelName: string,
  version: number,
  modelReviewId: string,
  decision: ReviewDecisions,
  notes?: string
}) => Promise<void> = ({modelName, version, decision, notes, modelReviewId}) => {
  return httpRequest('POST',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}/reviews/${modelReviewId}/responses`,
    { notes, decision},
    {},
    headers,
    null,
    true,
  )
}

export const createModelFromRun: (params: {
  modelName: string,
  experimentRunId: string,
  artifact: string,
  description: string
}) => Promise<void> = ({modelName, experimentRunId, artifact, description}) => {
  return httpRequest(
    'POST',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions`,
    {
      experimentRunId,
      artifact,
      description,
    },
    {},
    headers,
    null,
    true
  );
}

export const transitionModelVersionStage: (params: {
  modelName: string,
  version: number,
  stage: string,
}) => Promise<void> = ({modelName, version, stage}) => {
  return httpRequest(
    'PATCH',
    `${window.location.origin}/api/registeredmodels/beta/${modelName}/versions/${version}`,
    {
      "currentStage": stage,
    },
    {},
    headers,
    null,
    true
  );
}

export const updateModelDescription: (params: {
  modelName: string
  description: string
}) => Promise<any> = ({modelName, description}) => {
  return httpRequest(
    'PATCH',
    `${window.location.origin}/api/2.0/mlflow/registered-models/update`,
    {
      name: modelName,
      description,
    },
    {},
    headers,
    null,
    true
  );
}
