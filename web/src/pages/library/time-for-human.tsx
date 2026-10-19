type Clock = { now(): number };

export const createTimeForHuman = (clock: Clock) =>
    function timeForHuman(timestamp: number): string {
        const seconds = Math.max(0, Math.floor((clock.now() - timestamp) / 1000));

        const units = [
            { seconds: 365 * 24 * 60 * 60, label: 'y' },
            { seconds: 30 * 24 * 60 * 60, label: 'mo' },
            { seconds: 7 * 24 * 60 * 60, label: 'w' },
            { seconds: 24 * 60 * 60, label: 'd' },
            { seconds: 60 * 60, label: 'h' },
            { seconds: 60, label: 'm' },
        ];
        const unit = units.find((unit) => seconds >= unit.seconds);

        return unit
            ? `${Math.floor(seconds / unit.seconds)}${unit.label} ago`
            : 'just now';
    };

export const timeForHuman = createTimeForHuman(Date);
