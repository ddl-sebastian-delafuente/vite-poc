import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import EmptyMessage from '../EmptyMessage';

describe('EmptyMessage component tests', () => {

  const message = "No data found";

  it('should render successfully', () => {
    const { getByText, baseElement} = render(
      <EmptyMessage
        className="empty-msg"
        message={message} />
    );
   expect(getByText(message)).toBeTruthy();
   expect(baseElement.querySelectorAll('.empty-msg').length).toBeGreaterThan(0);
  });
});
