import type { ComponentPropsWithoutRef } from 'react';
import type { ButtonSize, ButtonVariant } from './button-style';
import { buttonClassName } from './button-style';

type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export const Button = ({ variant = 'primary', size = 'md', type = 'button', ...props }: ButtonProps) => (
    <button {...props} type={type} className={buttonClassName(variant, size)}/>
);

