import { createPersistedListStore } from "./persistedListStore";

// Máximo 4 piezas a comparar a la vez — más de eso, la tabla deja de ser legible.
export const compareStore = createPersistedListStore("aldara_compare", 4);
export const useCompare = compareStore.useList;
