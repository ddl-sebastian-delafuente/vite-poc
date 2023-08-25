import * as React from 'react';
import Icon, { IconProps } from './Icon';
import { colors } from '../styled';

class Group extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 24,
    width: 24,
    viewBox: '0 0 24 24',
    primaryColor: colors.basicLink
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect width="24" height="24" rx="4" fill="#6CAAFF" fillOpacity="0.1"/>
        <path d="M7 11C8.105 11 9 10.105 9 9C9 7.895 8.105 7 7 7C5.895 7 5 7.895 5 9C5 10.105 5.895 11 7 11Z" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M7 12C5.665 12 3 12.67 3 14V15H11V14C11 12.67 8.335 12 7 12Z" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M17 11C18.105 11 19 10.105 19 9C19 7.895 18.105 7 17 7C15.895 7 15 7.895 15 9C15 10.105 15.895 11 17 11Z" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M17 12C15.665 12 13 12.67 13 14V15H21V14C21 12.67 18.335 12 17 12Z" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M12 14.5C14.2099 14.5 16 12.7099 16 10.5C16 8.29011 14.2099 6.5 12 6.5C9.79011 6.5 8 8.29011 8 10.5C8 12.7099 9.79011 14.5 12 14.5Z" stroke="#F3F7FF"/>
        <path d="M12 14.5C14.2099 14.5 16 12.7099 16 10.5C16 8.29011 14.2099 6.5 12 6.5C9.79011 6.5 8 8.29011 8 10.5C8 12.7099 9.79011 14.5 12 14.5Z" stroke="#F3F7FF"/>
        <path d="M12 14.5C14.2099 14.5 16 12.7099 16 10.5C16 8.29011 14.2099 6.5 12 6.5C9.79011 6.5 8 8.29011 8 10.5C8 12.7099 9.79011 14.5 12 14.5Z" stroke={primaryColor}/>
        <path d="M5 19.5V20H5.5H18.5H19V19.5V18.1667C19 17.4987 18.5893 16.9804 18.0913 16.6033C17.589 16.2229 16.9214 15.924 16.2196 15.6933C14.8133 15.2311 13.1355 15 12 15C10.8645 15 9.18667 15.2311 7.78035 15.6933C7.07863 15.924 6.41101 16.2229 5.9087 16.6033C5.41073 16.9804 5 17.4987 5 18.1667V19.5Z" stroke="#F3F7FF"/>
        <path d="M5 19.5V20H5.5H18.5H19V19.5V18.1667C19 17.4987 18.5893 16.9804 18.0913 16.6033C17.589 16.2229 16.9214 15.924 16.2196 15.6933C14.8133 15.2311 13.1355 15 12 15C10.8645 15 9.18667 15.2311 7.78035 15.6933C7.07863 15.924 6.41101 16.2229 5.9087 16.6033C5.41073 16.9804 5 17.4987 5 18.1667V19.5Z" stroke={primaryColor}/>
      </g>
    );
  }
}

export default Group;
