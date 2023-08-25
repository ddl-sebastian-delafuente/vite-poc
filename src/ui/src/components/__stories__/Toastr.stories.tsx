import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '@domino/ui/dist/utils/storybookUtil';
import * as toastr from '../toastr';

const DetailsWrapper = styled.div`
  margin: 30px;
  padding: 32px;
`;

storiesOf(getDevStoryPath('Components/Toastr Notifications'), module)
  .add('Default - no description text', () => (
    <DetailsWrapper>
      <Button onClick={() => toastr.success('Success - all went great!!')}>Success</Button>
      <Button onClick={() => toastr.warning('Warning dude! Proceed with care..')}>Warning</Button>
      <Button onClick={() => toastr.error('OK! You blew it!')}>Error</Button>
    </DetailsWrapper>
  ))
  .add('With description', () => (
    <DetailsWrapper>
      <Button onClick={() => toastr.success('Success - all went great!!', 'You are so goood')}>Success</Button>
      <Button
        onClick={() => toastr.warning('Warning dude! Proceed with care..',
        'Basically you should not move on')}
      >
        Warning
      </Button>
      <Button onClick={() => toastr.error('OK! You blew it!', `That's it, you're out!`)}>Error</Button>
    </DetailsWrapper>
  ));
