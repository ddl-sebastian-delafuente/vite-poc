import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { capitalize } from 'lodash';
import { CheckCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DominoCommonUserPerson } from '@domino/api/dist/types';
import { getProjectSummary } from '@domino/api/dist/Projects';
import { listUsers } from '@domino/api/dist/Users';
import Button from '@domino/ui/dist/components/Button/Button';
import ModalWithButton from '@domino/ui/dist/components/ModalWithButton';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import { themeHelper, colors, fontWeights, fontSizes } from '@domino/ui/dist/styled';
import type { RegisteredModelV1 } from '../types'
import { ReviewSummary } from '../api';
import { DynamicFieldDisplay, FieldValue, FieldStyle, FieldType, Layout } from '../../components/DynamicField';
import { ValidationStatus } from '../../components/DynamicWizard/useValidationState';
import LabelAndValue, { Direction } from '../../components/LabelAndValue';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Tag from '../../components/Tag/Tag';
import WarningBox from '../../components/WarningBox';
import { EditReviewData } from './ModelCard';

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
const DeleteReviewLayout = styled(FlexLayout)`
  justify-content: flex-start;
  margin-bottom: ${themeHelper('paddings.tiny')};
  width: 100%;
`;
const EditFooterLayout = styled(FlexLayout)`
  justify-content: flex-end;
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

type FormData = {
  reviewers: string[],
  notes?: string;
}
type EditReviewProps = {
  model: RegisteredModelV1,
  version?: number;
  modelCurrentStage?: string;
  review: ReviewSummary,
  cancelModelReview: () => Promise<any>
  editModelReview: (data: EditReviewData) => Promise<any>;
}

const EditReview: React.FC<EditReviewProps> = ({ model, version, modelCurrentStage, review, cancelModelReview, editModelReview}) => {
  const [data, setData] = React.useState<FormData>({ reviewers: review.reviewerResponses.map(r => r.reviewer.id), notes: review.notes });
  const [collaborators, setCollaborators] = React.useState<DominoCommonUserPerson[]>([]);
  const [showReviewersError, setShowReviewersError] = React.useState<boolean>(false);
  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>(ValidationStatus.pending);

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

  React.useEffect(() => {
    getProjectInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = async () => {
    if (version) {
      return cancelModelReview().then(() => {
        setData({
          notes: undefined,
          reviewers: []
        });
      })
    }
    return Promise.reject()
  }

  const onSubmit = async () => {
    setValidationStatus(ValidationStatus.initialized);
    const { notes, reviewers } = data;

    if (!R.isEmpty(reviewers)) {
      // @ts-ignore
      return editModelReview({notes, reviewers})
    } else {
      setShowReviewersError(true);
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
      id: "edit-review-notes",
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
        openButtonProps={{
          isIconOnlyButton: true,
          icon: (<EditOutlined/>),
          btnType: "secondary",
          iconOnlyButtonColor: "transparent",
          title: 'Edit review'
        }}
        ModalCustomFooter={
          <EditFooterLayout>
            <ModalWithButton
              ModalButton={Button}
              disabled={false}
              openButtonProps={{
                isIconOnlyButton: true,
                icon: (<DeleteOutlined/>),
                btnType: "secondary",
                isDanger: true,
                iconOnlyButtonColor: "transparent",
                title: 'Cancel review'
              }}
              modalProps={{
                title: (
                  <FlexLayout justifyContent="flex-start" alignItems="center">
                    <Title>Delete Review Request?</Title>
                  </FlexLayout>
                ),
                'data-test': "cancel-review-modal",
                destroyOnClose: true
              }}
              modalSubmitButtonLabel="Delete Review Request"
              submitButtonProps={{
                isDanger: true,
              }}
              modalCancelButtonLabel="Cancel"
              testId="cancel-review-modal-button"
              closable={true}
              // @ts-ignore
              handleFailableSubmit={onCancel}
            >
              <DeleteReviewLayout>
                Are you sure you want to delete the review request?
                <WarningBox className="warning-box" fullWidth={true}>
                  This action cannot be undone
                </WarningBox>
              </DeleteReviewLayout>
            </ModalWithButton>
          </EditFooterLayout>
        }
        modalProps={{
          title: (
            <FlexLayout justifyContent="flex-start" alignItems="center">
              <IconWrapper><CheckCircleFilled/></IconWrapper>
              <Title>Edit model review</Title>
            </FlexLayout>
          ),
          'data-test': "edit-review-modal",
          destroyOnClose: true
        }}
        modalSubmitButtonLabel="Save & Send"
        modalCancelButtonLabel="Cancel"
        testId="edit-review-modal-button"
        submitButtonProps={{
          disabled: (showReviewersError && R.isEmpty(data.reviewers))
        }}
        closable={true}
        // @ts-ignore
        handleFailableSubmit={onSubmit}
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
              value={
                <FlexLayout justifyContent="space-between" alignItems="center" alignContent="center">
                  <Tag color={colors.orange500} data-test="current-stage">{capitalize(modelCurrentStage)}</Tag>
                  <TansitionText><Tag color={colors.transparent}>transition to</Tag></TansitionText>
                </FlexLayout>
              }
            />
          </DevelopmentStage>
          <DevelopmentStage>
            <LabelAndValue
              label="Next stage"
              labelStyles={StagesLabelStyles}
              wrapperStyles={wrapperStyles}
              value={
                <FlexLayout justifyContent="space-between" alignItems="center" alignContent="center">
                  <Tag color={colors.orange500} data-test="current-stage">{capitalize(review.targetStage)}</Tag>
                </FlexLayout>
              }
            />
          </DevelopmentStage>
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
            antFormProps={{layout: 'vertical', requiredMark: 'optional', initialValues: data}}
            validationStatus={validationStatus}
            setValidationStatus={setValidationStatus}
            testIdPrefix="edit-review"
          />
        </DynamicFieldDisplayWrapper>
      </ModalWithButton>
    </div>

  );
}
export default EditReview;
