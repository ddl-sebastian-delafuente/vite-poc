import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';

import NavTabs, { NavTabPane } from '../NavTabs';
import { InfoCircleOutlined } from '@ant-design/icons';

describe('NavTabs component tests', () => {

  it('should render successfully', async () => {
    const { baseElement } = render(
      <NavTabs defaultActiveKey="1">
        <NavTabPane key="1" title="item 1"> Content of item 1</NavTabPane>
        <NavTabPane key="2" title="item 2"> Content of item 2</NavTabPane>
        <NavTabPane key="3" title="item 3"> Content of item 3</NavTabPane>
      </NavTabs>
    );

    expect(baseElement.querySelectorAll('div.ant-tabs-nav-wrap').length).toEqual(1);
    expect(baseElement.querySelectorAll('div.ant-tabs-tab').length).toEqual(3);
    expect(baseElement.querySelectorAll('div.ant-tabs-tabpane').length).toEqual(3);
    await userEvent.click(baseElement.querySelectorAll('div.ant-tabs-tab')[1]);
    expect((baseElement.querySelector('.ant-tabs-tabpane-active') as HTMLElement).textContent).toBe(' Content of item 2');
  });

  it('icon render test', async () => {
    const { baseElement } = render(
      <NavTabs defaultActiveKey="1">
        <NavTabPane key="1" title="item 1" icon={InfoCircleOutlined}> Content of item 1</NavTabPane>
        <NavTabPane key="2" title="item 2" icon={InfoCircleOutlined}> Content of item 2</NavTabPane>
        <NavTabPane key="3" title="item 3" icon={InfoCircleOutlined}> Content of item 3</NavTabPane>
      </NavTabs>
    );
    expect(baseElement.querySelectorAll('.anticon-info-circle').length).toEqual(3);
    await userEvent.click(baseElement.querySelectorAll('div.ant-tabs-tab')[1]);
    expect((baseElement.querySelector('.ant-tabs-tabpane-active') as HTMLElement).textContent).toBe(' Content of item 2');
  });

  it('badge render test', () => {
    const { baseElement } = render(
      <NavTabs defaultActiveKey="1">
        <NavTabPane key="1" title="item 1" badge={12}> Content of item 1</NavTabPane>
        <NavTabPane key="2" title="item 2" badge={99}> Content of item 2</NavTabPane>
        <NavTabPane key="3" title="item 3" badge={126}> Content of item 3</NavTabPane>
      </NavTabs>
    );

    expect(baseElement.querySelectorAll('span.badge').length).toEqual(3);
    expect(baseElement.querySelectorAll('span.badge')[0].textContent).toBe('12');
    expect(baseElement.querySelectorAll('span.badge')[1].textContent).toBe('99');
    expect(baseElement.querySelectorAll('span.badge')[2].textContent).toBe('126');
  });

  it('secondary tab render test', async () => {
    const { baseElement } = render(
      <NavTabs defaultActiveKey="1" tabType="secondary">
        <NavTabPane key="1" title="item 1" > Content of item 1</NavTabPane>
        <NavTabPane key="2" title="item 2" > Content of item 2</NavTabPane>
        <NavTabPane key="3" title="item 3" > Content of item 3</NavTabPane>
      </NavTabs>
    );

    expect(baseElement.querySelectorAll('div.ant-radio-group').length).toEqual(1);
    expect(baseElement.querySelectorAll('.ant-radio-button-wrapper').length).toEqual(3);
    await userEvent.click(baseElement.querySelectorAll('input.ant-radio-button-input')[1]);
    expect((baseElement.querySelector('.tab-content') as HTMLElement).textContent).toBe(' Content of item 2');
  });

});
