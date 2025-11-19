export const getStartOfWeek = (date: Date = new Date()): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getWeekDays = (startDate: Date): Date[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        days.push(d);
    }
    return days;
};

export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const formatDayName = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric' }).format(date);
};
