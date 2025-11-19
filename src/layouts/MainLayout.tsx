import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTranslation } from '../i18n';

export const MainLayout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: 'var(--space-4) 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}>
          <ChefHat color="var(--primary)" size={28} />
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h1 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-main)'
            }}>
              {t.layout.title}
            </h1>
          </Link>

          <nav style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-4)' }}>
            <Link to="/planner" style={{
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary)',
              textDecoration: 'none'
            }}>
              {t.layout.nav.planner}
            </Link>
            <Link to="/shopping" style={{
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary)',
              textDecoration: 'none'
            }}>
              {t.layout.nav.shopping}
            </Link>
            <Link to="/recipes" style={{
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary)',
              textDecoration: 'none'
            }}>
              {t.recipes.title}
            </Link>
            <Link to="/products" style={{
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary)',
              textDecoration: 'none'
            }}>
              {t.products.title}
            </Link>
          </nav>
        </div>
      </header>

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4)'
      }}>
        <Outlet />
      </main>

      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-4)',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }}>
        &copy; {new Date().getFullYear()} {t.layout.footer}
      </footer>
    </div>
  );
};
