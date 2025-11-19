import React from 'react';
import { ShoppingListView } from '../features/shopping/ShoppingListView';
import './ShoppingList.css';

export const ShoppingList: React.FC = () => {
    return (
        <div className="shopping-list-page">
            <ShoppingListView />
        </div>
    );
};
