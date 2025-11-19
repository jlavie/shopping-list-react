import React, { useState } from 'react';
import { Plus, Trash2, Check, RefreshCw } from 'lucide-react';
import { useShoppingListStore } from './shoppingListStore';
import { useTranslation } from '../../i18n';
import { getStartOfWeek, formatDate } from '../../utils/dateUtils';

export const ShoppingListView: React.FC = () => {
    const { items, addItem, removeItem, toggleItem, generateFromMenu, clearList } = useShoppingListStore();
    const { t } = useTranslation();
    const [newItemName, setNewItemName] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            addItem({
                name: newItemName,
                quantity: 1,
                unit: 'unité'
            });
            setNewItemName('');
        }
    };

    const handleGenerate = () => {
        if (confirm(t.shopping.generateConfirm)) {
            const start = getStartOfWeek(new Date());
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            generateFromMenu(formatDate(start), formatDate(end));
        }
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
                    {t.shopping.title}
                </h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        onClick={handleGenerate}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-2) var(--space-4)',
                            backgroundColor: 'var(--color-primary-50)',
                            color: 'var(--color-primary-700)',
                            border: '1px solid var(--color-primary-200)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 'var(--font-weight-medium)'
                        }}
                    >
                        <RefreshCw size={18} />
                        <span>{t.shopping.generate}</span>
                    </button>
                    <button
                        onClick={() => { if (confirm(t.shopping.clearConfirm)) clearList(); }}
                        title={t.shopping.clear}
                        style={{
                            padding: 'var(--space-2)',
                            color: 'var(--color-danger-500)',
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer'
                        }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Ajout manuel */}
            <form onSubmit={handleAddItem} style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={t.shopping.addItemPlaceholder}
                    style={{
                        flex: 1,
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: 'var(--text-base)'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: '0 var(--space-4)',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={24} />
                </button>
            </form>

            {/* Liste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {items.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                        {t.shopping.empty}
                    </p>
                )}
                {items.map((item) => (
                    <div key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 'var(--space-3)',
                        backgroundColor: item.checked ? 'var(--color-slate-50)' : 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        opacity: item.checked ? 0.6 : 1,
                        transition: 'all 0.2s'
                    }}>
                        <button
                            onClick={() => toggleItem(item.id)}
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: `2px solid ${item.checked ? 'var(--primary)' : 'var(--color-slate-300)'}`,
                                backgroundColor: item.checked ? 'var(--primary)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                marginRight: 'var(--space-3)',
                                color: 'white'
                            }}
                        >
                            {item.checked && <Check size={14} />}
                        </button>

                        <span style={{
                            flex: 1,
                            textDecoration: item.checked ? 'line-through' : 'none',
                            fontWeight: item.checked ? 'normal' : 'var(--font-weight-medium)'
                        }}>
                            {item.name}
                        </span>

                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginRight: 'var(--space-3)' }}>
                            {item.quantity} {item.unit}
                        </span>

                        <button
                            onClick={() => removeItem(item.id)}
                            style={{
                                color: 'var(--color-slate-400)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
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
