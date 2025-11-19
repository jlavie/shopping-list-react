import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Users } from 'lucide-react';
import { useRecipeStore } from '../features/recipes/recipeStore';
import { useTranslation } from '../i18n';
import './RecipeList.css';

export const RecipeList: React.FC = () => {
    const { recipes } = useRecipeStore();
    const { t } = useTranslation();

    return (
        <div className="recipe-list">
            <div className="recipe-list__header">
                <h2 className="recipe-list__title">
                    {t.recipes.title}
                </h2>
                <Link to="/recipes/new" className="recipe-list__add-btn">
                    <Plus size={20} />
                    <span>{t.recipes.add}</span>
                </Link>
            </div>

            <div className="recipe-list__grid">
                {recipes.length === 0 ? (
                    <p className="recipe-list__empty">
                        {t.recipes.empty}
                    </p>
                ) : (
                    recipes.map((recipe) => (
                        <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card">
                            <h3 className="recipe-card__title">{recipe.title}</h3>
                            <div className="recipe-card__meta">
                                <div className="recipe-card__meta-item">
                                    <Clock size={16} />
                                    <span>{recipe.prepTime} min</span>
                                </div>
                                <div className="recipe-card__meta-item">
                                    <Users size={16} />
                                    <span>{recipe.servings} {t.recipes.servings}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};
