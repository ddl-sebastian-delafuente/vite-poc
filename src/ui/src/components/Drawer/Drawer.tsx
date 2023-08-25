import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Drawer as AntDrawer } from 'antd';
import { DrawerProps as AntProps } from 'antd/lib/drawer';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import InvisibleButton from '../InvisibleButton';
import FlexLayout from '../Layouts/FlexLayout';
import { themeHelper } from '../../styled';
import { grey70, greylight3 } from '../../styled/colors';

const Wrapper = styled.div`
  & .ant-drawer-close {
    order: 1;
  }
  & .ant-drawer-header {
    height: 56px;
    border-color: ${greylight3};
    line-height: 20px;
  }
  .ant-drawer-body {
    line-height: 1;
  }
`;

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
  }
`;
const StyledCloseOutlined  = styled(CloseOutlined)`
  color: ${grey70};
  font-size: ${themeHelper('fontSizes.medium')};
`;

interface Props {
  buttonLabel: React.ReactNode;
  dataTest: string;
};

const Drawer = ({ children, buttonLabel, ...rest }: Props & AntProps) => {
  const [visibility, setVisibility] = React.useState<boolean>(false);

  const showDrawer = () => {
    setVisibility(true);
  };

  const onClose = () => {
    setVisibility(false);
  };

  return (
    <Wrapper data-test={rest.dataTest}>
      <StyledInvisibleButton onClick={showDrawer}>{buttonLabel}</StyledInvisibleButton>
      <AntDrawer
        {...rest}
        visible={visibility}
        onClose={onClose}
        closable={false}
        title={
          <FlexLayout justifyContent="space-between" flexDirection="row">
            <div>{rest.title}</div>
            <StyledInvisibleButton onClick={onClose}><StyledCloseOutlined /></StyledInvisibleButton>
          </FlexLayout>
        }
      >
        {children}
      </AntDrawer>
    </Wrapper>);
};

export default Drawer;
