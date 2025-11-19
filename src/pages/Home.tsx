import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import './Home.css';

export const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="home">
            <div className="home__hero">
                <h1 className="home__title">
                    {t.home.welcome}
                </h1>
                <p className="home__subtitle">
                    {t.home.subtitle}
                </p>
                <Link to="/planner" className="home__cta">
                    {t.home.start.title}
                </Link>
            </div>
        </div>
    );
};
