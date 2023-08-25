import * as React from 'react';
import styled from 'styled-components';
import FlexLayout from './Layouts/FlexLayout';
import { btnGrey, doveGreyDarker } from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import { Card } from './Layouts/AppContent';
import BigLock from '../icons/BigLock';
import { HELP_PREFIX, SUPPORT_ARTICLE } from '@domino/ui/dist/core/supportUtil';
import HelpLink from '@domino/ui/dist/components/HelpLink';
import useStore from '../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';


export interface FeatureDisabledProps {
  assetName: keyof typeof AssetDescriptionMap;
}

const ErrorIcon = styled.div`
  margin: 68px;
  padding: 22px 57px 87px;
  border-right: 1px solid ${btnGrey};
`;

const ErrorTitle = styled.h1`
  font-size: ${themeHelper('errorPage.status.fontSize')};
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${btnGrey};
  margin-bottom: 0;
`;

const ErrorMsg = styled.h6`
  font-size: ${themeHelper('fontSizes.medium')};
  font-weight: ${themeHelper('fontWeights.bold')};
  width: 500px;
  color: ${doveGreyDarker};
`;

const ErrorDescription = styled.div`
  width: 400px;
`;

const ErrorDetails = styled.div`
  margin-top: ${themeHelper('margins.large')};
`;

export const Action = styled.div`
  margin-top: ${themeHelper('margins.small')};
`;

const getStatusMessage = (assetName: string) =>
`Your account does not have permissions to publish ${assetName}. Please contact your Domino Admin.`;

const learnMoreAboutLabel = (assetName: string) =>
`Learn more about ${assetName}`;

type AssetDetails = {
  statusMessage: string
  description: string
  documentationLinkLabel: string
  documentationLink: string
}
const AssetDescriptionMap: {[key: string]: AssetDetails} = {
  'ModelAPI': {
    statusMessage: getStatusMessage('Model APIs'),
    description: 'Domino Model APIs are scalable REST APIs that \
    can create an endpoint from any function in a Python or R script. ',
    documentationLinkLabel: learnMoreAboutLabel('Model APIs'),
    documentationLink: SUPPORT_ARTICLE.PUBLISH_MODELS_OVERVIEW
  },
  'App': {
    statusMessage: getStatusMessage('Apps'),
    description: 'Domino Apps host web applications and dashboards \
    with the same elastic infrastructure that powers Jobs and Workspace sessions.',
    documentationLinkLabel: learnMoreAboutLabel('Apps'),
    documentationLink: SUPPORT_ARTICLE.APP_PUBLISH_OVERVIEW
  },
  'ScheduledJob': {
    statusMessage:  getStatusMessage('Scheduled Jobs'),
    description:  'Domino allows you to schedule Jobs in advance, \
    and set them to execute on a regular schedule. These can be \
    useful when you have a data source that is updated regularly.',
    documentationLinkLabel:  learnMoreAboutLabel('Scheduled Jobs'),
    documentationLink: SUPPORT_ARTICLE.SCHEDULED_JOBS
  },
  'ModelRegistry': {
    statusMessage: 'Your account does not have permissions to use Domino Model Registry. Please contact your Domino Admin.',
    description: 'Domino Model Registry provides a single view to your model catalog.',
    documentationLinkLabel: learnMoreAboutLabel('Model Registry'),
    documentationLink: SUPPORT_ARTICLE.PUBLISH_MODELS_OVERVIEW // TODO model registry documentation
  },
};

const FeatureDisabledPage: React.FC<FeatureDisabledProps> = (props) => {
  const { whiteLabelSettings } = useStore();
  const { assetName } = props;
  const { statusMessage, description, documentationLinkLabel, documentationLink } = AssetDescriptionMap[assetName];
  return (
    <Card
      justifyContent="flex-start"
      itemSpacing={0}
    >
      <FlexLayout alignItems="flex-start">
        <ErrorIcon>
          {<BigLock />}
        </ErrorIcon>
        <ErrorDetails>
          <ErrorTitle>{'Feature Disabled'}</ErrorTitle>
          <br/>
          <ErrorMsg>
            {replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(statusMessage)}
          </ErrorMsg>
          <ErrorDescription>
            <br/>
              {replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(description)}
            <br/>
          </ErrorDescription> 
            <HelpLink
              text={documentationLinkLabel}
              basePath={HELP_PREFIX}
              articlePath={documentationLink}
              showIcon={false}
            />
        </ErrorDetails>
      </FlexLayout>
    </Card>
  );
};

export default FeatureDisabledPage;
