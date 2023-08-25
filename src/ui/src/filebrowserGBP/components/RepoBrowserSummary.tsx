import * as React from 'react';
import { Row, Col } from 'antd';
import LabelAndValue from '../../components/LabelAndValue';
import GitBranchPicker from './GitBranchPicker';
import GitCommitPicker from './GitCommitPicker';
import {
  DominoProjectsApiRepositoriesResponsesBrowseRepoBrowserSummaryDto as BrowseSummaryDto 
} from '@domino/api/dist/types';
import { Repository } from '../types/filebrowserTypes';
import { useCodeNavigationContext } from './CodeNavigationContext';
import { trimExtraLines } from '../utils';

export type RepoBrowserSummaryProps = {
  repository: Repository;
  summaryDetails?: BrowseSummaryDto;
  style?: React.CSSProperties;
};

const labelStyles: React.CSSProperties = {marginBottom: '4px'};
const pickerColumnStyle: React.CSSProperties = {minWidth: '400px'};

const RepoBrowserSummary: React.FC<RepoBrowserSummaryProps> = ({repository, summaryDetails, style}) => {
  const { branch: navigationBranch } = useCodeNavigationContext();

  if (typeof summaryDetails === 'undefined') {
    return <></>;
  }

  const ref = summaryDetails.ref;
  const branchName = ref && ref.branchName ? summaryDetails.ref.branchName : navigationBranch!;
  const commitMessage = summaryDetails.ref ? (summaryDetails.ref as any).commit.message : '';
  const selectedCommit = summaryDetails.ref.commit;
  const commonPickerProps = {repository, style};
  return (
    <>
      <Row>
        <LabelAndValue
          label={'BRANCH'}
          labelStyles={labelStyles}
          value={<GitBranchPicker {...commonPickerProps} currentBranchName={branchName}/>}
        />
      </Row>
      <Row style={{display: 'flex'}}>
        <Col style={pickerColumnStyle}>
          <LabelAndValue
            label={'COMMIT'}
            labelStyles={labelStyles}
            // @ts-ignore
            value={<GitCommitPicker {...commonPickerProps} branchName={branchName} selected={selectedCommit}/>}
            wrapperStyles={{marginBottom: 0}}
          />
        </Col>
        <Col style={pickerColumnStyle}>
          <LabelAndValue
            label={'COMMIT MSG'}
            labelStyles={labelStyles}
            value={(
              <div className="blur-on-fetch" style={{lineHeight: '32px'}} title={commitMessage}>
                {trimExtraLines(commitMessage)}
              </div>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
RepoBrowserSummary.displayName = 'RepoBrowserSummary';

export default RepoBrowserSummary;
