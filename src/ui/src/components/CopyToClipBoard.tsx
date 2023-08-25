import * as React from 'react';
import * as R from 'ramda';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { CopyOutlined } from '@ant-design/icons';
import copyToClipboard from 'copy-to-clipboard';
import styled from 'styled-components';
import Button from './Button/Button';
import { themeHelper } from '../styled/themeUtils';
import { borderTableGrey, boulder, iconGrey, } from '../styled/colors';

export type CopyIconPosition = 'topRight';

export type CopyToClipBoardProps = {
  text: string;
  visibleNode?: React.ReactNode;
  copyIconPosition?: CopyIconPosition;
  apiFetch?: () => Promise<string>;
  dataTest?: string;
  tooltip?: string;
  placement?: TooltipPlacement;
};

export type CopyToClipBoardState = {
  text?: string;
  copiedText?: string;
};
interface WrapperProps {
  renderVertical: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: ${({renderVertical}) => renderVertical ? 'column' : 'row'};
  width: 100%;
  align-items: center;
  .text-container {
    max-width: ${({renderVertical}) => renderVertical ? '100%' : '97%'};
    white-space: nowrap;
    overflow: hidden;
    height: 40px;
    color: ${iconGrey};
    padding: ${themeHelper('margins.tiny')};
    border-radius: ${themeHelper('borderRadius.standard')};
    border: 1px solid ${borderTableGrey};
  }
  .text-container:hover{
    overflow-x: auto;
  }
  .ant-btn:after {
    border: none;
  }
  .ant-tooltip-arrow {
    display: none;
  }
`;

const ElementsRight = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

class CopyToClipBoard extends React.Component<CopyToClipBoardProps, CopyToClipBoardState> {

  state = {
    text: '',
    copiedText: '',
  };

  componentDidMount() {
    this.setState({
      text: this.props.text,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<CopyToClipBoardProps>): void {
    if (nextProps.text !== this.props.text) {
      this.setState({
        text: nextProps.text,
      });
    }
  }

  copyToClipboard = async () => {
    let copiedText = this.state.text;
    if (!copiedText && this.props.apiFetch) {
      copiedText = await this.props.apiFetch();
    }
    this.setState({
      copiedText,
    });
    copyToClipboard(copiedText);
  }

  getCopyIcon = (placement?: TooltipPlacement) => {
    const tooltipText = this.state.copiedText && R.equals(this.state.copiedText, this.state.text) ?
      'Copied!' :
      this.props.tooltip ?? 'Copy code';
    return (
      <Button
        tooltipContent={tooltipText}
        placement={placement}
        icon={<CopyOutlined style={{color: boulder}}/>}
        isIconOnlyButton={true}
        iconOnlyButtonColor={boulder}
        btnType="link"
        onClick={this.copyToClipboard}
      />
    );
  }

  render() {
    return (
      <Wrapper renderVertical={R.equals(this.props.copyIconPosition, 'topRight')}>
        {
          R.equals(this.props.copyIconPosition, 'topRight') &&
          <ElementsRight>
            {this.getCopyIcon(this.props.placement)}
          </ElementsRight>
        }
        <div
          className="text-container"
        >
          {this.props.visibleNode || this.state.text}
        </div>
        {
          R.isNil(this.props.copyIconPosition) &&
          this.getCopyIcon(this.props.placement)
        }
      </Wrapper>
    );
  }
}

export default CopyToClipBoard;
