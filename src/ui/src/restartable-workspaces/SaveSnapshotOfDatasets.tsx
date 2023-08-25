import * as React from 'react';
import styled from 'styled-components';
import LabelAndValue from '@domino/ui/dist/components/LabelAndValue';
import Checkbox, { CheckboxChangeEvent } from '@domino/ui/dist/components/Checkbox/Checkbox';
import { colors, fontSizes, fontWeights, themeHelper,margins } from '@domino/ui/dist/styled';

const StyledText = styled.span`
  color: ${colors.neutral900};
  margin-left: ${themeHelper('margins.tiny')};
`;
const LabelStyles = {
  fontWeight: fontWeights.MEDIUM,
  fontSize: fontSizes.SMALL,
  color: colors.neutral900,
  textTransform: 'none'
} as React.CSSProperties;

interface SaveSnapshotOfDatasetsProps {
  setSaveSnapshot?: (value: boolean) => void;
  saveSnapshot: boolean;
}

const SaveSnapshotOfDatasets = (props: SaveSnapshotOfDatasetsProps) => {
  const { setSaveSnapshot, saveSnapshot} = props;

  const handleCheckbox = (evt: CheckboxChangeEvent) => {
    const checked = evt.target.checked;
    if (setSaveSnapshot) {
      setSaveSnapshot(checked);
    }
  }

  return (
    <div data-test="save-dataset-snapshots">
      <LabelAndValue
        label="Dataset snapshot"
        labelStyles={LabelStyles}
        value={<div>
          <Checkbox checked={saveSnapshot} onChange={handleCheckbox} data-test="save-snapshot-checkbox"/>
          <StyledText>Save snapshots of datasets when the Job completes</StyledText>
        </div>}
        wrapperStyles={{marginBottom: margins.SMALL}}
      />
    </div>
  );
}

export default SaveSnapshotOfDatasets;
