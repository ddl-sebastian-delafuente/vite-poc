import * as React from 'react';
import * as ReactDOM from 'react-dom';

const leadServicesSrc =
  '//www.googleadservices.com/pagead/conversion/968135014/?label=HtUWCKKJpQsQ5qLSzQM&amp;guid=ON&amp;script=0';

const elt = (eltName: string, attributes: any) => {
  const element =  document.createElement(eltName);
  attributes.forEach((attributePair: [string, any]) => {
    element.setAttribute(attributePair[0], attributePair[1]);
  });
  return element;
};

export type Props = {
  username: string;
  isDominoHosted: boolean;
};

export type State = {
  mountPoint?: HTMLElement;
};

export default class AddConversionTracking extends React.PureComponent<Props, State> {
  state = { mountPoint: undefined };

  twitterScript: HTMLElement =
    elt('script', [['src', '//platform.twitter.com/oct.js'], ['type', 'text/javascript']]);

  leadServicesScript: HTMLElement =
    elt('script', [['type', 'text/javascript'], ['src', '//www.googleadservices.com/pagead/conversion.js']]);

  componentDidMount() {
    if (this.shouldExecute()) {
      this.twitterScript.addEventListener('load', this.addTwitterTracking);
      this.leadServicesScript.addEventListener('load', this.addGoogleTracking);

      const adConversionTrackingContainer = document.createElement('div');
      adConversionTrackingContainer.appendChild(this.twitterScript);
      adConversionTrackingContainer.appendChild(this.leadServicesScript);
      document.body.appendChild(adConversionTrackingContainer);

      const mountPoint = document.createElement('div');
      document.body.appendChild(mountPoint);
      this.setState({ mountPoint });
    }
  }

  addTwitterTracking = () => {
      // @ts-ignore
      if (window.twttr) {
        // @ts-ignore
        window.twttr.conversion.trackPid('l489y');
      }
  }

  addGoogleTracking = () => {
      // @ts-ignore
      if (window.ga) {
        // @ts-ignore
        window.ga('send', 'event', 'Account', 'Signup', this.props.username);
      }
  }

  componentWillUnmount() {
    if (this.shouldExecute()) {
      this.twitterScript.removeEventListener('load', this.addTwitterTracking);
      this.leadServicesScript.removeEventListener('load', this.addGoogleTracking);
    }
  }

  shouldExecute = () => this.props.isDominoHosted;

  render(): React.ReactPortal | null {
    const { mountPoint } = this.state;
    if (this.shouldExecute() && mountPoint) {
      return ReactDOM.createPortal(
        <>
          <img
            height="1"
            width="1"
            style={{ borderStyle: 'none' }}
            alt=""
            src={leadServicesSrc}
          />
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://analytics.twitter.com/i/adsct?txn_id=l489y&p_id=Twitter"
          />
        </>,
        mountPoint ? mountPoint! : document.createElement('div')
      );
    }
    return null;
  }
}
