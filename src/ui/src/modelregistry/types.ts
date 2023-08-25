/**
 * Regisered Model Object
 * TODO: this type should come from swagger codegen
 */
export type RegisteredModelV1 = {
  name: string
  description: string,
  latestVersion: number,
  project: RegisteredModelProjectSummaryV1,
  tags: {[key: string]: string}
  ownerUsername: string
  discoverable?: boolean
  createdAt: string,
  updatedAt: string
  currentStage: string
}

/**
 * Envelope that comes back from getRegisteredModels
 * TODO: this type should come from swagger codegen
 */
export type PaginatedRegisteredModelsEnvelopeV1 = {
  items: RegisteredModelV1[]
  metadata: {
    requestId: string
    notices: string[]
    offset: number,
    limit: number,
    totalCount: number
  }
}

/**
 * Regisered Model API Object
 * TODO: this type should come from swagger codegen
 */
export type RegisteredModelVersionModelApiV1 = {
  id: string,
  name: string,
  description: string,
  activeVersionNumber?: number,
  activeModelVersionId?: string,
  activeVersionStatus?: string,
  project: RegisteredModelProjectSummaryV1,
  updatedAt: string
}

/**
 * Envelope that comes back from getRegisteredModelVersionModelApis
 * TODO: this type should come from swagger codegen
 */
export type PaginatedRegisteredModelVersionModelApiEnvelopeV1 = {
  items: RegisteredModelVersionModelApiV1[]
  metadata: {
    requestId: string
    notices: string[]
    offset: number,
    limit: number,
    totalCount: number
  }
}

/**
 * Project details (name, owner, id) returned by the API
 * TODO: this type should come from swagger codegen
 */
export type RegisteredModelProjectSummaryV1 = {
  id: string
  name: string
  ownerUsername: string
}

/**
 * Envelope that comes back from getRegisteredModelVersions
 * TODO: this type should come from swagger codegen
 */
export type PaginatedRegisteredModelVersionOverviewEnvelopeV1 = {
  items: RegisteredModelVersionOverviewV1[],
  metadata: PaginatedRegisteredModelsEnvelopeV1["metadata"] // lazy shortcut. paginated metadata should probably be its own type.
}

/**
 * Overview of a single version that comes back from getRegisteredModelVersions
 * TODO: this type should come from swagger codegen
 */
export type RegisteredModelVersionOverviewV1 = {
  modelName: string
  modelVersion: number
  experimentRunId: string
  project: RegisteredModelProjectSummaryV1
  ownerUsername: string
  createdAt: string
  updatedAt: string
}

/**
 * Details of a single registered model version that comes back from getRegisteredModelVersion
 * TODO: this type should come from swagger codegen
 */
export type RegisteredModelVersionDetailsV1 = {
  modelName: string
  modelVersion: number
  modelVersionDescription: string
  experimentRunId: string
  project: RegisteredModelProjectSummaryV1
  tags: {[key: string]: string}
  ownerUsername: string
  createdAt: string
  updatedAt: string
  currentStage: string
}

export type Stages = {
  label: string;
}

export type ModelStages = {
  items: Stages[];
  metadata: {
    requestId: string;
    notices: string[]
  }
}
