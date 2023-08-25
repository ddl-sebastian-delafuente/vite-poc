import * as React from 'react';
import { render, screen, fireEvent } from '@domino/test-utils/dist/testing-library';
import tooltipRenderer from '../renderers/TooltipRenderer';

describe('Tooltip Renderer', () => {
  it('Tooltip is visible when mouse enter', () => {
    const view = render(
      tooltipRenderer(
        'Tooltip Label',
        (
          <div className="tooltip-content">
            Tooltip content
          </div>),
        'top',
        0,  // mouseEnterDelay - Value when set greater than 0, tests aren't getting the updated dom.
            // Even tried with timeouts & faketimers
        0   // mouseLeaveDelay - Value when set greater than 0, tests aren't getting the updated dom.
            // Even tried with timeouts & faketimers
      )
    );

    fireEvent.mouseOver(screen.getByText('Tooltip content'));
    expect(screen.getByText('Tooltip Label')).toBeTruthy();

    view.unmount();
  });

  it('Tooltip is not visible when mouse leave', () => {
    const view = render(
      tooltipRenderer(
        'Tooltip Label',
        (
          <div className="tooltip-content">
            Tooltip content
          </div>),
        'top',
        0,  // mouseEnterDelay - Value when set greater than 0, tests aren't getting the updated dom.
            // Even tried with timeouts & faketimers
        0   // mouseLeaveDelay - Value when set greater than 0, tests aren't getting the updated dom.
            // Even tried with timeouts & faketimers
      )
    );

    fireEvent.mouseLeave(screen.getByText('Tooltip content'));
    expect(screen.queryByText('Tooltip Label')).toBeFalsy();

    view.unmount();
  });
});
