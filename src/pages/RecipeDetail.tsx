import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, Minus } from 'lucide-react';
import { useRecipeStore } from '../features/recipes/recipeStore';
import { useProductStore } from '../features/ingredients/productStore';
import { UNITS } from '../constants/units';
import { useTranslation } from '../i18n';
import type { Recipe, Ingredient } from '../types';
import './RecipeDetail.css';

export const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getRecipe, addRecipe, updateRecipe, removeRecipe } = useRecipeStore();
    const { products } = useProductStore();
    const { t } = useTranslation();

    const isNew = id === 'new';
    const [recipe, setRecipe] = useState<Partial<Recipe>>({
        title: '',
        ingredients: [],
        steps: [],
        prepTime: 0,
        servings: 2
    });

    useEffect(() => {
        if (!isNew && id) {
            const existing = getRecipe(id);
            if (existing) {
                setRecipe(existing);
            } else {
                navigate('/recipes');
            }
        }
    }, [id, isNew, getRecipe, navigate]);

    const handleSave = () => {
        if (!recipe.title) return;

        if (isNew) {
            addRecipe(recipe as Omit<Recipe, 'id'>);
        } else if (id) {
            updateRecipe(id, recipe);
        }
        navigate('/recipes');
    };

    const handleDelete = () => {
        if (id && confirm(t.common.confirm + ' ?')) {
            removeRecipe(id);
            navigate('/recipes');
        }
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: any) => {
        const newIngredients = [...(recipe.ingredients || [])];
        newIngredients[index] = { ...newIngredients[index], [field]: value };

        // Si on change le nom (sélection d'un produit), on met à jour l'unité par défaut si elle n'est pas définie
        if (field === 'name') {
            const product = products.find(p => p.name === value);
            if (product) {
                newIngredients[index].unit = product.defaultUnit;
            }
        }

        setRecipe({ ...recipe, ingredients: newIngredients });
    };

    const addIngredient = () => {
        setRecipe({
            ...recipe,
            ingredients: [
                ...(recipe.ingredients || []),
                { id: crypto.randomUUID(), name: '', quantity: 1, unit: 'unité', checked: false }
            ]
        });
    };

    const removeIngredient = (index: number) => {
        const newIngredients = [...(recipe.ingredients || [])];
        newIngredients.splice(index, 1);
        setRecipe({ ...recipe, ingredients: newIngredients });
    };

    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...(recipe.steps || [])];
        newSteps[index] = value;
        setRecipe({ ...recipe, steps: newSteps });
    };

    const addStep = () => {
        setRecipe({ ...recipe, steps: [...(recipe.steps || []), ''] });
    };

    const removeStep = (index: number) => {
        const newSteps = [...(recipe.steps || [])];
        newSteps.splice(index, 1);
        setRecipe({ ...recipe, steps: newSteps });
    };

    return (
        <div className="recipe-detail">
            <div className="recipe-detail__header">
                <button onClick={() => navigate('/recipes')} className="recipe-detail__back-btn">
                    <ArrowLeft size={20} />
                    <span>{t.common.cancel}</span>
                </button>
                <div className="recipe-detail__actions">
                    {!isNew && (
                        <button
                            onClick={handleDelete}
                            className="recipe-detail__action-btn recipe-detail__action-btn--danger"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="recipe-detail__action-btn recipe-detail__action-btn--primary"
                    >
                        <Save size={20} />
                        <span>{t.common.save}</span>
                    </button>
                </div>
            </div>

            <div className="recipe-detail__form">
                {/* Informations de base */}
                <div className="recipe-detail__section">
                    <div className="recipe-detail__form-group">
                        <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{t.recipes.form.titlePlaceholder}</label>
                        <input
                            type="text"
                            value={recipe.title}
                            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                            className="recipe-detail__input recipe-detail__input--large"
                            placeholder={t.recipes.form.titlePlaceholder}
                        />
                    </div>
                    <div className="recipe-detail__row">
                        <div className="recipe-detail__form-group" style={{ flex: 1 }}>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{t.recipes.form.prepTime}</label>
                            <input
                                type="number"
                                value={recipe.prepTime}
                                onChange={(e) => setRecipe({ ...recipe, prepTime: parseInt(e.target.value) || 0 })}
                                className="recipe-detail__input"
                            />
                        </div>
                        <div className="recipe-detail__form-group" style={{ flex: 1 }}>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{t.recipes.form.servings}</label>
                            <input
                                type="number"
                                value={recipe.servings}
                                onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })}
                                className="recipe-detail__input"
                            />
                        </div>
                    </div>
                </div>

                {/* Ingrédients */}
                <div className="recipe-detail__section">
                    <div className="recipe-detail__section-header">
                        <h3 className="recipe-detail__section-title">{t.recipes.ingredients}</h3>
                        <button onClick={addIngredient} className="recipe-detail__add-btn">
                            <Plus size={16} /> {t.recipes.form.addIngredient}
                        </button>
                    </div>
                    <div className="recipe-detail__list">
                        {recipe.ingredients?.map((ing, index) => (
                            <div key={ing.id} className="recipe-detail__list-item">
                                {/* Sélection du produit */}
                                <select
                                    value={ing.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    className="recipe-detail__select"
                                    style={{ flex: 2 }}
                                >
                                    <option value="">Sélectionner un ingrédient...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                    {/* Option pour garder la compatibilité si l'ingrédient n'est pas dans la liste */}
                                    {ing.name && !products.find(p => p.name === ing.name) && (
                                        <option value={ing.name}>{ing.name}</option>
                                    )}
                                </select>

                                <input
                                    type="number"
                                    value={ing.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    className="recipe-detail__input"
                                    style={{ width: '80px' }}
                                />

                                {/* Sélection de l'unité */}
                                <select
                                    value={ing.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    className="recipe-detail__select"
                                    style={{ width: '120px' }}
                                >
                                    {UNITS.map(u => (
                                        <option key={u.value} value={u.value}>{u.label}</option>
                                    ))}
                                </select>

                                <button onClick={() => removeIngredient(index)} className="recipe-detail__remove-btn">
                                    <Minus size={16} />
                                </button>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-warning-600)', marginTop: 'var(--space-2)' }}>
                                Astuce : Créez d'abord vos ingrédients dans la section "Mes Ingrédients".
                            </p>
                        )}
                    </div>
                </div>

                {/* Étapes */}
                <div className="recipe-detail__section">
                    <div className="recipe-detail__section-header">
                        <h3 className="recipe-detail__section-title">{t.recipes.steps}</h3>
                        <button onClick={addStep} className="recipe-detail__add-btn">
                            <Plus size={16} /> {t.recipes.form.addStep}
                        </button>
                    </div>
                    <div className="recipe-detail__list">
                        {recipe.steps?.map((step, index) => (
                            <div key={index} className="recipe-detail__list-item" style={{ alignItems: 'flex-start' }}>
                                <span className="recipe-detail__step-number">{index + 1}.</span>
                                <textarea
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    placeholder={t.recipes.form.stepPlaceholder}
                                    className="recipe-detail__input"
                                    style={{ flex: 1, minHeight: '60px', resize: 'vertical' }}
                                />
                                <button onClick={() => removeStep(index)} className="recipe-detail__remove-btn">
                                    <Minus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
