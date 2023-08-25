import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Collapse } from 'antd';
import * as R from 'ramda';
import styled from 'styled-components';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import Link from '../Link/Link';

export interface AccordionProps {
  /**
   * Whether the Accordion is collapsed or not
   */
  isCollapsed?: boolean;
  /**
   * title to be displayed on Accordion
   */
  title?: React.ReactNode;
  /**
   * data-test to be used for testing purpose
   */
  dataTest?: string;
  /**
   * whether the Accordion should be of show-more link type or antd Accordion
   */
  isShowMore?: boolean;
  /**
   * Accordion panel key
   */
  panelKey?: string;
  /**
   * Callback function executed when active panel is changed
   */
  onChange?: (key: string) => void;

  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AccordionState<T> {
  /**
   * Whether the Accordion is collapsed or not
   */
  isCollapsed: boolean;
}

const { Panel } = Collapse;

const Wrapper = styled.div`
  .ant-collapse, .ant-collapse .ant-collapse-item {
    border-color: ${themeHelper('accordion.borderColor')};
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    align-items: center;
    padding: 7px  ${themeHelper('margins.small')};
    border-radius: 2px 2px 0 0;
    border-color: ${themeHelper('accordion.borderColor')};
    background: ${themeHelper('accordion.backgroundColor')};
    color: ${themeHelper('accordion.contentColor')};
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
    margin-right: ${themeHelper('margins.tiny')};
  }
  .ant-collapse-content {
    border-top-color: ${themeHelper('accordion.borderColor')};
  }
`;

class Accordion<T> extends React.PureComponent<AccordionProps, AccordionState<T>>  {
  constructor(props: AccordionProps) {
    super(props);
    this.state = {
      isCollapsed: R.defaultTo(true)(props.isCollapsed)
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: AccordionProps) {
    if (!R.equals(this.props.isCollapsed, nextProps.isCollapsed)) {
      this.setState({
        isCollapsed: !!nextProps.isCollapsed
      });
    }
  }

  onChange = (key: string) => {
    const { onChange: onChangeFn } = this.props;
    if (onChangeFn) {
      onChangeFn(key);
    }
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
  }

  render() {
    const {
      title,
      dataTest,
      isShowMore = false,
      panelKey = '1'
    } = this.props;

    return (
      <Wrapper className="accordion-wrapper">
        <Collapse
          bordered={!isShowMore}
          defaultActiveKey={this.state.isCollapsed ? [] : ['1']}
          onChange={this.onChange}
          className="accordion-collapse"
          data-test={`accordion-collapse-${panelKey}`}
        >
          <Panel
            header={isShowMore ? <Link type="show-more" dataTest={dataTest} isClicked={!this.state.isCollapsed}>
              {title}</Link> : title}
            key={panelKey}
            showArrow={!isShowMore}
            className="accordion-panel"
          >
            {this.props.children}
          </Panel>
        </Collapse>
      </Wrapper>
    );
  }
}

export default Accordion;
