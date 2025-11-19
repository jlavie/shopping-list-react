import React from 'react';
import { useTranslation } from '../i18n';

export const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--space-4)'
            }}>
                {t.home.welcome}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
                {t.home.subtitle}
            </p>

            <div style={{
                marginTop: 'var(--space-8)',
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-primary-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-primary-200)'
            }}>
                <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-primary-800)',
                    marginBottom: 'var(--space-2)'
                }}>
                    {t.home.start.title}
                </h3>
                <p style={{ color: 'var(--color-primary-700)' }}>
                    {t.home.start.desc}
                </p>
            </div>
        </div>
    );
};
