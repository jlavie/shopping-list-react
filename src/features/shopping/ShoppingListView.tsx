import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useShoppingListStore } from './shoppingListStore';
import { useTranslation } from '../../i18n';
import './ShoppingListView.css';

export const ShoppingListView: React.FC = () => {
    const { items, addItem, toggleItem, removeItem, clearList } = useShoppingListStore();
    const [newItemName, setNewItemName] = useState('');
    const { t } = useTranslation();

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            addItem({
                name: newItemName.trim(),
                quantity: 1,
                unit: 'unité',
                generated: false
            });
            setNewItemName('');
        }
    };

    const handleClearList = () => {
        if (confirm(t.shopping.clearConfirm)) {
            clearList();
        }
    };

    return (
        <div className="shopping-list">
            <div className="shopping-list__header">
                <h2 className="shopping-list__title">
                    {t.shopping.title}
                </h2>
                <div className="shopping-list__actions">
                    {items.length > 0 && (
                        <button
                            onClick={handleClearList}
                            className="shopping-list__action-btn shopping-list__action-btn--danger"
                            title={t.shopping.clear}
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={handleAddItem} className="shopping-list__input-group">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={t.shopping.addItemPlaceholder}
                    className="shopping-list__input"
                />
                <button type="submit" className="shopping-list__add-btn">
                    <Plus size={20} />
                    <span>{t.common.add}</span>
                </button>
            </form>

            <div className="shopping-list__items">
                {items.length === 0 && (
                    <p className="shopping-list__empty">
                        {t.shopping.empty}
                    </p>
                )}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`shopping-list__item ${item.checked ? 'shopping-list__item--checked' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                            className="shopping-list__checkbox"
                        />
                        <div className="shopping-list__item-content">
                            <span className={`shopping-list__item-name ${item.checked ? 'shopping-list__item-name--checked' : ''}`}>
                                {item.name}
                            </span>
                            <span className="shopping-list__item-quantity">
                                {item.quantity} {item.unit}
                            </span>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="shopping-list__delete-btn"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
