import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';
import { useProductStore } from '../features/ingredients/productStore';
import type { Product } from '../features/ingredients/productStore';
import { UNITS } from '../constants/units';
import { useTranslation } from '../i18n';
import './ProductList.css';

export const ProductList: React.FC = () => {
    const { products, addProduct, updateProduct, removeProduct } = useProductStore();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});

    const handleAddNew = () => {
        setIsEditing('new');
        setEditForm({ name: '', defaultUnit: 'unité' });
    };

    const handleEdit = (product: Product) => {
        setIsEditing(product.id);
        setEditForm(product);
    };

    const handleSave = () => {
        if (!editForm.name) return;

        if (isEditing === 'new') {
            addProduct(editForm as Omit<Product, 'id'>);
        } else if (isEditing) {
            updateProduct(isEditing, editForm);
        }
        setIsEditing(null);
        setEditForm({});
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditForm({});
    };

    return (
        <div className="product-list">
            <div className="product-list__header">
                <h2 className="product-list__title">
                    {t.products.title}
                </h2>
                <button
                    onClick={handleAddNew}
                    disabled={isEditing !== null}
                    className="product-list__add-btn"
                >
                    <Plus size={20} />
                    <span>{t.products.add}</span>
                </button>
            </div>

            {/* Formulaire d'ajout/édition */}
            {isEditing && (
                <div className="product-list__form">
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder={t.products.form.namePlaceholder}
                        autoFocus
                        className="product-list__input"
                    />
                    <select
                        value={editForm.defaultUnit}
                        onChange={(e) => setEditForm({ ...editForm, defaultUnit: e.target.value })}
                        className="product-list__select"
                    >
                        {UNITS.map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                    </select>
                    <button onClick={handleSave} className="product-list__action-btn product-list__save-btn">
                        <Save size={20} />
                    </button>
                    <button onClick={handleCancel} className="product-list__action-btn product-list__cancel-btn">
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Liste */}
            <div className="product-list__items">
                {products.length === 0 && !isEditing && (
                    <p className="product-list__empty">
                        {t.products.empty}
                    </p>
                )}
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <span className="product-item__name">{product.name}</span>
                        <span className="product-item__unit">
                            {UNITS.find(u => u.value === product.defaultUnit)?.label || product.defaultUnit}
                        </span>
                        <button
                            onClick={() => handleEdit(product)}
                            disabled={isEditing !== null}
                            className="product-list__action-btn product-item__edit-btn"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => { if (confirm(t.common.confirm + ' ?')) removeProduct(product.id); }}
                            disabled={isEditing !== null}
                            className="product-list__action-btn product-item__delete-btn"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
