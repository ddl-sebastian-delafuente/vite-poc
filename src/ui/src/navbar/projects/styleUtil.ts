import styled from 'styled-components';
import { sizes, themeHelper } from '../../styled';

export const getStyledIcon = (Component: any, disabled: boolean) => {
  return styled(Component)`
    position: absolute;
    margin: 0;
    right: 12px;
    top: 11px;
    padding: 2px;
    width: ${sizes.SMALL};
    height: ${sizes.SMALL};
    background-color: ${themeHelper('nav.secondary.color')};
    border-radius: 50%;
    opacity: 0.6;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};

    &&.anticon {
      width: ${sizes.SMALL};
    }
    &.anticon svg {
      width: 10px;
      height: 10px;
    }
    ${disabled ? '' : `
      &.anticon:hover, &.anticon:active, &.anticon:visited, &.anticon:focus {
        right: 9px;
        width: 20px;
        height: 20px;
        top: 8px;
        background: ${themeHelper('nav.secondary.color')};
        svg {
          width: ${sizes.MEDIUM};
          height: ${sizes.MEDIUM};
        }
      }
    `}
  `;
};
