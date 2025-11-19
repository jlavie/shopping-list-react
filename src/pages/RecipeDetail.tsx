import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, Minus } from 'lucide-react';
import { useRecipeStore } from '../features/recipes/recipeStore';
import { useProductStore } from '../features/ingredients/productStore';
import { UNITS } from '../constants/units';
import { useTranslation } from '../i18n';
import type { Recipe, Ingredient } from '../types';

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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <button onClick={() => navigate('/recipes')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)' }}>
                    <ArrowLeft size={20} />
                    <span>{t.common.cancel}</span>
                </button>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {!isNew && (
                        <button onClick={handleDelete} style={{ color: 'var(--color-danger-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-2)' }}>
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)', cursor: 'pointer' }}>
                        <Save size={20} />
                        <span>{t.common.save}</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Informations de base */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)' }}>{t.recipes.form.titlePlaceholder}</label>
                        <input
                            type="text"
                            value={recipe.title}
                            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 'var(--text-lg)' }}
                            placeholder={t.recipes.form.titlePlaceholder}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)' }}>{t.recipes.form.prepTime}</label>
                            <input
                                type="number"
                                value={recipe.prepTime}
                                onChange={(e) => setRecipe({ ...recipe, prepTime: parseInt(e.target.value) || 0 })}
                                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)' }}>{t.recipes.form.servings}</label>
                            <input
                                type="number"
                                value={recipe.servings}
                                onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })}
                                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Ingrédients */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>{t.recipes.ingredients}</h3>
                        <button onClick={addIngredient} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Plus size={16} /> {t.recipes.form.addIngredient}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {recipe.ingredients?.map((ing, index) => (
                            <div key={ing.id} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                {/* Sélection du produit */}
                                <select
                                    value={ing.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    style={{ flex: 2, padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
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
                                    style={{ width: '80px', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                />

                                {/* Sélection de l'unité */}
                                <select
                                    value={ing.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    style={{ width: '120px', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                >
                                    {UNITS.map(u => (
                                        <option key={u.value} value={u.value}>{u.label}</option>
                                    ))}
                                </select>

                                <button onClick={() => removeIngredient(index)} style={{ color: 'var(--color-danger-500)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                <div style={{ backgroundColor: 'var(--bg-card)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>{t.recipes.steps}</h3>
                        <button onClick={addStep} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Plus size={16} /> {t.recipes.form.addStep}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {recipe.steps?.map((step, index) => (
                            <div key={index} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'start' }}>
                                <span style={{ padding: 'var(--space-2)', color: 'var(--text-muted)', fontWeight: 'bold' }}>{index + 1}.</span>
                                <textarea
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    placeholder={t.recipes.form.stepPlaceholder}
                                    style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', minHeight: '60px', resize: 'vertical' }}
                                />
                                <button onClick={() => removeStep(index)} style={{ color: 'var(--color-danger-500)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 'var(--space-2)' }}>
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
