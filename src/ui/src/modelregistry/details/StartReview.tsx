import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { CheckCircleFilled, CaretDownFilled } from '@ant-design/icons';
import ModalWithButton from '@domino/ui/dist/components/ModalWithButton';
import Button from '@domino/ui/dist/components/Button/Button';
import { getProjectSummary } from '@domino/api/dist/Projects';
import { themeHelper, colors, fontWeights, fontSizes } from '@domino/ui/dist/styled';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import { listUsers } from '@domino/api/dist/Users';
import { DominoCommonUserPerson } from '@domino/api/dist/types';
import type { RegisteredModelV1, Stages } from '../types'
import FlexLayout from '../../components/Layouts/FlexLayout';
import LabelAndValue, { Direction } from '../../components/LabelAndValue';
import Select from '../../components/Select';
import Tag from '../../components/Tag/Tag';
import { StartReviewData } from './ModelCard';
import { getModelStages } from './../api';
import { DynamicFieldDisplay, FieldValue, FieldStyle } from '../../components/DynamicField';
import { FieldType, Layout } from '../../components/DynamicField/DynamicField.types';
import { ValidationStatus } from '../../components/DynamicWizard/useValidationState';

const { Option } = Select;

const StagesLabelStyles = {
  fontSize: fontSizes.SMALL,
  textTransform: 'none',
  color: colors.neutral900,
  fontWeight: fontWeights.MEDIUM,
  marginBottom: '2px'
} as React.CSSProperties;

const wrapperStyles = {
  margin: 0
} as React.CSSProperties;

const ModelNameVersionLayout = styled(FlexLayout)`
  margin-bottom: ${themeHelper('paddings.tiny')};
  width: 100%;
`;
const IconWrapper = styled.div`
  padding: ${themeHelper('paddings.tiny')} ${themeHelper('paddings.small')};
  border-radius: 5px;
  background: ${colors.zumthor};
  .anticon-check-circle {
    color: ${colors.lightishBlue};
    font-size: ${themeHelper('fontSizes.small')};
  }
`;
const Title = styled.div`
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.normal')};
  color: ${colors.greyishBrown};
`;
const ModelName = styled.div`
  width: 48%;
  margin: 0;
  margin-right: ${themeHelper('margins.tiny')};
`;
const VersionNumber = styled.div`
  width: 50%;
  margin: 0;
`;
const StagesLayout = styled(FlexLayout)`
  width: 100%;
  margin-bottom: ${themeHelper('margins.small')};
`;
const DevelopmentStage = styled.div`
  width: 50%;
  margin: 0;
  .ant-tag {
    color: ${colors.neutral50};
    padding: 6px ${themeHelper('margins.tiny')};
    font-size:${themeHelper('fontSizes.small')};
    border-radius: 100px;
    margin: 0;
    min-width: 100px;
    text-align: center;
  }
`;
const StyledNextStage = styled.div`
  width: 50%;
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
`;
const TansitionText = styled.span`
  margin-right: ${themeHelper('margins.small')} !important;
  .ant-tag {
    color: ${colors.neutral500};
    font-size: ${themeHelper('fontSizes.small')};
    margin: 0;
  }
`;
export const DynamicFieldDisplayWrapper = styled.div`
  .ant-form-item:not(:last-child) {
    margin-bottom: ${themeHelper('margins.small')};
  }
  .ant-form-item-label {
    font-weight: ${themeHelper('fontWeights.medium')};
  }
  .ant-form-item-optional {
    font-weight: ${themeHelper('fontWeights.normal')};
  }
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;
const StyledError = styled.div`
  color: ${colors.rejectRedColor};
`;
const LabelStyles: React.CSSProperties = {
  fontWeight: fontWeights.MEDIUM,
  fontSize: fontSizes.SMALL,
  color: colors.neutral900,
  textTransform: 'capitalize'
}

const ModelNameStyles: React.CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}

type SelectOption = {
  label: string;
  value: string;
}

const getOptions = (items: Stages[], stagesToBeExcluded: Stages[]) => {
  const filteredStages = R.difference(items, stagesToBeExcluded);
  return R.map(({ label }) => ({ label: label, value: label }), filteredStages);
}

type FormData = {
  reviewers: string[],
  notes?: string;
  nextStage?: string
}
type StartReviewProps = {
  model: RegisteredModelV1,
  createModelReview: (data: StartReviewData) => Promise<any>;
  version?: number;
  modelCurrentStage?: string;
}

const StartReview: React.FC<StartReviewProps> = ({ model, createModelReview, version, modelCurrentStage = 'None' }) => {
  const stagesToBeExcluded = [{ label: 'none'}, ... modelCurrentStage ?  [{ label: modelCurrentStage.toLowerCase()}] : []]
  const [data, setData] = React.useState<FormData>({ reviewers: [] });
  const [collaborators, setCollaborators] = React.useState<DominoCommonUserPerson[]>([]);
  const [stages, setStages] = React.useState<Stages[]>([]);
  const [showNextStageError, setShowNextStageError] = React.useState<boolean>(false);
  const [showReviewersError, setShowReviewersError] = React.useState<boolean>(false);
  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>(ValidationStatus.pending);
  const [options, setOptions] = React.useState<SelectOption[]>([]);

  const handleChange = React.useCallback((field: string, value: FieldValue) => {
    const newData = {
      ...data,
      [field]: value,
    };

    setData(newData);
  }, [data, setData]);

  const getCollaborators = async (ids: string[]) => {
    try {
      const users = await listUsers({userId: ids});
      setCollaborators(users);
    } catch (e) {
      console.warn(e);
    }
  };

  const getProjectInfo = async () => {
    try {
      const projectInfo = await getProjectSummary({projectId: model.project.id});
      const collaboratorIds = projectInfo.collaboratorIds
      collaboratorIds.push(projectInfo.ownerId)
      getCollaborators(collaboratorIds);
    } catch(e) {
      console.warn(e);
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

  React.useEffect(() => {
    getProjectInfo();
    getModelStagesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const filteredStages = getOptions(stages, stagesToBeExcluded);
    setOptions(filteredStages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stages, modelCurrentStage])

  const onCancel = () => {
    setData({
      nextStage: undefined,
      notes: undefined,
      reviewers: []
    });
    setShowNextStageError(false);
    setShowReviewersError(false);
  };

  const onSubmit = async () => {
    setValidationStatus(ValidationStatus.initialized);
    const { notes, reviewers, nextStage } = data;
    if (!(R.isNil(data.nextStage) || R.isEmpty(reviewers))) {
      // @ts-ignore
      return createModelReview({notes, reviewers, nextStage}).then(() => {
        setData({
          nextStage: '',
          notes: undefined,
          reviewers: []
        });
      })
    } else {
      if(R.isNil(data.nextStage) || R.isEmpty(data.nextStage)) {
        setShowNextStageError(true);

      }
      if (R.isEmpty(reviewers)) {
        setShowReviewersError(true);
      }
    }
    return Promise.reject()
  }

  const layoutFields: Layout = {
    elements: [{
      fieldType: FieldType.multiSelect,
      isRequired: true,
      label: "Reviewers",
      path: 'reviewers',
      placeholder: "Select reviewers",
      showSearch: true,
      options: R.map( user => ({value: user.id, label: user.userName}), collaborators)
    }, {
      fieldType: FieldType.textarea,
      id: "start-review-notes",
      label: "Notes for reviewers",
      path: 'notes',
      isRequired: false,
      height: 2
    }
  ]
  }

  return (
    <div>
      <ModalWithButton
        ModalButton={Button}
        disabled={false}
        openButtonLabel="Start review"
        modalProps={{
          title: (<FlexLayout justifyContent="flex-start" alignItems="center">
            <IconWrapper><CheckCircleFilled/></IconWrapper>
            <Title>Start model review</Title>
          </FlexLayout>),
          'data-test': "start-review-modal",
          destroyOnClose: true
        }}
        modalSubmitButtonLabel="Start Review"
        modalCancelButtonLabel="Cancel"
        testId="start-review-modal-button"
        submitButtonProps={{
          disabled: ((showNextStageError && R.isNil(data.nextStage) ) || (showReviewersError && R.isEmpty(data.reviewers)))
        }}
        closable={true}
        // @ts-ignore
        handleFailableSubmit={onSubmit}
        handleCancel={onCancel}
      >
        <ModelNameVersionLayout justifyContent="flex-start" flexWrap="nowrap">
          <ModelName>
            <LabelAndValue
              label="Model:"
              value={tooltipRenderer(model.name, model.name)}
              labelStyles={LabelStyles}
              direction={Direction.Row}
              valueStyles={ModelNameStyles}
              wrapperStyles={{flexWrap: 'nowrap'}}
              testId="model-name"
            />
          </ModelName>
          <VersionNumber>
            <LabelAndValue label="Version:" value={version} labelStyles={LabelStyles} direction={Direction.Row} testId="model-version"/>
          </VersionNumber>
        </ModelNameVersionLayout>
        <StagesLayout justifyContent="flex-start" alignItems="flex-start">
          <DevelopmentStage>
            <LabelAndValue
              label="Current stage"
              labelStyles={StagesLabelStyles}
              wrapperStyles={wrapperStyles}
              valueStyles={{width: '100%'}}
              value={<FlexLayout justifyContent="space-between" alignItems="center" alignContent="center">
                <Tag color={colors.navy200} data-test="current-stage">{modelCurrentStage}</Tag>
                <TansitionText><Tag color={colors.transparent}>transition to</Tag></TansitionText>
              </FlexLayout>}
            />
          </DevelopmentStage>
          <StyledNextStage>
            <LabelAndValue
              label="Next stage"
              labelStyles={StagesLabelStyles}
              wrapperStyles={wrapperStyles}
              value={<>
                <Select
                  defaultValue={data.nextStage}
                  onChange={value => {
                    setData({...data, nextStage: value});
                    setShowNextStageError(false);
                  }}
                  placeholder="Select stage"
                  status={(showNextStageError && R.isNil(data.nextStage)) ? 'error' : undefined}
                  style={{width: '150px'}}
                  suffixIcon={<CaretDownFilled/>}
                  data-test="next-stage"
                >
                  {R.map(option => <Option key={option.value}>{option.label}</Option>, options)}
                </Select>
                {showNextStageError && R.isNil(data.nextStage) && <StyledError>Please set next stage of model</StyledError>}
              </>}
            />
          </StyledNextStage>
        </StagesLayout>
        <DynamicFieldDisplayWrapper>
          <DynamicFieldDisplay
            data={{
              ...data,
            }}
            onChange={handleChange}
            editable={true}
            fieldStyle={FieldStyle.FormItem}
            layout={layoutFields}
            fullWidthInput={true}
            antFormProps={{layout: 'vertical', requiredMark: 'optional'}}
            validationStatus={validationStatus}
            setValidationStatus={setValidationStatus}
            testIdPrefix="start-review"
          />
        </DynamicFieldDisplayWrapper>
      </ModalWithButton>
    </div>

  );
}
export default StartReview;
