import React from 'react';
import { omit } from 'ramda';
import { MoreOutlined } from '@ant-design/icons';
import LinkGoalWrap, { LinkGoalWrapProps } from './LinkGoalWrap';
import ActionDropdown from '../components/ActionDropdown';
import { getPublishNewVersionUri } from '../core/routes';
import { StyledPublishLink } from './atoms';
import { fontSizes } from '../styled';

export interface ModelApisActionsProps extends LinkGoalWrapProps {
  canPublishModel: boolean;
}

type MenuItemProp = {
  key: string;
  content: any;
};

const getMenuItems = (props: ModelApisActionsProps): MenuItemProp[] => {
  const linkGoal = {
    key: 'linkToGoal',
    content: <LinkGoalWrap {...omit(['canPublishModel'], props)} />
  };
  const publishModel = {
    key: 'publishNewVersion',
    content: (
      <StyledPublishLink href={getPublishNewVersionUri(props.modelId, props.projectId)}>
        Publish New Version
      </StyledPublishLink>
    )
  };
  return props.canPublishModel ? [publishModel, linkGoal] : [linkGoal];
};

const ModelApisActions: React.FC<ModelApisActionsProps> = (props: ModelApisActionsProps) => {
  const menuItems = getMenuItems(props);
  return <ActionDropdown menuItems={menuItems} icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />} />;
};

export default ModelApisActions;
