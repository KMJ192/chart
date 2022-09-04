import React from 'react';

import { buttonType } from './types';

import classNames from 'classnames/bind';
import style from './Button.module.scss';
const cx = classNames.bind(style);

export interface Props {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  theme?: 'primary' | 'secondary';
}

Button.defaultProps = {
  children: undefined,
  onClick: undefined,
  theme: buttonType.PRIMARY,
};

function Button({ children, theme = buttonType.PRIMARY, onClick }: Props): JSX.Element {
  return (
    <button className={cx('default', theme)} onClick={onClick}>
      {children && children}
    </button>
  );
}

export default Button;
