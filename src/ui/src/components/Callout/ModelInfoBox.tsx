import * as React from 'react';
import { InfoBox } from '@domino/ui/dist/components/Callout/InfoBox';
import HelpLink from '../HelpLink';

const linkText = 'Read more';
const articlePath = 'user_guide/c11e1c/';
const anchorText = 'enable-custom-images-for-publishing/'

export type ModelInfoBoxProps = {
  InfoBoxText: string;
};

const ModelInfoBox: React.FC<ModelInfoBoxProps> = ({
  InfoBoxText,
}) => (

  <InfoBox className="InfoBox" fullWidth={true} alternativeIcon={true} >
    {InfoBoxText}<HelpLink text={linkText} articlePath={articlePath} anchorText={anchorText} showIcon={false} iconAfter={false} />
  </InfoBox>
);

export default ModelInfoBox;
