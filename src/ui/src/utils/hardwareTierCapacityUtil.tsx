import * as React from 'react';
import * as R from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd';
import styled from 'styled-components';
import { colors } from '../styled';
import useStore from '../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from './whiteLabelUtil';

export type HardwareTierStatus = 'FULL' | 'REQUIRES_LAUNCHING_INSTANCE' | 'CAN_EXECUTE_WITH_CURRENT_INSTANCES' |
  'UNKNOWN';

type HardwareCapacityStatusProps = { color: string };
const HardwareCapacityStatus = styled.div<HardwareCapacityStatusProps>`
  background: ${props => props.color};
  height: 1em;
  width: 1em;
  display: inline-block;
  border-radius: 100%;
`;

export type HardwareTierCapacityStatusDetails = {
  labelText: string;
  tagColor: string;
  tooltipText: string;
};

export type HardwareTierCapacityPropsMap = { [label: string]: HardwareTierCapacityStatusDetails };

export const hardwareTierCapacityInfoMap: HardwareTierCapacityPropsMap = {
  'FULL':
  {
    labelText: 'NO ESTIMATE',
    tagColor: colors.subGrey,
    tooltipText:
      'This tier has no machines available and is not able to launch new machines.',
  },
  'REQUIRES_LAUNCHING_INSTANCE':
  {
    labelText: '< 7 MIN',
    tagColor: colors.warning,
    tooltipText:
      'Domino will need to launch a new machine.',
  },
  'CAN_EXECUTE_WITH_CURRENT_INSTANCES':
  {
    labelText: '< 1 MIN',
    tagColor: colors.green,
    tooltipText:
      'This tier has machines currently available.',
  },
  'UNKNOWN':
  {
    labelText: 'NO ESTIMATE',
    tagColor: colors.subGrey,
    tooltipText:
      'Capacity is not currently known.',
  }
};

export type HardwareTierCapacityStatusProps = {
  status: HardwareTierStatus;
};

const statusStyle = {
  zIndex: 2200,
};

export const HardwareTierCapacityStatus = ({ status }: HardwareTierCapacityStatusProps) => {
  const { whiteLabelSettings } = useStore();
  const {
    tooltipText = 'Status not found',
    tagColor = 'grey',
  } = R.defaultTo({} as HardwareTierCapacityStatusDetails)(hardwareTierCapacityInfoMap[status]);
  return (
    <Tooltip
      placement="top"
      overlayStyle={statusStyle}
      title={replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(tooltipText)}
    >
      <HardwareCapacityStatus color={tagColor} />
    </Tooltip>
  );
};
