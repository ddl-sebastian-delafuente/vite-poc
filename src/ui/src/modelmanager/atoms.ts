// @ts-ignore
import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Select } from 'antd';
import  Icon  from '@ant-design/icons';
import { colors, themeHelper } from '../styled';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import EmptyMessage from '@domino/ui/dist/components/EmptyMessage/EmptyMessage';
import ExternalLink from '@domino/ui/dist/icons/ExternalLink';
import Link from '@domino/ui/dist/components/Link/Link';
import InvisibleButton from '../components/InvisibleButton';
import DominoModal from '../components/Modal';
import { lightBlackTwo, boulder, mineShaftColor, mediumGrey } from '../styled/colors';
// @ts-ignore
export const SuccessCheckIcon = styled(Icon)<any>`
  color: ${colors.goodGreenColor};
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const AlertDisabledIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 15px;
  background-color: ${colors.grey70};
`;

export const NoModelMonitioringText = styled.div`
  display: inline;
  padding: 0.2em 0.6em 0.3em;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: ${colors.white};
  background-color: ${colors.greyishBrown};
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em;
`;

export const ModelAlertsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
  bottom: 1px;
  padding-top: 1px;
  padding-bottom: 1px;
`;

export const PredictionText = styled.span`
  font-size: 14px;
  font-weight: ${themeHelper('fontWeights.medium')};
`;

// monitoring tab

export const ScheduleCheckContainer = styled.div`
  height: 450px;
  padding: ${themeHelper('paddings.medium')};
  & > iframe {
    height: 100%;
    width: 100%;
    margin: 0;
    border: none;
  }
`;

export const TestsAndThresholdContainer = styled.div`
  height: 790px;
  padding: ${themeHelper('paddings.medium')};
  & > iframe {
    height: 100%;
    width: 100%;
    margin: 0;
    border: none;
  }
`;

export const MonitoringActionsContainer = styled(FlexLayout)`
  width: 100%;
`;

export const MonitoringWrapper = styled(FlexLayout)`
  flex-direction: column;
  align-items: start;
  & > * {
    margin-bottom: ${themeHelper('margins.medium')};
  }
`;

export const DriftAndQualityContainer = styled.div`
  height: 60vh;
  width: 100%;
  & > iframe {
    height: 100%;
    width: 100%;
    margin: 0;
    border: none;
  }
`;

export const ModelMonitoringEmptyState = styled(EmptyMessage)`
  width: 100%;
  margin-top: 10%;
`;

export const CancelButtonContainer = styled.div`
  bottom: 24px;
  right: 160px;
  position: absolute;
`;

export const NotificationModal = styled(DominoModal)`
  .ant-modal-footer {
    margin-right: ${themeHelper('margins.tiny')};
  }
`;

export const EmailSelectContainer = styled(Select)<any>`
  height: fit-content;
  display: block;
  .ant-select-selection__rendered {
    margin: 0;

    .ant-select-selection__choice {
      border: none;
      margin: 4px;
      background-color: ${colors.accordionHeaderGrey};
    }

    .ant-select-search.ant-select-search--inline {
      margin: 0;

      .ant-select-search__field {
        margin: 4px;
        width: unset;
      }
    }
  }
  .ant-select-selection.ant-select-selection--multiple {
    height: 80px;
    resize: vertical;
    overflow: auto;
  }
`;

export const NotificationHeader = styled.div`
  font-weight: bolder;
  margin-bottom: ${themeHelper('margins.tiny')};
`;

export const NotificationContainer = styled.div`
  height: fit-content;
`;

// Add data

export const FeatureSetInputsContainer = styled(FlexLayout)`
  margin-top: ${themeHelper('margins.large')};
  margin-right: 30%;
  align-items: baseline;
  & > div:nth-child(1) {
    flex: 1;
    margin-right: ${themeHelper('margins.tiny')};
  }
  & > div:nth-child(2) {
    flex: 0.5;
  }
`;

export const FeatureSetHelperText = styled.p`
  font-size: ${themeHelper('fontSizes.tiny')};
  color: ${mediumGrey};
  padding-left: ${themeHelper('paddings.medium')};
  padding-right: ${themeHelper('paddings.medium')};
`;

export const AddDataHeader = styled.p`
  font-weight: 500;
  font-size: ${themeHelper('fontSizes.small')};
  color: ${mineShaftColor};
  margin-bottom: ${themeHelper('margins.tiny')};
  line-height: 1;
`;

export const AddText = styled.p`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${boulder};
  margin-top: ${themeHelper('margins.tiny')};
`;

export const ExternalLinkIcon = styled(ExternalLink)`
  padding-left: 2px;
  position: relative;
  right: 5px;
`;

export const StyledLink = styled(Link)`
  padding-left: 5px;
  padding-right: 5px;
`;

export const RecordedModelDataText = styled.p`
  color: ${mineShaftColor};
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 1.5;
  margin-bottom: ${themeHelper('margins.medium')};
`;

export const ModelTypeWrapper = styled.div`
  margin-bottom: ${themeHelper('margins.medium')};
`;

export const IngestDataHeader = styled.p`
  color: ${mineShaftColor};
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 1;
  margin-top: ${themeHelper('margins.tiny')};
  margin-bottom: ${themeHelper('margins.tiny')};
`;

export const IngestDataText = styled.p`
  color: ${boulder};
  font-size: ${themeHelper('fontSizes.small')};
  line-height: 1.5;
  margin-bottom: ${themeHelper('margins.medium')};
`;

export const StyledInvisibleButton = styled(InvisibleButton)`
  &,
  &:hover {
    color: ${lightBlackTwo};
  }
`;

export const PredictionDatasetLink = styled(Link)`
  font-size: ${themeHelper('fontSizes.medium')};
  padding: 6px 0 8px;
`;

export const StyledThresholdModal = styled.div`
  .ant-modal {
    top: 20px;
  }
`;

export const SpinningDominoLogoContainer = styled(FlexLayout)`
  height: 80px;
  flex-direction: row;
  align-content: center;
`;
