'use client';

import { CSSProperties, FC, ReactNode } from 'react';
import clsx from 'clsx';
import Spinner from '../spinner/Spinner';

export enum ButtonVariant {
  SOLID = 'solid',
  OUTLINE = 'outline',
  CLEAR = 'clear',
}

export enum ButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
  BUY = 'green',
  SUCCES = 'green',
  YELLOW = 'yellow',
}

type ButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: 'xs' | 's' | 'm' | 'l';
  disabled?: boolean;
  fullWidth?: boolean;
  title?: string;
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  onClick?: () => void;
  onClose?: () => void;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
};

const Button: FC<ButtonProps> = ({
  variant = ButtonVariant.SOLID,
  color = ButtonColor.PRIMARY,
  size = 'm',
  disabled,
  fullWidth,
  title,
  LeftIcon,
  RightIcon,
  onClick,
  type = 'button',
  isLoading,
  className,
  style,
}) => {
  const buttonClasses = clsx(
    'rounded-[12px] shrink-0 flex items-center justify-center',
    {
      'px-2 py-1 w-fit': size === 's' && variant !== ButtonVariant.CLEAR,
      'px-3 py-2 w-fit': size === 'm' && variant !== ButtonVariant.CLEAR,
      'px-4 py-3 w-fit': size === 'l' && variant !== ButtonVariant.CLEAR,
      'text-[13px] font-regular w-fit': size === 'xs',
      'px-0 py-0': variant === ButtonVariant.CLEAR,
      'w-full': fullWidth,
      'opacity-60 cursor-not-allowed': disabled || isLoading,
      'cursor-pointer': !disabled,
      'bg-brand-primary':
        color === ButtonColor.PRIMARY && variant === ButtonVariant.SOLID,
      'bg-inherit text-brand-primary border-[1px] border-brand-primary':
        color === ButtonColor.PRIMARY && variant === ButtonVariant.OUTLINE,
      'bg-inherit text-brand-primary':
        color === ButtonColor.PRIMARY && variant === ButtonVariant.CLEAR,
      'bg-button-grey text-button-text-grey':
        color === ButtonColor.SECONDARY && variant === ButtonVariant.SOLID,
      'bg-inherit text-button-text-grey border-[1px] border-button-grey':
        color === ButtonColor.SECONDARY && variant === ButtonVariant.OUTLINE,
      'bg-brand-green text-inverted':
        color === ButtonColor.BUY && variant === ButtonVariant.SOLID,
      'bg-inherit text-button-text-green border-[1px] border-button-green':
        color === ButtonColor.BUY && variant === ButtonVariant.OUTLINE,
      'bg-brand-success text-inverted':
        color === ButtonColor.SUCCES && variant === ButtonVariant.SOLID,
      'bg-inherit text-button-text-success border-[1px] border-button-success':
        color === ButtonColor.SUCCES && variant === ButtonVariant.OUTLINE,
      'bg-brand-primary text-inverted':
        color === ButtonColor.YELLOW && variant === ButtonVariant.SOLID,
      'bg-inherit text-brand-primary border-[1px] border-button-brand-primary':
        color === ButtonColor.YELLOW && variant === ButtonVariant.OUTLINE,
      'bg-brand-danger text-inverted':
        color === ButtonColor.DANGER && variant === ButtonVariant.SOLID,
      'bg-inherit text-brand-danger border-[1px] border-brand-danger':
        color === ButtonColor.DANGER && variant === ButtonVariant.OUTLINE,
    },
    className,
  );

  const buttonTextClasses = clsx('', {
    'text-[14px] font-semibold': size === 's',
    'text-[16px] font-semibold': size === 'm' || size === 'l',
    'text-black':
      color === ButtonColor.PRIMARY && variant === ButtonVariant.SOLID,
    'text-brand-primary':
      color === ButtonColor.PRIMARY &&
      (variant === ButtonVariant.OUTLINE || variant === ButtonVariant.CLEAR),
    'text-button-text-grey hover:text-button-text-green':
      color === ButtonColor.SECONDARY &&
      (variant === ButtonVariant.SOLID || variant === ButtonVariant.OUTLINE),
    'text-white':
      color === ButtonColor.BUY &&
      (variant === ButtonVariant.SOLID || variant === ButtonVariant.OUTLINE),
    'text-brand-success':
      color === ButtonColor.SUCCES &&
      (variant === ButtonVariant.SOLID ||
        variant === ButtonVariant.OUTLINE ||
        variant === ButtonVariant.CLEAR),
    'text-inverted':
      color === ButtonColor.DANGER && variant === ButtonVariant.SOLID,
    'text-brand-danger':
      color === ButtonColor.DANGER &&
      (variant === ButtonVariant.OUTLINE || variant === ButtonVariant.CLEAR),
  });

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      style={style}
    >
      <div className="flex items-center justify-center gap-x-2">
        {isLoading ? (
          <Spinner size={20} />
        ) : (
          <>
            {LeftIcon && LeftIcon}
            {title && <h6 className={buttonTextClasses}>{title}</h6>}
            {RightIcon && RightIcon}
          </>
        )}
      </div>
    </button>
  );
};

export default Button;
