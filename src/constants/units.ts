export const UNITS = [
    { value: 'unité', label: 'Unité' },
    { value: 'g', label: 'Grammes (g)' },
    { value: 'kg', label: 'Kilogrammes (kg)' },
    { value: 'ml', label: 'Millilitres (ml)' },
    { value: 'cl', label: 'Centilitres (cl)' },
    { value: 'l', label: 'Litres (l)' },
    { value: 'c.à.s', label: 'Cuillère à soupe' },
    { value: 'c.à.c', label: 'Cuillère à café' },
    { value: 'pincée', label: 'Pincée' },
    { value: 'tranche', label: 'Tranche' },
    { value: 'boîte', label: 'Boîte' },
] as const;

export type UnitType = typeof UNITS[number]['value'];
