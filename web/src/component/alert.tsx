import type { ReactNode } from 'react';
import { useEffect } from 'react';

export type AlertVariant = 'success' | 'failure' | 'warning';

const variants: Record<AlertVariant, string> = {
    success: 'bg-alert-success-bg text-alert-success-text',
    failure: 'bg-alert-failure-bg text-alert-failure-text',
    warning: 'bg-alert-warning-bg text-alert-warning-text',
};

type Props = {
    duration?: number;
    children: ReactNode;
    onDismiss: () => void;
    variant: AlertVariant;
};

export const Alert = ({ duration = 1000, children, onDismiss, variant }: Props) => {
    useEffect(() => {
        const timer = window.setTimeout(onDismiss, duration);

        return () => window.clearTimeout(timer);
    }, [duration, onDismiss]);

    return (
        <div
            role='alert'
            className={`${variants[variant]} p-2 text-sm rounded-sm my-5`}
        >
            {children}
        </div>
    );
};
