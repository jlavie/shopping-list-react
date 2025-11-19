import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';
import { useProductStore } from '../features/ingredients/productStore';
import type { Product } from '../features/ingredients/productStore';
import { UNITS } from '../constants/units';
import { useTranslation } from '../i18n';

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
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-6)'
            }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                    {t.products.title}
                </h2>
                <button
                    onClick={handleAddNew}
                    disabled={isEditing !== null}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-4)',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        cursor: isEditing ? 'not-allowed' : 'pointer',
                        opacity: isEditing ? 0.5 : 1,
                        fontWeight: 'var(--font-weight-medium)'
                    }}
                >
                    <Plus size={20} />
                    <span>{t.products.add}</span>
                </button>
            </div>

            {/* Formulaire d'ajout/édition */}
            {isEditing && (
                <div style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    gap: 'var(--space-2)',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder={t.products.form.namePlaceholder}
                        autoFocus
                        style={{ flex: 2, padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                    <select
                        value={editForm.defaultUnit}
                        onChange={(e) => setEditForm({ ...editForm, defaultUnit: e.target.value })}
                        style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    >
                        {UNITS.map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                    </select>
                    <button onClick={handleSave} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Save size={20} />
                    </button>
                    <button onClick={handleCancel} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Liste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {products.length === 0 && !isEditing && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                        {t.products.empty}
                    </p>
                )}
                {products.map((product) => (
                    <div key={product.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 'var(--space-3)',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <span style={{ flex: 1, fontWeight: 'var(--font-weight-medium)' }}>{product.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginRight: 'var(--space-4)' }}>
                            {UNITS.find(u => u.value === product.defaultUnit)?.label || product.defaultUnit}
                        </span>
                        <button
                            onClick={() => handleEdit(product)}
                            disabled={isEditing !== null}
                            style={{
                                color: 'var(--primary)',
                                background: 'none',
                                border: 'none',
                                cursor: isEditing ? 'not-allowed' : 'pointer',
                                marginRight: 'var(--space-2)',
                                opacity: isEditing ? 0.3 : 1
                            }}
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => { if (confirm(t.common.confirm + ' ?')) removeProduct(product.id); }}
                            disabled={isEditing !== null}
                            style={{
                                color: 'var(--color-danger-500)',
                                background: 'none',
                                border: 'none',
                                cursor: isEditing ? 'not-allowed' : 'pointer',
                                opacity: isEditing ? 0.3 : 1
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
