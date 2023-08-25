import * as React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';
import { FlexLayoutProps, FlexLayout } from './Layouts/FlexLayout';
import { themeHelper } from '../styled/themeUtils';

const ButtonGroup = Button.Group;

const StyledSeparatedContainer = styled(FlexLayout)<ToolbarProps>`
  display: inline-flex;

  > div > button.ant-btn {
    &:last-child {
      padding-right: 0px;
    }
    &:first-child {
      padding-left: 0px;
    }
  }
  > span > button.ant-btn {
    &:last-child {
      padding-right: 0px;
    }
    &:first-child {
      padding-left: 0px;
    }
  }
`;

const SeparatedContainer = ({ side, ...props }: ToolbarProps) => (
  <StyledSeparatedContainer
    flexDirection="unset"
    justifyContent={side === 'left' ? 'flex-start' : 'flex-end'}
    flexWrap="unset"
    {...props}
  />
);

export interface ToolbarProps extends FlexLayoutProps {
  /**
   * When you want the toolbar to go left or right, optional. Defaults to right.
   */

  side?: 'left' | 'right';

  /**
   * Optional className, which goes on the container.
   */
  className?: string;

  /**
   * The buttons that you want to format as a toolbar. Works best with buttons in the component library as well as
   * ModalWithButton.
   */
  children: React.ReactNode;

  /**
   * Optional key used for selenium testing.
   */
  'data-test'?: string;
}

interface BaseToolbarProps extends ToolbarProps {

  /**
   * The wrapper component, which wraps the buttons to be turned into a toolbar.
   */
  Container: React.FunctionComponent<ToolbarProps>;
}

interface RowProps {
  side?: ToolbarProps['side'];
}
// this border radius styling makes it so tha we can use
// ModalWithButton in the Toolbar as a child element
const Row = styled(ButtonGroup)<RowProps>`
  &.domino-toolbar {
    display: inline-flex;
    justify-content: ${props => props.side === 'left' ? 'flex-start' : 'flex-end'};
    .ant-btn, .domino-button  {
      border-radius: 0px;
    }
  }

  > div, > span {
    &:first-child {
      .ant-btn, .domino-button  {
        border-radius: ${themeHelper('borderRadius.left')};
      }
    }
  }

  > div, > span {
    &:last-child {
      .ant-btn, .domino-button {
        border-radius: ${themeHelper('borderRadius.right')};
      }
    }
  }
`;

const RowComponent = (props: ToolbarProps) => <Row {...props} />;

const Toolbar = ({ children, className, Container, ...rest }: BaseToolbarProps) => (
  <Container className={classNames('domino-toolbar', className)} data-test={rest['data-test']} {...rest}>
    {children}
  </Container>
);

export const DefaultToolbar = (props: ToolbarProps) =>
  <Toolbar {...props} Container={RowComponent} />;

export const SeparatedToolbar = (props: ToolbarProps) =>
  <Toolbar {...props} Container={SeparatedContainer} />;

export default DefaultToolbar;
