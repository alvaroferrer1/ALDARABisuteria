import { createPersistedListStore } from "./persistedListStore";

export const recentlyViewedStore = createPersistedListStore("aldara_recently_viewed", 12);
export const useRecentlyViewed = recentlyViewedStore.useList;
