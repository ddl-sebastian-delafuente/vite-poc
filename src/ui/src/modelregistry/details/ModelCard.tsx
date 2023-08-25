import * as React from 'react';
import styled from 'styled-components';
import { capitalize } from 'lodash';
import { useLocation } from 'react-router-dom';
import { Col, Button, Row } from 'antd';
import * as R from 'ramda';
import { CaretDownFilled } from '@ant-design/icons';
import { getField } from '@domino/ui/dist/utils/searchUtils';
import { success, error as toastError } from '@domino/ui/dist/components/toastr';
import { getErrorMessage } from '@domino/ui/dist/components/renderers/helpers';
import Tag from '@domino/ui/dist/components/Tag/Tag';
import { colors, margins, paddings, themeHelper } from '../../styled';
import { useGetRegisteredModelByName, useGetRegisteredModelVersion } from '../modelRegistryHooks';
import EditReview from './EditReview';
import ModelCardEmptyState from './ModelCardEmptyState';
import ModelCardSidebar from './ModelCardSidebar';
import ModelCardVersionDetails from './ModelCardVersionDetails';
import VersionPicker from './VersionPicker';
import StartReview from './StartReview';
import { RegisteredModelV1, Stages } from '../types';
import CompleteReview from './CompleteReview';
import { cancelReview, editReview, getModelStages, getRegisteredModelVersions, getRegisteredModelVersionModelApis, startReview, transitionModelVersionStage, ModelApiSummary, ModelApiItems, ReviewSummary, ReviewStatus, ReviewDecisions, submitReview } from './../api';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Select from '../../components/Select';
import GitLogoMarkColor from '../../icons/GitLogoMarkColor';
import { getProjectSummary } from '@domino/api/dist/Projects'
import { browseCode, browseFiles } from '../../core/routes'

const { Option } = Select;

export const START_REVIEW_SUCCESS_MESSAGE = 'Created Review Successfully';
export const UPDATE_REVIEW_SUCCESS_MESSAGE = 'Saved Review Successfully';
export const CANCEL_REVIEW_SUCCESS_MESSAGE = 'Canceled Review Successfully';
export const SUBMIT_REVIEW_SUCCESS_MESSAGE = 'Submitted Review Successfully';
export const TRANSITION_STAGE_SUCCESS_MESSAGE = 'Changed Model Version Stage Successfully';

const StyledReviewButtonsLayout = styled(FlexLayout)`
  height: 100%;
  .ant-tag {
    color: ${colors.white};
    text-align: center;
    padding: 6px ${themeHelper('margins.tiny')};
    min-width: 100px;
    font-size: ${themeHelper('fontSizes.small')};
    margin-right: 0;
  }
`;
const StyledStageSelector = styled.div`\
  margin: 0;
  .ant-select-item-option {
    text-transform: capitalize;
  }
  .ant-select-selector {
    background-color: ${colors.orange500} !important;
    border-color: ${colors.orange500} !important;
    border-radius: 100px !important;
    color: ${colors.white};
  }
  .ant-select-selection-placeholder, .ant-select-arrow, .ant-select-selection-item {
    color: ${colors.white} !important;
    text-transform: capitalize;
  }
  .ant-select-selector {
    box-shadow: none !important;
  }
  .ant-tag {
    border-radius: 100px;
  }
  .anticon-partition {
    margin-right: 4px
  }
`;
const StageLabel = styled.div`
  .ant-tag {
    border-radius: 100px;
  }
  .anticon-partition {
    margin-right: 4px
  }
`;
const TransitionText = styled.span`
  margin-right: ${themeHelper('margins.small')} !important;
  .ant-tag {
    color: ${colors.neutral500};
    font-size: ${themeHelper('fontSizes.small')};
    margin: 0;
  }
`;

export type StartReviewData = {
  notes?: string;
  reviewers: string[];
  nextStage: string;
}
export type EditReviewData = {
  notes?: string;
  reviewers: string[];
}
export type SubmitReviewData = {
  notes?: string;
  decision: ReviewDecisions;
}

type StageSelectOption = {
  label: string;
  value: string;
}

type ModelCardProps = {
  modelName: string;
  currentUserName?: string;
}
const ModelCard: React.FC<ModelCardProps> = ({modelName, currentUserName}) => {
  const { isLoading, error, data: model } = useGetRegisteredModelByName({ modelName });
  const projectId = model?.project?.id;

  // parse '?version=' in the URL
  const { search } = useLocation();
  const selectedVersion = React.useMemo(() => {
    const versionFromUrl = getField(search, 'version');
    return versionFromUrl ? Number(versionFromUrl) : null;
  }, [search])
  const latestVersion = model?.latestVersion;
  const modelVersion = selectedVersion || latestVersion;

  const [version, setVersion] = React.useState<number | undefined>();
  const [hasNoReviewSummary, setHasNoReviewSummary] = React.useState<boolean>(false);
  const [reviewSummary, setReviewSummary] = React.useState<ReviewSummary>();
  const [loadingReviewSummary, setLoadingReviewSummary] = React.useState<boolean>(true);
  const [modelCurrentStage, setModelCurrentStage] = React.useState<string>();
  const [modelApiSummary, setModelApiSummary] = React.useState<ModelApiSummary>();
  const [loadingModelApis, setLoadingModelApis] = React.useState<boolean>(true);
  const [stages, setStages] = React.useState<Stages[]>([]);
  const [stageOptions, setStageOptions] = React.useState<StageSelectOption[]>([]);

  const getModelVersions = async (versionNumber: number) => {
    try {
      const data = await getRegisteredModelVersions({modelName, version: versionNumber});
      setHasNoReviewSummary(R.isNil(data.reviewSummary));
      setReviewSummary(data.reviewSummary);
      setModelCurrentStage(data.currentStage);
    } catch(e) {
      console.warn(e);
    } finally {
      setLoadingReviewSummary(false)
    }
  };

  const parseModelApiItems = (item: any): ModelApiItems => {
    return {
      modelApiName: item.name,
      modelApiId: item.id,
      status: item.activeVersionStatus,
      lastModified: item.updatedAt
    };
  }

  const getModelVersionApis = async (modelName: string, versionNumber: number) => {
    try {
      const data = await getRegisteredModelVersionModelApis({modelName, version: versionNumber});
      const modelApiItems = data?.items.map(parseModelApiItems);
      setModelApiSummary({ ModelApis: modelApiItems, projectId: projectId });
    } catch(e) {
      console.warn(e);
    } finally {
      setLoadingModelApis(false)
    }
  };

  const getModelStagesList = async () => {
    try {
      const stagesList = await getModelStages();
      setStages(stagesList.items)
    } catch(e) {
      console.warn(e);
    }
  }

  const getStageOptions = (items: Stages[]) => {
    return R.map(({ label }) => ({ label: label, value: label }), items);
  }

  React.useEffect(() => {
    if (version) {
      getModelVersions(version);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  React.useEffect(() => {
    setVersion(modelVersion);
  }, [modelVersion])

  React.useEffect(() => {
    if (modelName && modelVersion) {
      getModelVersionApis(modelName, modelVersion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelName, modelVersion]);

  React.useEffect(() => {
    const filteredStages = getStageOptions(stages);
    setStageOptions(filteredStages)
  }, [stages, modelCurrentStage])

  React.useEffect(() => {
    getModelStagesList();
  }, []);

  const doStartReview = async (data: StartReviewData) => {
    const {notes, nextStage: targetStage, reviewers } = data;
    if (model && version) {
      try {
        const userIds = R.map(user => ({userId: user}), reviewers);
        await startReview({ modelName: model.name, version: version, targetStage, notes, reviewers: userIds})
        success(START_REVIEW_SUCCESS_MESSAGE);
        version && getModelVersions(version);
        return Promise.resolve()
      } catch(e) {
        console.warn(e);
        toastError(await getErrorMessage(e, 'Failed to create a review'));
        return Promise.reject();
      }
    }
    return Promise.reject();
  }

  const completeReview = async (data: SubmitReviewData) => {
    const {notes, decision } = data;
    if (model && reviewSummary && version) {
      try {
        await submitReview({
          modelName: model.name,
          version: version,
          decision: decision,
          notes: notes,
          modelReviewId: reviewSummary.modelReviewId})
        success(SUBMIT_REVIEW_SUCCESS_MESSAGE);
        version && getModelVersions(version);
        return Promise.resolve()
      } catch(e) {
        console.warn(e);
        toastError(await getErrorMessage(e, 'Failed to submit a review'));
        return Promise.reject();
      }
    }
    return Promise.reject();
  }

  const doEditReview = async (data: EditReviewData) => {
    const {notes, reviewers } = data;
    if (model && version && reviewSummary) {
      try {
        const userIds = R.map(user => ({userId: user}), reviewers);
        await editReview({ modelName: model.name, version: version, modelReviewId: reviewSummary.modelReviewId, notes, reviewers: userIds})
        success(UPDATE_REVIEW_SUCCESS_MESSAGE);
        version && getModelVersions(version);
        return Promise.resolve()
      } catch(e) {
        console.warn(e);
        toastError(await getErrorMessage(e, 'Failed to update a review'));
        return Promise.reject();
      }
    }
    return Promise.reject();
  }

  const doCancelReview = async () => {
    if (model && version && reviewSummary) {
      try {
        await cancelReview({ modelName: model.name, version: version, modelReviewId: reviewSummary.modelReviewId})
        success(CANCEL_REVIEW_SUCCESS_MESSAGE);
        version && getModelVersions(version);
        return Promise.resolve()
      } catch(e) {
        console.warn(e);
        toastError(await getErrorMessage(e, 'Failed to cancel a review'));
        return Promise.reject();
      }
    }
    return Promise.reject();
  }

  const transitionStage = async (stage: string) => {
    if (model && version && !R.equals(stage, modelCurrentStage)) {
      try {
        await transitionModelVersionStage({ modelName: model.name, version: version, stage: stage})
        success(TRANSITION_STAGE_SUCCESS_MESSAGE);
        version && getModelVersions(version);
        return Promise.resolve()
      } catch(e) {
        console.warn(e);
        toastError(await getErrorMessage(e, 'Failed to change model version stage'));
        return Promise.reject();
      }
    }
  }
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!model) return <p>No data!</p>

  return (
    <>
      <Row style={{margin: '0 -16px', padding: '10px 16px', backgroundColor: colors.antgrey4}}>
        <Col span={8} style={{backgroundColor: colors.antgrey4}}>
          <Row style={{gap: '15px', height: '100%', alignItems: 'center'}}>
            <Col>
              <VersionPicker model={model} version={version} setVersion={setVersion}/>
            </Col>
            <Col>
              <GitCommitInfo model={model} version={version} />
            </Col>
          </Row>
        </Col>
        <Col span={16} style={{padding: '18px 16px', backgroundColor: colors.antgrey4}} flex="auto">
          <StyledReviewButtonsLayout justifyContent="flex-end" alignContent="flex-end">
            {R.equals(currentUserName,  model.tags['mlflow.domino.user']) && (!reviewSummary || !R.equals(reviewSummary.status, ReviewStatus.OPEN)) && modelCurrentStage && <StyledStageSelector>
              <Select
                defaultValue={modelCurrentStage}
                onChange={value => transitionStage(value)}
                style={{width: '120px'}}
                suffixIcon={<CaretDownFilled/>}
                data-test="transition-stage-selector"
              >
                {R.map(option => <Option key={option.value}>{option.label}</Option>, stageOptions)}
              </Select>
            </StyledStageSelector> }

            {(!R.equals(currentUserName,  model.tags['mlflow.domino.user']) || (reviewSummary && R.equals(reviewSummary.status, ReviewStatus.OPEN))) && <StageLabel data-test="stage-info"><Tag color={colors.orange500}>{modelCurrentStage || 'None'}</Tag></StageLabel>}

            {reviewSummary && R.equals(reviewSummary.status, ReviewStatus.OPEN) && <><TransitionText><Tag color={colors.transparent}>transitioning to</Tag></TransitionText><StageLabel data-test="stage-info"><Tag color={colors.orange500}>{capitalize(reviewSummary.targetStage)}</Tag></StageLabel></>}

            {R.equals(currentUserName,  model.tags['mlflow.domino.user']) && (hasNoReviewSummary || (reviewSummary && !R.equals(reviewSummary.status, ReviewStatus.OPEN))) && (
              <StartReview model={model} createModelReview={doStartReview} version={version} modelCurrentStage={modelCurrentStage}/>)}

            {R.equals(currentUserName,  model.tags['mlflow.domino.user']) && reviewSummary && R.equals(reviewSummary.status, ReviewStatus.OPEN) && (
              <EditReview model={model} version={version} modelCurrentStage={modelCurrentStage} review={reviewSummary} cancelModelReview={doCancelReview} editModelReview={doEditReview}/>)}

            {reviewSummary && R.equals(reviewSummary.status, ReviewStatus.OPEN) && R.contains(currentUserName, R.map(res => res.reviewer.username, reviewSummary.reviewerResponses)) &&
              !R.equals(ReviewDecisions.APPROVED, R.find((user) => R.equals(user.reviewer.username, currentUserName), reviewSummary.reviewerResponses)?.decision) &&
              <CompleteReview submitReview={completeReview} modelCurrentStage={modelCurrentStage} review={reviewSummary}/>}
          </StyledReviewButtonsLayout>
        </Col>
      </Row>
      <Row style={{marginTop: margins.LARGE_INT}}>
        <Col className="modelCardBody" span={16} style={{paddingRight: paddings.LARGE}}>
          {version && <VersionDetails model={model} version={version} />}
          {!version && <ModelCardEmptyState />}
        </Col>
        <Col className="modelCardSidebar" span={8}>
          <ModelCardSidebar
            model={model}
            version={version}
            reviewSummary={reviewSummary}
            loadingReviewSummary={loadingReviewSummary}
            modelApiSummary={modelApiSummary}
            loadingModelApis={loadingModelApis}
            currentUserName={currentUserName}
          />
        </Col>
      </Row>
    </>
  );
}

const VersionDetails: React.FC<{model: RegisteredModelV1, version: number}> = ({model, version}) => {
  const { isLoading, error, data: modelVersion } = useGetRegisteredModelVersion({
    modelName: model.name,
    version,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!modelVersion) return <p>No data!</p>

  return (
    <ModelCardVersionDetails modelVersion={modelVersion} />
  );
}

const GitCommitInfo: React.FC<{model: RegisteredModelV1, version?: number}> = ({model, version}) => {
  const { data: modelVersion } = useGetRegisteredModelVersion({
    modelName: model.name,
    version: version!,
  }, { enabled: Boolean(version) })

  const gitCommitTag = modelVersion?.tags['mlflow.source.git.commit']
  if (!gitCommitTag) return <></>

  const handleGitCommitClick = async () => {
    const projectId = model.project.id
    const project = await getProjectSummary({ projectId })
    const isGitBasedProject = !R.isNil(project.mainRepository)

    // git-based projects and classic projects have different URLs for viewing files, but the route helpers have an identical signature
    const urlFn = isGitBasedProject ? browseCode : browseFiles
    const url = urlFn(project.ownerUsername, project.name, gitCommitTag)
    window.location.href = url
  }
  return (
    <GitCommitWrapper onClick={handleGitCommitClick}>
      <GitLogoMarkColor height={22} width={22} />
      #{gitCommitTag.substring(0, 7)}
    </GitCommitWrapper>
  )
}

const GitCommitWrapper = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #E0E0E0;
  border-radius: 2px;
  color: #383838;
  padding: 4px 5px;
  box-sizing: border-box;
  &:hover {
    color: #383838;
  }
}
`

export default ModelCard
