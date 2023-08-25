import * as React from 'react';
import 'jest-styled-components';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import TrimText from '../TrimText';

describe('TrimText component', () => {
  it('Render without Show options when text provided is less than the size', () => {
    const view = render(
      <TrimText
        size={40}
        text={'This is a small length text'}
        showLessText="See Less"
        showMoreText="See More"
      />
    );
    expect(view.container.getElementsByClassName('showOptions').length).toEqual(0);    
  });
  it('Render with Show options when text provided is more than the size', () => {
    const view = render(
      <TrimText
        size={10}
        text={'This is a small length text'}
        showLessText="See Less"
        showMoreText="See More"
      />
    );
    expect(view.container.getElementsByClassName('showOptions').length).toBeGreaterThan(0);    
  });
  it('Check both the show options', async () => {
    const showLessText = 'See Less';
    const showMoreText = 'See More';
    render(
      <TrimText
        size={10}
        text={'This is a small length text'}
        showLessText={showLessText}
        showMoreText={showMoreText}
      />
    );
    expect(screen.getByText(showMoreText)).toBeTruthy();
    await userEvent.click(screen.getByText(showMoreText));
    expect(screen.getByText(showLessText)).toBeTruthy();
  });
});
