import * as React from 'react';
import { Form } from '@ant-design/compatible';
// eslint-disable-next-line no-restricted-imports
import { FormItemProps } from 'antd/lib/form';
import styled from 'styled-components';
import Select from '@domino/ui/dist/components/Select';
import { colors, fontSizes, themeHelper } from '../../styled';
import Button, { ExtendedButtonProps } from '../../components/Button/Button';
import Link from '../../components/Link/Link';
import InfoBox from '../../components/Callout/InfoBox';
import SuccessBox from '../../components/SuccessBox';
import WarningBox from '../../components/WarningBox';
import FlexLayout from '../../components/Layouts/FlexLayout';
import InvisibleButton from '../../components/InvisibleButton';
import * as Color from '../../styled/colors';
import Radio, { RadioGroupProps } from '@domino/ui/dist/components/Radio';

export const CardWrapper = styled.div`
  &:not(:last-child) {
    .ant-card {
      margin-bottom: ${themeHelper('margins.large')};
    }
  }

  .ant-card {
    border-radius: ${themeHelper('borderRadius.standard')};
  }

  .ant-card-head {
    padding: 0 18px;
  }
  .ant-card-body {
    padding: ${themeHelper('margins.small')} ${themeHelper('margins.small')} 0;
  }
  .ant-card-head-title {
    padding: 12px 0;
    font-weight: ${themeHelper('fontWeights.normal')};
    color: ${colors.greyishBrown}
  }
  .ant-btn {
    border: none;
    font-size: ${themeHelper('fontSizes.small')};
    font-weight: ${themeHelper('fontWeights.normal')};
  }
  .ant-card-extra {
    padding: 12px 0;
  }
  .ant-card-actions {
    background: ${colors.white};
    li {
      width: 100%;
      padding-right: ${themeHelper('paddings.small')};
    }
  }
  .delete-data-source-body {
    margin-bottom: ${themeHelper('margins.small')};
  }
  .unauthenticated {
    border: 1px solid ${colors.tulipTree};
    .ant-card-head {
      border-bottom: 1px solid ${colors.tulipTree};
    }
  }
`;
export const CardTitle = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  font-weight: ${themeHelper('fontWeights.bold')};
`;

export const Title = styled.div`
  color: ${colors.doveGreyDarker};
  font-size: ${themeHelper('fontSizes.large')};
  margin-left: 18px;
  font-weight: ${themeHelper('fontWeights.normal')};
`;

export const ModalTitle = styled(FlexLayout)`
  font-size: ${fontSizes.LARGE};
  span {
    margin-left: 18px;
  }
`;

export const StepDescription = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  color: ${colors.brownGrey};
  width: 100px;
`;

export const Container = styled.div`
  padding: ${themeHelper('paddings.medium')} ${themeHelper('paddings.medium')} 0 ${themeHelper('paddings.medium')};
  overflow: hidden;

  .ant-legacy-form-item-control::before {
    display: none;
  }

  .ant-legacy-form-item-label label {
    color: ${colors.emperorGrey};
  }
  .ant-radio-group {
    display: flex;
    flex-direction: column;
  }
  .ant-radio-group > label {
    margin-bottom: ${themeHelper('paddings.large')};
  }
`;

const StyledFormItemDef = styled(Form.Item)`
  .ant-form-item-label {
    font-weight: ${themeHelper('fontWeights.thick')};
  }
  .ant-legacy-form-item-label {
    padding-bottom: 2px;
  }
  &.ant-row.ant-legacy-form-item {
    padding: 0px ${themeHelper('paddings.medium')} 0px ${themeHelper('paddings.medium')};
    margin-bottom: ${themeHelper('margins.medium')};
  }
  .ant-select-selection__placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }
  .ant-input::placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }

  .ant-legacy-form-item-control:not(.has-error) .ant-legacy-form-explain {
    color: ${Color.black};
    font-style: italic;
  }
`;

export const StyledFormItem: React.FC<FormItemProps & { children?: React.ReactNode }> = props => <StyledFormItemDef {...props} />;

const TextContainer = styled.div`
  white-space: normal;
`;

export const LabelValueWrapperStyles = {
  width: '32%',
  margin: 0,
  marginBottom: '16px'
} as React.CSSProperties;

export const SimpleModeTextContainer = styled(TextContainer)`
  line-height: ${themeHelper('card.content.lineHeight')};
`;

const StyledRadioGroupDef = styled(Radio)`
  width: 100%;
`;

export const StyledRadioGroup: React.FC<RadioGroupProps<string | number>> = props => <StyledRadioGroupDef {...props} />;

export const StyledSelect = styled(Select)`
  width: 100%;
`;

export const MultiSelectArea = styled.div<{ hidden: boolean }>`
  padding-top: ${themeHelper('paddings.medium')};
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
`;

export const StyledButton = styled(Button)`
  margin: 0 ${themeHelper('paddings.medium')};
`;

export const OptionalText = styled.span`
  color: ${colors.brownGrey};
  font-style: italic;
  font-weight: normal;
`;

export const StyledRadioContent = styled.div`
  display: inline-grid;
  white-space: normal;
  width: 100%;
`;

export const RadioLinkContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledLink = styled(Link)`
  align-items: center;
  font-size: ${themeHelper('fontSizes.tiny')};
  margin-top: ${themeHelper('margins.tiny')};
`;

export const InfoBoxContainer = styled(InfoBox)`
  margin: 0 ${themeHelper('paddings.medium')} ${themeHelper('paddings.medium')} ;
  width: 100%;
`;

export const SuccessBoxContainer = styled(SuccessBox)`
  margin: ${themeHelper('paddings.medium')};
  width: 100%;
`;

export const WarningBoxContainer = styled(WarningBox)`
  margin: ${themeHelper('paddings.medium')};
  width: 100%;
`;

export const ValidationError = styled.div`
  color: ${colors.torchRed};
`;

export const AdminShieldWrapper = styled.div`
  margin-top: 4px;
`;

export const StyledIconWrapper = styled.div`
  margin-right: ${themeHelper('margins.tiny')};
  margin-top: 3px;
`;

export const ButtonWithoutBorder = styled(Button)`
  & {
    border: none;
    font-size: ${themeHelper('fontSizes.small')};
  }
`;

export const NoMarginLink = styled(Link)`
  margin: 0;
`;

export const SeparatorSpan = styled.span`
  margin-left: 0;
  margin-right: ${themeHelper('paddings.tiny')};
`;

type SecondaryDangerButtonProps = {
  buttonLabel: JSX.Element | string;
  css?: any,
} & ExtendedButtonProps;

export const StyledDangerButton = styled(Button)`
  color: ${colors.cabaret};
`

export const SecondaryDangerButton = ({
  buttonLabel,
  /* eslint-disable-next-line */
  css,
  ...props
}: SecondaryDangerButtonProps) => {
  return (
    <StyledDangerButton
      {...props}
      btnType="secondary"
      isDanger={true}
    >
      {buttonLabel}
    </StyledDangerButton>
  );
}

export const HeaderLayout = styled(FlexLayout)`
  padding-bottom: 16px;
  h1 {
    color: ${colors.semiBlack};
    font-size: ${themeHelper('fontSizes.large')};
    font-weight: normal;
  }
  .ant-btn {
    font-size: ${themeHelper('fontSizes.small')};
  }
`;

export const DoubleColumnItem = styled.div`
  width: 250px;
`;

export const ClipText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ClipLinkText = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
`;

export const ImageTextLabel = styled.div`
  align-items: center;
  display: flex;
  height: ${themeHelper('sizes.large')};
`;

export const ImageText = styled.span`
  font-size: ${themeHelper('fontSizes.medium')};
  line-height: ${themeHelper('fontSizes.medium')};
  margin-left: ${themeHelper('paddings.tiny')};
  margin-top: 1px;
`;

export const WizardContentTitle = styled.span`
  font-size: ${themeHelper('fontSizes.medium')};
`;

export const PermissionContent = styled.div`
  padding: ${themeHelper('margins.medium')} ${themeHelper('margins.medium')} ${themeHelper('margins.medium')} 0;
  background: ${colors.alabaster};
`;

export const ModalFooter = styled(FlexLayout)`
  border-top: 1px solid  ${colors.borderTableGrey};
  padding: ${themeHelper('paddings.large')};
  background: ${colors.alabaster};
  .ant-btn {
    font-size: ${themeHelper('fontSizes.small')};
  }
`;

export const CancelButton = styled(InvisibleButton)`
  margin-right: ${themeHelper('margins.medium')};
  span {
    color: ${colors.basicLink};
  }
`;

export const ProjectTextDiv = styled.span`
  margin-top: 2px;
`;

export const Label = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.headerGrey};
  text-transform: capitalize;
`;

export const AdminPageTitle = styled.div`
  font-size: 36px;
  font-weight: ${themeHelper('fontWeights.medium')};
  color: ${colors.mineShaftColor};
  margin-bottom: ${themeHelper('margins.medium')};;
`;
