import * as React from 'react';
import * as R from 'ramda';

const NEW_RELIC_ERROR = 'js-agent.newrelic.com';

interface State {
  error: Error | null | undefined | string;
}

declare global {
  interface Window {
    onunhandledrejection: null | ((event: PromiseRejectionEvent) => void);
  }
}

export class ErrorBoundary extends React.Component<{children?: React.ReactNode}, State> {
  state: State = {
    error: undefined,
  };
  constructor(props: any) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    // Catch all the unhandledRejections in the app, where the caller didn't care about the promise error
    // If the promises are caught by the caller itself, then this won't be invoked
    window.addEventListener('unhandledrejection', this.handlePromiseRejectionError);
    // This is for firefox because we are explictly handling this with a polyfill until firefox
    // supports this natively
    window.onunhandledrejection = this.handlePromiseRejectionError;
  }

  componentWillUnmount() {
    // Remove all attached events on unmount
    window.removeEventListener('unhandledrejection', this.handlePromiseRejectionError);
    window.onunhandledrejection = null;
  }

  handlePromiseRejectionError = (event: PromiseRejectionEvent) => {
    this.setState({ error: event.reason });
  }

  componentDidCatch(error: Error | null) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error
    });
  }

  render() {
    if (this.state.error) {
      const errorMsg = this.state.error.toString();

      // errors to be ignored
      // @ts-ignore
      if (this.state.error.stack && R.contains(NEW_RELIC_ERROR, this.state.error.stack) ||
        R.contains(NEW_RELIC_ERROR, errorMsg) ||
        /**
         * This ignores an intermittent error that throws from Ant table when dealt with large amounts of data.
         *
         * https://dominodatalab.atlassian.net/browse/DOM-47786
         */
        R.contains(`reading 'parentElement'`, errorMsg)) {
        return this.props.children;
      }

      // try to recover from the error, Loading chunk failed
      if (/Loading chunk [\d]+ failed/.test(errorMsg)) {
        console.error(`reload to recover from the error: ${errorMsg}`);
        const lastReloadTime = localStorage.getItem('reload-to-recover-time');
        if (!lastReloadTime || Date.now() - Number(lastReloadTime) > 300000) { // 5 minutes
          localStorage.setItem('reload-to-recover-time', String(Date.now()));
          window.location.reload();
          return;
        }
      }

      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && errorMsg}
          </details>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}
