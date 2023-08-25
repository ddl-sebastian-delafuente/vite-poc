import * as React from 'react';

export interface TimerProps {
  renderBody: any;
  interval?: number;
  canTick: () => boolean;
}

export interface TimerState {
  seconds: number;
}

class Timer extends React.Component<TimerProps, TimerState> {

  public static defaultProps = {
    interval: 1000,
  };

  private intervalFn: any;

  constructor(props: TimerProps) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    if (this.props.canTick()) {
      this.startTick();
    } else {
      this.stopTick();
    }
  }

  startTick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
  }

  stopTick() {
    clearInterval(this.intervalFn);

  }

  componentDidMount() {
    this.intervalFn = setInterval(() => this.tick(), this.props.interval);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<TimerProps>, nextContext: any): void {
    this.tick();
  }

  componentWillUnmount() {
    this.stopTick();
  }

  render() {
    if (typeof this.props.renderBody === 'function') {
      return this.props.renderBody();
    } return this.props.renderBody;
  }
}

export default Timer;
