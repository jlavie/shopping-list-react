import React from 'react';
import { Plus, Clock, Users, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecipeStore } from '../features/recipes/recipeStore';
import { useTranslation } from '../i18n';

export const RecipeList: React.FC = () => {
    const { recipes } = useRecipeStore();
    const { t } = useTranslation();

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-6)'
            }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                    {t.recipes.title}
                </h2>
                <Link
                    to="/recipes/new"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-4)',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontWeight: 'var(--font-weight-medium)'
                    }}
                >
                    <Plus size={20} />
                    <span>{t.recipes.add}</span>
                </Link>
            </div>

            {recipes.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-12)',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-color)'
                }}>
                    <ChefHat size={48} color="var(--color-slate-300)" style={{ marginBottom: 'var(--space-4)' }} />
                    <p style={{ color: 'var(--text-muted)' }}>{t.recipes.empty}</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: 'var(--space-4)'
                }}>
                    {recipes.map((recipe) => (
                        <Link
                            key={recipe.id}
                            to={`/recipes/${recipe.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                backgroundColor: 'var(--bg-card)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ padding: 'var(--space-4)', flex: 1 }}>
                                <h3 style={{
                                    fontWeight: 'var(--font-weight-bold)',
                                    marginBottom: 'var(--space-2)',
                                    fontSize: 'var(--text-lg)'
                                }}>
                                    {recipe.title}
                                </h3>

                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-4)',
                                    color: 'var(--text-muted)',
                                    fontSize: 'var(--text-sm)'
                                }}>
                                    {recipe.prepTime && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <Clock size={14} />
                                            <span>{recipe.prepTime} min</span>
                                        </div>
                                    )}
                                    {recipe.servings && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <Users size={14} />
                                            <span>{recipe.servings} {t.recipes.servings}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
