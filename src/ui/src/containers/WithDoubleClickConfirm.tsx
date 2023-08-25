import * as React from 'react';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { Popover } from '../components';

const handleGetPopupContainer = (container?: HTMLElement | null) => () => container || document.body;

const getBaseState = (props: Props): State => ({
  clicked: props.clicked || false,
  label: props.clicked ? props.confirmLabel : props.submitLabel,
});

export type DefaultProps = {
  shouldConfirm?: () => boolean;
  shouldResetState?: () => boolean;
};

export type Props = {
  container?: HTMLElement | null;
  overlayStyle?: React.CSSProperties;
  clicked?: boolean;
  submitLabel: string;
  confirmLabel: string;
  confirmTitle?: string;
  confirmPlacement?: TooltipPlacement;
  confirmMessage: JSX.Element | string;
  onClick?: (event: any) => void;
  children: React.ReactElement<{ onClick?: (event: any) => void; children?: any }>;
} & DefaultProps;

export type State = { clicked: boolean; label: string; };

class WithDoubleClickConfirm extends React.PureComponent<Props, State, any> {
  static defaultProps: DefaultProps = {
    shouldConfirm: () => true,
    shouldResetState: () => false,
  };

  constructor(props: Props) {
    super(props);
    this.state = getBaseState(props);
  }

  UNSAFE_componentWillUpdate(newProps: Props) {
    const { shouldResetState } = newProps;
    if (shouldResetState!()) {
      this.setState(getBaseState(newProps));
    }
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      shouldConfirm,
      onClick,
      confirmLabel,
    } = this.props;
    const { clicked } = this.state;
    if (onClick) {
      if (!clicked && shouldConfirm!()) {
        this.setState({ clicked: true, label: confirmLabel });
      } else {
        onClick(event);
        this.resetToCurrentBaseState();
      }
    }
  }

  handleVisibleChange = (visible: boolean) => {
    if (!visible) {
      this.resetToCurrentBaseState();
    }
  }

  resetToCurrentBaseState = () => this.setState(getBaseState(this.props));

  render() {
    const {
      container,
      overlayStyle,
      confirmTitle,
      confirmPlacement,
      confirmMessage,
      shouldConfirm,
      children,
    } = this.props;
    const { label } = this.state;
    const child = React.cloneElement(
      children,
      { onClick: this.handleClick },
      label,
    );
    if (shouldConfirm!()) {
      return (
        <Popover
          getPopupContainer={handleGetPopupContainer(container)}
          onVisibleChange={this.handleVisibleChange}
          placement={confirmPlacement}
          content={confirmMessage}
          title={confirmTitle}
          overlayStyle={overlayStyle}
          trigger="click"
        >
          {child}
        </Popover>
      );
    }
    return child;
  }
}

export default WithDoubleClickConfirm;
