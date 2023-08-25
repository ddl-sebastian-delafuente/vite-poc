import * as React from 'react';
import styled from 'styled-components';
import { InfoCircleOutlined } from '@ant-design/icons';
import FlexLayout from './Layouts/FlexLayout';
import Error401 from '../icons/Error401';
import Error403 from '../icons/Error403';
import Error404 from '../icons/Error404';
import Error500 from '../icons/Error500';
import Link from './Link/Link';
import { btnGrey } from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import Button from './Button/Button';
import { Card } from './Layouts/AppContent';
import { projectRoutes } from '../navbar/routes';
import tooltipRenderer from './renderers/TooltipRenderer';

export interface ErrorProps {
  /**
   * The HTTP status code, defaults to 500
   */
  status?: number;
  /**
   * A short description of the error, e.g., "Not Found" in case of status 404
   */
  statusMessage?: string;
  /**
   * The email address to contact support
   */
  contactEmail?: string;

  children?: React.ReactNode;
}

const getEmailLink = (email: string) => `mailto:${email}`;

const refresh = () => window.location.reload();

const reloadAction = () => (
  <Button btnType="secondary" onClick={refresh}>Reload</Button>
);

const ErrorMap = {
  '400': {
    icon: <Error500 />,
    statusMessage: 'Bad Request',
    desc: () => 'Looks like this request may have been malformed.',
    action: () => null
  },
  '401': {
    icon: <Error401 />,
    statusMessage: 'Unauthorized User',
    desc: () => 'You need to log in to view this page.',
    action: () => (
      <Button type="primary" href="/login">
        Login
      </Button>
    )
  },
  '403': {
    icon: <Error403 />,
    statusMessage: 'Access Forbidden!',
    desc: () => 'You don\'t have the right permissions to view this page. To view this page, ask your admin or project owner to grant you permission.',
    action: () => <Link onClick={() => window.history.back()} type="backward-link">Go Back</Link>
  },
  '404': {
    icon: <Error404 />,
    statusMessage: 'URL Not Found',
    desc: () => (
      <>
        The requested URL was not found on this server.
      </>
    ),
    action: () => <Link href={projectRoutes.path()} type="forward-link">Go to Projects</Link>
  },
  '500': {
    icon: <Error500 />,
    statusMessage: 'Internal Server Error',
    desc: (props: ErrorProps) => (
      <>
        It's not you, it's us. If this error continues to happen, please contact <Link href={getEmailLink(props.contactEmail || '')}>Support</Link> so we can help out!
      </>
    ),
    action: reloadAction
  },
  '502': {
    icon: <Error500 />,
    statusMessage: 'Communication Breakdown',
    desc: () => 'We\'re having trouble connecting. Try reloading the page.',
    action: reloadAction
  }
};

const ErrorIcon = styled.div`
  margin: 68px;
  padding: 22px 57px 87px;
  border-right: 1px solid ${btnGrey};
`;

const ErrorCode = styled.h1`
  font-size: ${themeHelper('errorPage.status.fontSize')};
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${btnGrey};
  margin-bottom: 0;
`;

const ErrorMsg = styled.h5`
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.bold')};
  color: ${btnGrey};
`;

const ErrorDetails = styled.div`
  margin-top: ${themeHelper('margins.large')};
`;

export const Action = styled.div`
  margin-top: ${themeHelper('margins.small')};
`;

export const Exclamation = styled.div`
  font-size: ${themeHelper('fontSizes.large')};
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const Help = styled.div`
  position: relative;
`;

const ErrorPage: React.FC<ErrorProps> = (props) => {
  const { status } = props;
  const error = ErrorMap[`${status}`] || ErrorMap['500'];
  const { icon, statusMessage, desc, action } = error;
  return (
    <Card
      justifyContent="flex-start"
      itemSpacing={0}
    >
      <FlexLayout alignItems="flex-start" flexWrap="nowrap">
        <ErrorIcon>
          {icon}
        </ErrorIcon>
        <ErrorDetails>
          <ErrorCode>{status}</ErrorCode>
            <ErrorMsg>
              <FlexLayout justifyContent="flex-start" alignItems="baseline">
                <span>{statusMessage}</span>
                {props.statusMessage &&
                tooltipRenderer(props.statusMessage,
                  <Help>
                    <InfoCircleOutlined style={{ fontSize: '20px' }} />
                  </Help>)
                }
              </FlexLayout>
            </ErrorMsg>
          <Exclamation>Oops!</Exclamation>
          <p>
            {desc(props)}
          </p>
          <Action>
            {action(props)}
          </Action>
        </ErrorDetails>
      </FlexLayout>
    </Card>
  );
};

export default ErrorPage;
