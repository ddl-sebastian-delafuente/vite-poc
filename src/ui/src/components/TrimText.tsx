import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import * as colors from '@domino/ui/dist/styled/colors';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';

const ActionText = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
  color: ${colors.basicLink};
  cursor: pointer;
`;
const StyledText = styled.span`
  word-break: break-word;
`;

const ellipsis = '...';

interface TrimTextProps {
  size: number;
  text: string;
  showMoreText: string;
  showLessText: string;
}

interface TrimTextState {
  showMoreViewEnabled: boolean;
}

class TrimText extends React.Component<TrimTextProps, TrimTextState> {
  constructor (props: TrimTextProps) {
    super(props);
    this.state = {
      showMoreViewEnabled: false
    };
  }

  render () {
    const { size, text, showMoreText, showLessText } = this.props;

    return (
      <>
        {
          (text && text.length >= size) ?
            (
              this.state.showMoreViewEnabled ?
              <StyledText>
                {text}
                <ActionText
                  className="showOptions"
                  onClick={() => this.setState({ showMoreViewEnabled: false })}
                >{showLessText}
                </ActionText>
              </StyledText> :
              <StyledText>
                {R.join('', [R.take(size, text), ellipsis])}
                <ActionText
                  className="showOptions"
                  onClick={() => this.setState({ showMoreViewEnabled: true })}
                >{showMoreText}
                </ActionText>
              </StyledText>
            ) : text
        }
      </>
    );
  }
}

export default TrimText;
