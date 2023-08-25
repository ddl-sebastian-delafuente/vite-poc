import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import Accordion from '../Accordion';

describe('Accordion component tests', () => {
  const dataTest = 'accordian';
  const defaultProps = { isCollapsed: true, title: 'Accordion Collapsed', isShowMore: true, dataTest };
  enum Children { 
    COLLAPSED = 'I am by default Accordion Collapsed',
    EXPANDED = 'I am by default Accordion Expanded'
  }

  it('should render successfully for Collapsed Accordion', () => {
    const { getByDominoTestId, queryByText } = render(<Accordion {...defaultProps}>{Children.COLLAPSED}</Accordion>);
    expect(getByDominoTestId(dataTest)).toBeTruthy();
    expect(queryByText(Children.COLLAPSED)).toBeFalsy();
  });

  it('should render successfully for Expanded Accordion', () => {
    const props = { ...defaultProps, title: 'Accordion Expanded', isCollapsed: false };
    const { getByDominoTestId, getByText } = render(<Accordion {...props}>{Children.EXPANDED}</Accordion>);
    expect(getByDominoTestId(dataTest)).toBeTruthy();
    expect(getByText(Children.EXPANDED)).toBeTruthy();
  });

  test('click action for accordion collapsed', async () => {
    const { getByDominoTestId, getByText } = render(<Accordion {...defaultProps}>{Children.COLLAPSED}</Accordion>);
    const linkElement = getByDominoTestId(dataTest);
    await userEvent.click(linkElement);
    const accordionElement = getByText(Children.COLLAPSED).parentElement as HTMLDivElement;
    expect(accordionElement.getAttribute('class')).toContain('content-active');
    expect(accordionElement.getAttribute('class')).not.toContain('content-inactive');
    await userEvent.click(linkElement);
    expect(accordionElement.getAttribute('class')).not.toContain('content-active');
    expect(accordionElement.getAttribute('class')).toContain('content-inactive');
  });

  test('click action for accordion expanded', async () => {
    const props = { ...defaultProps, title: 'Accordion Expanded', isCollapsed: false };
    const { getByDominoTestId, getByText } = render(<Accordion {...props}>{Children.EXPANDED}</Accordion>);
    const linkElement = getByDominoTestId(dataTest);
    await userEvent.click(linkElement);
    const accordionElement = getByText(Children.EXPANDED).parentElement as HTMLDivElement;
    expect(accordionElement.getAttribute('class')).not.toContain('content-active');
    expect(accordionElement.getAttribute('class')).toContain('content-inactive');
    await userEvent.click(linkElement);
    expect(accordionElement.getAttribute('class')).toContain('content-active');
    expect(accordionElement.getAttribute('class')).not.toContain('content-inactive');
  });
});
