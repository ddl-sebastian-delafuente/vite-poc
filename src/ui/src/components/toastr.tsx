import * as React from 'react';
import { defaultTo, isNil } from 'ramda';
import { kebabCase } from 'lodash';
import { ArgsProps, NotificationPlacement } from 'antd/lib/notification';
// eslint-disable-next-line no-restricted-imports
import { notification } from 'antd';
import { cabaret as errorColor, successDark as successColor, tulipTree as warningColor, } from '../styled/colors';
import { CheckCircleFilled, ClockCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { fontSizes } from '../styled';

// we make the check to avoid test failures
if (notification) {
  notification.config({
    placement: 'topRight',
    bottom: 50,
    duration: 2,
    top: 50,
  });
}

type titleType = 'success' | 'warning' | 'error';

export const autoDismissTimeout = 2;

export const messageObj = (
  text: React.ReactNode,
  description: string,
  borderColor: string,
  className?: string,
  duration?: number,
  placement?: NotificationPlacement,
  icon?: React.ReactNode
): ArgsProps => ({
  duration: defaultTo(autoDismissTimeout)(duration),
  message: text,
  description: description,
  style: {
    // Z-index needs to be incredibly high  because a third-party script is occluding toast messages
    // https://dominodatalab.atlassian.net/browse/DOM-46188
    zIndex: 2147483013,
    border: `1px solid ${borderColor}`,
    borderLeftWidth: '4px',
    borderRadius: '2px',
    padding: '8px 16px',
  },
  className: className,
  placement,
  icon
});

const openError = (
  title: React.ReactNode,
  description: string,
  borderColor: string,
  className?: string,
  duration?: number,
  icon?: React.ReactNode
) =>
  notification.open(messageObj(title, description, borderColor, className, isNil(duration) ? 0 : duration, undefined, icon));

const open = (
  title: React.ReactNode,
  description: string,
  borderColor: string,
  className?: string,
  placement?: NotificationPlacement,
  duration?: number,
  icon?: React.ReactNode
) => notification.open(
  messageObj(title, description, borderColor, className, defaultTo(autoDismissTimeout)(duration), placement, icon)
);

export const generateTestId = (text: React.ReactNode, type: titleType) =>
  typeof text === 'string' ? `${kebabCase(text.split('.')[0].slice(0, 20))}-${type}` : '';

// We export each notification function to make it possible to only import the needed one
export const success = (text: React.ReactNode, description = '', placement: NotificationPlacement = 'topRight',
                        duration = autoDismissTimeout, showCloseIcon = true) => {
  const t = <div data-test={generateTestId(text, 'success')}>{text}</div>;
  const className = (!showCloseIcon && duration && duration > 0) ? 'no-close-icon' : undefined;
  open(t, description, successColor, className, placement, duration,
    <CheckCircleFilled style={{ fontSize: fontSizes.MEDIUM, color: successColor, transform: 'translate(0px, -3px)', marginTop: '3px' }} />);
};

export const error = (text: React.ReactNode, description = '', duration = 0, showCloseIcon = true) => {
  const className = (!showCloseIcon && duration && duration > 0) ? 'no-close-icon' : undefined;
  const t = <div data-test={generateTestId(text, 'error')}>{text}</div>;
  openError(t, description, errorColor, className, duration,
    <ExclamationCircleFilled style={{ fontSize: fontSizes.MEDIUM, color: errorColor, transform: 'translate(0px, -3px)', marginTop: '3px' }} />);
};

export const warning = (text: React.ReactNode, description = '', duration = autoDismissTimeout, showCloseIcon = true) => {
  const t = <div data-test={generateTestId(text, 'warning')}>{text}</div>;
  const className = (!showCloseIcon && duration && duration > 0) ? 'no-close-icon' : undefined;
  open(t, description, warningColor, className, 'topRight', duration, <ClockCircleOutlined style={{ fontSize: fontSizes.MEDIUM, color: warningColor, transform: 'translate(0px, -3px)', marginTop: '3px' }} />);
};
