import { alabaster, btnGrey, warmGrey, tundora, cornflowerBlue, white, greyishBrown } from '../styled/colors';
import styled from 'styled-components';
import * as React from 'react';
import { themeHelper } from '../styled/themeUtils';

const FormStyledGroupComponent = styled.div`
  > :not(:last-child) {
    margin-bottom: ${themeHelper('margins.tiny')};
  }
  margin-bottom: ${themeHelper('margins.small')};
  .ant-checkbox-wrapper {
    span {
      font-weight: ${themeHelper('fontWeights.normal')};
    }
  }
  .border-bottom {
    border-bottom: 1px solid ${btnGrey};
  }
  .title-optional {
    font-weight: ${themeHelper('fontWeights.normal')};
    color: ${warmGrey};
    font-size: ${themeHelper('fontSizes.small')};
    line-height: 16px;
  }
  .title {
    font-weight: ${themeHelper('fontWeights.normal')};
    color: ${tundora};
    font-size: ${themeHelper('fontSizes.medium')};
    line-height: 21px;
    display: block;
    margin-bottom: ${themeHelper('margins.tiny')};
  }
  .info-block {
    svg{
      margin-left: 4px;
      height: ${themeHelper('sizes.medium')};
      width: ${themeHelper('sizes.medium')};
      color: ${cornflowerBlue};
    }
  }
  .full-width {
    width: 100% !important;
  }
  .half-width {
    width: 50%;
  }
  input {
    padding: 10px;
    height: 36px;
    border: 1px solid ${btnGrey};
    background-color: ${white};
  }
  .ant-checkbox-wrapper {
    span {
      display: inline-flex;
      align-items: center;
      padding-right: 0px;
    }
  }
  .hardware-tier-status-dropdown {
    position: relative;
    strong {
      font-weight: normal;
    }
  }
  .well {
    padding: 16px;
    background-color: ${alabaster};
    border: none;
    border-radius: ${themeHelper('borderRadius.standard')};
    width: 410px;
    .ant-radio-wrapper {
      margin-right: 0px;
      span {
        display: inline-flex;
        align-items: center;
        font-weight: ${themeHelper('fontWeights.normal')};
      }
    }
    .border-bottom {
      margin: ${themeHelper('margins.tiny')} -4px 0px;
    }
    > :not(:last-child) {
      margin-bottom: ${themeHelper('margins.small')};
    }
    > :last-child {
      margin-bottom: 0px;
    }
  }
`;

const FormContainerComponent = styled.div`
  width: 490px;
  padding: 0px 56px 0px 24px;
  z-index: 100;
  background-color: ${white};
  .submit-btn {
    float: right;
  }
`;

const TitleContainerComponent = styled.div`
  display: flex;
  span:not([role=img]) {
    margin: auto 0px auto 12px;
    color: ${greyishBrown};
    font-size: ${themeHelper('fontSizes.large')};
    line-height: 1.2;
    font-weight: ${themeHelper('fontWeights.normal')};
  }
`;

export type CommonClassNameType = { className?: string, children?: React.ReactNode };
export const FormStyledGroup = ({ className, children }: CommonClassNameType) => <FormStyledGroupComponent className={className}>{children}</FormStyledGroupComponent>;
export const FormContainer = ({ className, children }: CommonClassNameType) => <FormContainerComponent className={className}>{children}</FormContainerComponent>;
export const TitleContainer = ({ className, children }: CommonClassNameType) => <TitleContainerComponent className={className}>{children}</TitleContainerComponent>;
