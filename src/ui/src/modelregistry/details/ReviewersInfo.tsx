import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { themeHelper, colors } from '@domino/ui/dist/styled';
import { ReviewStatus, ReviewSummary, ReviewDecisions } from '../api';
import type { RegisteredModelV1 } from '../types';
import FlexLayout from '../../components/Layouts/FlexLayout';
import WaitSpinner from '../../components/WaitSpinner';
import SideNavUserIcon from '../../icons/SideNavUserIcon';

const Wrapper = styled.div`
  .anticon-check-circle {
    color: ${colors.green500};
  }
  .anticon-close-circle {
    color: ${colors.red500};
  }
  .anticon-question-circle {
    color: ${colors.neutral900};
  }
`;
const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  padding: 0 12px;
`;
const EmptyState = styled(FlexLayout)`
  font-size:  ${themeHelper('fontSizes.small')};
  color: ${colors.neutral500};
  margin-top: 36px;
  padding-bottom: 60px;
  border-bottom: 1px solid ${colors.neutral300}
`;
const ReviewersLayout = styled(FlexLayout)`
  padding: ${themeHelper('paddings.large')} 0;
  border-bottom: 1px solid ${colors.neutral300};
`;
const StyledText = styled.div`
  color: ${colors.neutral500}
`;
const StyledLayout = styled(FlexLayout)`
  margin-left: 0;
  margin-bottom: ${themeHelper('margins.tiny')};
`;
const ReviewerName = styled.span`
  color: ${colors.black};
  margin-left: 4px;
  margin-right: 0;
`;
type ReviewersInfoProps = {
  reviewSummary?: ReviewSummary;
  model: RegisteredModelV1;
  loadingReviewSummary: boolean;
  currentUserName?: string;
}

const ReviewersInfo = (props: ReviewersInfoProps) => {
  const { reviewSummary, loadingReviewSummary, currentUserName } = props;

  const getFormatedText = (reviewer: string) => {
    return R.equals(currentUserName, reviewer) ? 'have' : 'has'
  };

  const getSideUserIcon = (ownerInitials: string) => {
    return (<SideNavUserIcon ownerInitials={ownerInitials} width={24} height={24} fill={colors.basicLink} secondaryColor={colors.neutral50}/>)
  };

  const getReviewersInfo = (reviewer: string, decision?: ReviewDecisions) => {
    return R.cond([
      [R.equals(ReviewDecisions.APPROVED), () => {
        return (<StyledText>{getFormatedText(reviewer)} reviewed this <CheckCircleFilled/></StyledText>);
      }],
      [R.equals(ReviewDecisions.REQUESTED), () => {
        return (<StyledText>{getFormatedText(reviewer)} requested changes <CloseCircleFilled/></StyledText>);
      }],
      [R.T, () => {
        return (<StyledText>{getFormatedText(reviewer)} not reviewed this</StyledText>);
      }]
    ])(decision)
  }

  return (
    <Wrapper data-test="reviewers-summary">
      <Header>Reviewers</Header>
      {
        loadingReviewSummary ? <WaitSpinner/> : (reviewSummary && R.equals(reviewSummary.status, ReviewStatus.OPEN) ? (
          <ReviewersLayout flexDirection="column" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
            {
              R.map(({reviewer, decision}) => {
                const ownerInitials = (reviewer.firstName.substring(0, 1) + reviewer.lastName.substring(0, 1)).toUpperCase();
                return (
                <StyledLayout key={reviewer.username} alignItems="center" justifyContent="flex-start" alignContent="center" data-test="reviewer-info">
                  {getSideUserIcon(ownerInitials)} <ReviewerName data-test="reviewer-name">{R.equals(currentUserName, reviewer.username) ? 'You' : reviewer.username}</ReviewerName> {getReviewersInfo( reviewer.username, decision)}
                </StyledLayout>
              )}, reviewSummary.reviewerResponses)
            }
          </ReviewersLayout>) : <EmptyState data-test="reviewers-empty-state">There are no reviewers.</EmptyState>)
      }
    </Wrapper>
  )
}
export default ReviewersInfo;
