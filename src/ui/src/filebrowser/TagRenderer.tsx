import * as React from 'react';
import styled from 'styled-components';
import { BranchesOutlined, TagOutlined } from '@ant-design/icons';
import GitCommit from '../icons/GitCommit';
import RefIcon from '../icons/RefIcon';
import OptionalTooltip from '../components/OptionalTooltip';
import { RefType } from './types';

const BRANCH = 'branch';
export const COMMIT = 'commitId';
export const HEAD = 'head';
const REF = 'ref';
const TAG = 'tag';

const branchLabelBackground = '#E8EAEC';
const branchLabelColor = '#7A8899';

const commitLabelBackground = '#2D71C7';
const commitLabelColor = 'white';

const refLabelBackground = '#3CB42C';
const refLabelColor = 'white';

const tagLabelBackground = '#E9564B';
const tabLabelColor = 'white';

const truncationStyle = `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WithIcon = styled.span<{ background: string }>`
  display: inline-flex;
  background: ${props => props.background};
  padding: .35em 1em .25em 1em;
  align-items: center;
  border-radius: 3px;
  color: ${props => props.color};
  ${truncationStyle}

  span {
    margin-left: 3px;
  }

  svg {
    flex-shrink: 0;
  }
`;

const Label = styled.div`
  display: flex;
  min-width: 0px;
  flex-grow: 1;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
`;

const IconContainer = styled.span`
  flex-shrink: 0;
`;
const StyledTagOutlined = styled(TagOutlined)`
  vertical-align: middle;
`;

function renderRefLabel(
  label: string,
  background: string,
  color: string,
  icon?: React.ReactNode,
  title?: Props['title'],
) {
  return (
    <Label>
      <OptionalTooltip shouldShowTooltip={!!title} placement="top" content={title}>
        <WithIcon
          background={background}
          color={color}
        >
          <IconContainer>{icon}</IconContainer>
          <span>
            {label}
          </span>
        </WithIcon>
      </OptionalTooltip>
    </Label>
  );
}

export type Props = {
  tagType: RefType;
  label: string;
  title?: string;
};
const TagRenderer = ({
  tagType,
  label,
  title,
}: Props) => {
  switch (tagType) {
    case BRANCH:
      return (
        renderRefLabel(
          label,
          branchLabelBackground,
          branchLabelColor, (
            <BranchesOutlined style={{ fontSize: '10px'}}/>
          ),
          title,
        )
      );

    case TAG:
      return (
        renderRefLabel(
          label,
          tagLabelBackground,
          tabLabelColor, (
            <StyledTagOutlined
              style={{fontSize: '13px'}}
            />
            ),
          title,
        )
      );
    case COMMIT:
      return (
        renderRefLabel(
          label,
          commitLabelBackground,
          commitLabelColor, (
            <GitCommit
              height={13}
              width={13}
            />
          ),
          title,
        )
      );
    case REF:
      return (
        renderRefLabel(
          label,
          refLabelBackground,
          refLabelColor,
          <RefIcon />,
          title,
        )
      );

    default:
      return (
        renderRefLabel(
          label,
          'white',
          'black',
          undefined,
          title,
        )
      );
  }
};

export default TagRenderer;
