import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { capitalize } from 'lodash';
import { CheckCircleFilled } from '@ant-design/icons';
import ModalWithButton from '@domino/ui/dist/components/ModalWithButton';
import Button from '@domino/ui/dist/components/Button/Button';
import { themeHelper, colors, fontSizes, fontWeights } from '@domino/ui/dist/styled';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Tag from '../../components/Tag/Tag';
import { SubmitReviewData } from './ModelCard';
import { FieldType, Layout } from '../../components/DynamicField/DynamicField.types';
import { DynamicFieldDisplay, FieldValue, FieldStyle } from '../../components/DynamicField';
import { ValidationStatus } from '../../components/DynamicWizard/useValidationState';
import { ReviewDecisions, ReviewSummary } from '../api';
import { DynamicFieldDisplayWrapper } from './StartReview';
import LabelAndValue from '@domino/ui/dist/components/LabelAndValue';

const LabelStyles = {
  fontSize: fontSizes.SMALL,
  textTransform: 'none',
  color: colors.neutral900,
  fontWeight: fontWeights.MEDIUM,
  marginBottom: '2px'
} as React.CSSProperties;

const wrapperStyles = {
  margin: 0
} as React.CSSProperties;
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
const StagesLayout = styled(FlexLayout)`
  width: 100%;
  margin-bottom: ${themeHelper('margins.small')};
  .ant-tag {
    color: ${colors.neutral50};
    padding: 6px ${themeHelper('margins.tiny')};
    font-size:${themeHelper('fontSizes.small')};
    border-radius: 100px;
    min-width: 100px;
    text-align: center;
    margin: 0;
  }
`;
const CurrentStage = styled.div`
  margin: 0;
`;
const NextStage = styled.div`
  margin: 0;
`;
const TansitionText = styled.span`
  .ant-tag {
    color: ${colors.neutral500};
    font-size: ${themeHelper('fontSizes.small')};
    padding: 0;
  }
`;
const SubText = styled.div`
  font-size:  ${themeHelper('fontSizes.tiny')};
  color: ${colors.neutral500};
  font-weight: ${themeHelper('fontWeights.normal')};
`;
const DynamicFieldDisplayLayout = styled(DynamicFieldDisplayWrapper)`
  .ant-form-item-label {
    display: none;
  }
`;

type FormData = {
  notes?: string;
  decision: ReviewDecisions;
  reason?: string;
}

type CompleteReviewProps = {
  modelCurrentStage?: string,
  review: ReviewSummary,
  submitReview: (data: SubmitReviewData) => Promise<any>;
}

const CompleteReview: React.FC<CompleteReviewProps> = ({ modelCurrentStage = 'None', review, submitReview }) => {
  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>(ValidationStatus.pending);
  const [data, setData] = React.useState<FormData>({} as FormData);
  const [showDecisionError, setShowDecisionError] = React.useState<boolean>(false);
  const [showNotesError, setShowNotesError] = React.useState<boolean>(false);
  const { notes, decision, reason } = data;

  const onCancel = () => {
    setData({} as FormData);
    setShowDecisionError(false);
    setShowNotesError(false);
  };
  const handleChange = React.useCallback((field: string, value: FieldValue) => {
    const newData = {
      ...data,
      [field]: value,
    };
    setData(newData);
  }, [data, setData]);

  const getValidationStatus = () => {
    if (R.isNil(decision)) {
      return false;
    } else {
      if (R.equals(ReviewDecisions.REQUESTED, decision) && (R.isNil(reason) || R.isEmpty(reason))) {
        return false
      }
    }
    return true;
  }

  const onSubmit = async () => {
    setValidationStatus(ValidationStatus.initialized);
    if (getValidationStatus()) {
      return submitReview({
        notes : R.equals(ReviewDecisions.REQUESTED, decision) ? reason : notes,
        decision
      }).then(() => {
        setData({} as FormData)
      })
    } else {
      if(R.isNil(decision)) {
        setShowDecisionError(true);
      }
      if (R.equals(ReviewDecisions.REQUESTED, decision) && (R.isNil(reason) || R.isEmpty(reason))) {
        setShowNotesError(true)
      }
    }
    return Promise.reject()
  }

  const layoutFields: Layout = {
    elements: [
      {
        fieldType: FieldType.radio,
        isRequired: true,
        label: 'Decision',
        path: 'decision',
        options: [{
          label: 'Approve',
          subLabel: <SubText>This model version will receive your approval</SubText>,
          value: ReviewDecisions.APPROVED
        }, {
          label: 'Request Changes',
          subLabel: <SubText>Submit feedback and request changes. The model version will not change stage.</SubText>,
          value: ReviewDecisions.REQUESTED
        }]
      }, {
        fieldType: FieldType.textarea,
        id: "submit-review-notes",
        label: 'Notes',
        path: R.equals(ReviewDecisions.REQUESTED, data.decision) ? 'reason' : 'notes',
        isRequired: R.equals(ReviewDecisions.REQUESTED, data.decision),
        height: 2
      }
    ]
  }

  return (
    <div>
      <ModalWithButton
        ModalButton={Button}
        disabled={false}
        openButtonLabel="Complete review"
        modalProps={{
          title: (<FlexLayout justifyContent="flex-start" alignItems="center">
            <IconWrapper><CheckCircleFilled/></IconWrapper>
            <Title>Model review</Title>
          </FlexLayout>),
          'data-test': "complete-review-modal",
          destroyOnClose: true
        }}
        modalSubmitButtonLabel="Submit"
        modalCancelButtonLabel="Cancel"
        testId="complete-review-modal-button"
        closable={true}
        submitButtonProps={{
          disabled: ((showDecisionError && R.isNil(decision)) || (showNotesError && R.equals(ReviewDecisions.REQUESTED, decision) && (R.isNil(reason) || R.isEmpty(reason))))
        }}
        // @ts-ignore
        handleFailableSubmit={onSubmit}
        handleCancel={onCancel}
      >
        <StagesLayout justifyContent="flex-start" flexWrap="nowrap">
          <CurrentStage>
            <LabelAndValue
              label="Current stage"
              labelStyles={LabelStyles}
              wrapperStyles={wrapperStyles}
              value={<div>
                <Tag color={colors.navy200} data-test="model-current-stage">{capitalize(modelCurrentStage)}</Tag>
                <TansitionText><Tag color={colors.transparent}>transition to</Tag></TansitionText>
              </div>}
            />
          </CurrentStage>
          <NextStage>
            <LabelAndValue
              label="Next stage"
              labelStyles={LabelStyles}
              wrapperStyles={wrapperStyles}
              value={<div data-test="model-target-stage">
              <Tag color={colors.orange500}>{capitalize(review?.targetStage)}</Tag>
            </div>}
            />
          </NextStage>
        </StagesLayout>
        <DynamicFieldDisplayLayout>
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
            testIdPrefix="submit-review"
          />
        </DynamicFieldDisplayLayout>
      </ModalWithButton>
    </div>

  );
}
export default CompleteReview;
