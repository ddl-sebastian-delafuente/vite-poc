import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import AutoScaleWorker from '../components/AutoScaleWorker';

const defaultProps = {
  workerLabel: 'worker',
  limit: 25,
  onMinWorkerCountChange: jest.fn(),
  onMaxWorkerCountChange: jest.fn()
};

describe('AutoScaleWorker component', () => {
  it('should display the supplied worker label', () => {
    const workerLabel = 'executor';
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
        workerLabel={workerLabel}
      />
    );
    expect(view.getByDominoTestId('worker-sizeLimit').textContent).toMatch(workerLabel);
    expect(view.getByDominoTestId('enable-worker-autoscale-checkbox-label').textContent).toMatch(workerLabel);
    expect(view.getByDominoTestId('worker-minSize-form-control').textContent).toMatch(workerLabel);
    expect(view.getByDominoTestId('worker-maxSize-form-control').textContent).toMatch(workerLabel);
  });

  it('should display worker size limit when supplied in props', () => {
    const workerSizeLimit = 20;
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
        limit={workerSizeLimit}
      />
    );
    expect(view.getByDominoTestId('worker-sizeLimit').textContent).toMatch(`${workerSizeLimit}`);
  });

  it('should display the min worker size value on mount when supplied in props', () => {
    const workerMinSize = 1;
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
        minWorkerCount={workerMinSize}
      />
    );
    expect(view.getByDominoTestId('worker-minSize').getAttribute('value')).toEqual(`${workerMinSize}`);
  });

  it('should display the max worker size value on mount when supplied in props', () => {
    const workerMaxSize = 5;
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
        minWorkerCount={workerMaxSize}
      />
    );
    expect(view.getByDominoTestId('worker-minSize').getAttribute('value')).toEqual(`${workerMaxSize}`);
  });

  it('should enable the worker max size input when the checkbox beside to it is checked', async () => {
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
      />
    );
    expect(view.getByDominoTestId('worker-maxSize').hasAttribute('disabled')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('enable-worker-autoscale'))
    expect(view.getByDominoTestId('worker-maxSize').hasAttribute('disabled')).toBeFalsy();
  });

  it('should display a tooltip on hovering over the enable autoscale checkbox label', async () => {
    const workerLabel = 'executor';
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
        workerLabel={workerLabel}
      />
    );
    userEvent.hover(view.getByDominoTestId('enable-worker-autoscale-checkbox-label'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent)
        .toEqual(`${workerLabel} will be automatically scaled up to the max ${workerLabel}s you set.`);
  });

  it('should display a tooltip on hovering over the worker max size input element', async () => {
    const workerLabel = 'executor';
    const view = render(
      <AutoScaleWorker
        {...defaultProps}
        workerLabel={workerLabel}
      />
    );
    userEvent.hover(view.getByDominoTestId('worker-maxSize-wrapper'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent)
        .toEqual(`Used for auto-scaling ${workerLabel}s`);
  });
});
