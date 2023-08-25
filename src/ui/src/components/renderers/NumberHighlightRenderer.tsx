import * as React from 'react';
import styled from 'styled-components';
import { bluishPurple } from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';

const NumberHighlighter = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${bluishPurple};
  letter-spacing: 0.3px;
  color: white;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const NumberHighlighterValue = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const NumberHightlightRenderer = (value: Array<any>) => {
  return (
    <NumberHighlighter>
      <NumberHighlighterValue>{value.length}</NumberHighlighterValue>
    </NumberHighlighter>
  );
};

export default NumberHightlightRenderer;
