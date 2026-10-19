import type { ComponentPropsWithoutRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { ButtonSize, ButtonVariant } from './button-style';
import { buttonClassName } from './button-style';

type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'> & {
    to: string;
} & (
    | { variant: ButtonVariant; size?: ButtonSize }
    | { variant?: never; size?: never }
);

export const Link = ({ variant, size = 'md', to, ...props }: LinkProps) => (
    <RouterLink {...props} to={to} className={variant ? buttonClassName(variant, size) : undefined}/>
);
