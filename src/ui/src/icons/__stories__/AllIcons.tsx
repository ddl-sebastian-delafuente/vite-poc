import * as React from 'react';
import styled from 'styled-components';
import * as antIcons from '@ant-design/icons';
import { colors } from '../../styled';

const Icon = styled.div`
  padding: 10px;
`;
const Text = styled.div`
  width: 100%;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  > div {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    width: 20%;
    flex-direction: column;
  }
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
`;

export enum IconType {
  Outlined = 'Outlined',
  Filled = 'Filled',
  Domino = 'Domino',
}

type AllIconsProps = {
  type?: IconType;
  size?: string;
}

const clean = (filename: string) => filename.replace(/^\.\//g, '').replace(/.tsx/g, '');
export const iconFiles = require.context('..', false, /\.tsx$/);

const AllIcons = ({type = IconType.Outlined, size = '32px'}: AllIconsProps) => {
  const sources = type === IconType.Domino ?
    iconFiles.keys().filter((filename: string) => iconFiles(filename).default &&
      !['./Icon.tsx', './RotateableIcon.tsx'].includes(filename)) :
    Object.keys(antIcons).filter((filename: string) => filename.endsWith(type));
  return (
    <Grid>
      {sources.map((filename: string) => (
        <div key={filename}>
          <Icon>
            {type === IconType.Domino ?
              React.createElement(iconFiles(filename).default, {width: size, height: size,
                primaryColor: colors.lightBlackThree, secondaryColor: colors.disabledText}) :
              React.createElement(antIcons[filename], {style: {fontSize: size}})}
          </Icon>
          <Text>
            {clean(filename)}
          </Text>
        </div>
      ))}
    </Grid>
  );
};

export default AllIcons;
