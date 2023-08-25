import * as React from 'react';
import styled from 'styled-components';
import Clamp from 'react-multiline-clamp';
import * as colors from '@domino/ui/dist/styled/colors';
import InvisibleButton from '@domino/ui/dist/components/InvisibleButton';

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
    color: ${colors.basicLink};
  }
`;
interface MultiLineTextProps {
  lines: number;
  maxLines?: number;
  text: string;
  showMoreText: string;
  showLessText: string;
}

const MultiLineText: React.FC<MultiLineTextProps> = (props) => {
  const { lines, maxLines = 8, text, showMoreText, showLessText } = props;

  return(
    <Clamp
      lines={lines}
      withToggle={true}
      maxLines={maxLines}
      // @ts-ignore
      showMoreElement={({ toggle }) => (
        <StyledInvisibleButton type="button" onClick={toggle}>
            {showMoreText}
        </StyledInvisibleButton>
      )}
      // @ts-ignore
      showLessElement={({ toggle }) => (
        <StyledInvisibleButton type="button" onClick={toggle}>
            {showLessText}
        </StyledInvisibleButton>
      )}
    >
      {text}
    </Clamp> 
  );
};

export default MultiLineText;
