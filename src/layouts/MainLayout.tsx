import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTranslation } from '../i18n';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <div className="main-layout__container">
          <ChefHat color="var(--primary)" size={28} />
          <Link to="/" className="main-layout__brand">
            <h1 className="main-layout__title">
              {t.layout.title}
            </h1>
          </Link>

          <nav className="main-layout__nav">
            <Link to="/planner" className="main-layout__link">
              {t.layout.nav.planner}
            </Link>
            <Link to="/shopping" className="main-layout__link">
              {t.layout.nav.shopping}
            </Link>
            <Link to="/recipes" className="main-layout__link">
              {t.recipes.title}
            </Link>
            <Link to="/products" className="main-layout__link">
              {t.products.title}
            </Link>
          </nav>
        </div>
      </header>

      <main className="main-layout__main">
        <Outlet />
      </main>

      <footer className="main-layout__footer">
        &copy; {new Date().getFullYear()} {t.layout.footer}
      </footer>
    </div>
  );
};
