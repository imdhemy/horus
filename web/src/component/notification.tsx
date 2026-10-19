import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert } from './alert';
import type { AlertVariant } from './alert';

type NotificationMessage = {
    message: string;
    variant: AlertVariant;
};

type NotificationState = {
    current: (NotificationMessage & { id: number }) | null;
    notify: (notification: NotificationMessage) => void;
    dismiss: () => void;
};

const NotificationContext = createContext<NotificationState | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [current, setCurrent] = useState<NotificationState['current']>(null);
    const nextId = useRef(0);
    const notify = useCallback((notification: NotificationMessage) => {
        setCurrent({ ...notification, id: ++nextId.current });
    }, []);
    const dismiss = useCallback(() => setCurrent(null), []);

    return (
        <NotificationContext value={{ current, notify, dismiss }}>
            {children}
        </NotificationContext>
    );
}

function useNotificationState(): NotificationState {
    const notification = useContext(NotificationContext);
    if (!notification) throw new Error('Notifications require NotificationProvider');
    return notification;
}

export function useNotification() {
    return useNotificationState().notify;
}

export function Notification() {
    const { current, dismiss } = useNotificationState();
    return current ? (
        <Alert key={current.id} variant={current.variant} onDismiss={dismiss} duration={3000}>
            {current.message}
        </Alert>
    ) : null;
}
