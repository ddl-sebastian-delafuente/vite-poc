import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Checkbox as AntdCheckbox } from 'antd';
import styled from 'styled-components';
import { themeHelper } from '../../styled';
import { CheckboxChangeEvent, CheckboxGroupProps, CheckboxProps } from 'antd/lib/checkbox';

const StyledAntCheckbox = styled(AntdCheckbox)`
	&.ant-checkbox-wrapper {
		color: ${themeHelper('checkbox.container.color')};
	}
	.ant-checkbox-inner {
		border: 1px solid ${themeHelper('checkbox.container.borderColor')};
		background-color: ${themeHelper('checkbox.container.backgroundColor')};
	}
	&.ant-checkbox-wrapper:hover .ant-checkbox-inner,
	.ant-checkbox:hover .ant-checkbox-inner,
	.ant-checkbox-input:focus + .ant-checkbox-inner {
		border-color: ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-checkbox-checked::after {
		border: 1px solid ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-checkbox-checked .ant-checkbox-inner {
		background-color: ${themeHelper('checkbox.selected.borderColor')};
		border-color: ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-checkbox-indeterminate .ant-checkbox-inner {
		border-color: ${themeHelper('checkbox.intermediate.default.borderColor')};
	}
	.ant-checkbox-indeterminate .ant-checkbox-inner::after {
		background-color: ${themeHelper('checkbox.intermediate.default.backgroundColor')};
	}
	.ant-checkbox-disabled + span {
		color: ${themeHelper('checkbox.disabled.color')};
	}
	.ant-checkbox-disabled .ant-checkbox-inner {
		background-color: ${themeHelper('checkbox.disabled.backgroundColor')};
    	border-color: ${themeHelper('checkbox.disabled.color')} !important;
	}
	.ant-checkbox-indeterminate.ant-checkbox-disabled .ant-checkbox-inner::after {
		background-color: ${themeHelper('checkbox.intermediate.disabled.backgroundColor')};
	}
	.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
		border-color: ${themeHelper('checkbox.disabled.color')};
	}
`;

const Checkbox = (props: CheckboxProps) => <StyledAntCheckbox {...props} />;

Checkbox.Group = (props: CheckboxGroupProps) => <StyledAntCheckbox.Group {...props} />;

export { CheckboxChangeEvent, CheckboxProps, CheckboxGroupProps };
export default Checkbox;
