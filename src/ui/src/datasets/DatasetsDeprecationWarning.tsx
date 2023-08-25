import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import WarningBox from '@domino/ui/dist/components/WarningBox';
import Button from '../components/Button/Button';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import HelpLink from '../components/HelpLink';
import {
  getLocalStorageItem,
  LocalStorageItemKey,
  setLocalStorageItem
} from '../utils/localStorageService';

const InfoText = styled.div`
  margin-bottom: 6px;
`;

export type DatasetsDeprecationWarningProps = {
  onChangeUserChoice: (value?: boolean) => void;
};

export const DatasetsDeprecationWarning: React.FC<DatasetsDeprecationWarningProps> = (props) => {
  const [isWarningVisible, setWarningVisibility] = useState<boolean>(true);

  const onChangeUserChoice = (value: boolean) => {
    setLocalStorageItem(LocalStorageItemKey.HideReadWriteDatasetsDeprecationWarning, value);
  };

  return (
    <>
    {
      (!getLocalStorageItem(LocalStorageItemKey.HideReadWriteDatasetsDeprecationWarning) || getLocalStorageItem(LocalStorageItemKey.HideReadWriteDatasetsDeprecationWarning) === 'false') && isWarningVisible && (
        <WarningBox className={'deprecation-warning'}>
          <InfoText>
          {'"domino.yaml" has been deprecated. '}
            <HelpLink
              text={`Read this article`}
              articlePath={SUPPORT_ARTICLE.READ_WRITE_DATASETS}
              showIcon={false}
              anchorText="#deprecating-scratch-spaces"
            />
          {' to understand how to use Read/Write Datasets and older snapshots without domino.yaml.'}
          </InfoText>
          <Button
            defaultValue="Dismiss"
            style={undefined}
            className="dismiss-button"
            testId="dismiss-button"
            btnType="secondary"
            onClick={() => {
              props.onChangeUserChoice();
              onChangeUserChoice(true);
              setWarningVisibility(false);
            }}
          >
            Dismiss
          </Button>
        </WarningBox>
      )
    }
    </>
  );
};

export default DatasetsDeprecationWarning;
