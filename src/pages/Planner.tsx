import React from 'react';
import { WeekView } from '../features/menu/WeekView';
import { useTranslation } from '../i18n';
import './Planner.css';

export const Planner: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="planner-page">
            <h1 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--space-6)',
                color: 'var(--text-main)'
            }}>
                {t.planner.title}
            </h1>
            <WeekView />
        </div>
    );
};
