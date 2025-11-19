import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    defaultUnit: string;
    category?: string;
}

interface ProductState {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    removeProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            products: [],
            addProduct: (product) => set((state) => ({
                products: [...state.products, { ...product, id: crypto.randomUUID() }]
            })),
            updateProduct: (id, updatedProduct) => set((state) => ({
                products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
            })),
            removeProduct: (id) => set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            })),
        }),
        {
            name: 'product-storage',
        }
    )
);
