import * as React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import * as colors from '@domino/ui/dist/styled/colors';
import NotificationList from '../src/notification-list/NotificationList';
import NotificationListItem from '../src/notification-list/NotificationListItem';
import HelpLink from '../src/components/HelpLink';
import { SUPPORT_ARTICLE } from '../src/core/supportUtil';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const EmphasisText = styled.b`
  color: ${colors.headerGrey};
`;

storiesOf(getDevStoryPath('Components'), module)
  .add('NotificationList', () => {
    const notificationDescriptors = [
      {
        MessageSection: <span>Have a script named
          <EmphasisText> app.sh </EmphasisText>
          in your project's root directory.</span>,
        CTA: {
          type: "link",
          element:  <HelpLink
            text="Learn more"
            articlePath={SUPPORT_ARTICLE.APP_PUBLISH_OVERVIEW}
            showIcon={false}
          />
        }
      },
      {
        MessageSection: <span>Domino hosted apps
          <EmphasisText> block cross-origin </EmphasisText>
          (AJAX) requests, cookies, local storage by default.</span>,
        CTA: {
          type: "link",
          element: <HelpLink
            text={'Learn more'}
            articlePath={SUPPORT_ARTICLE.APP_PUBLISH_CORS}
            showIcon={false}
          />
        }
      },
      {
        MessageSection: <span>Domino hosted apps
          <EmphasisText>Advanced security has been enabled for Apps.</EmphasisText>
          This can disrupt your applications.</span>,
        CTA: {
          type: "link",
          element: <HelpLink
            text={'Learn more'}
            articlePath={SUPPORT_ARTICLE.APP_PUBLISH_CSP}
            showIcon={false}
          />
        }
      },
    ]
    return (
      <NotificationList header={"Test header"}>
        {notificationDescriptors.map(
          (notificationDescriptor: any, index: number)=><NotificationListItem key={index} {...notificationDescriptor} />
          )
        }
      </NotificationList>
    );
  })
