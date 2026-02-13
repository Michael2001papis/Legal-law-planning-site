import { useState, useCallback } from 'react';
import { isDemoUser } from '../utils/isDemo';
import { moviesApi } from '../services/api';

const DEMO_FAV_KEY = 'demo-favorites';

function loadDemoFavorites() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_FAV_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favIds, setFavIds] = useState(loadDemoFavorites);

  const toggleFavorite = useCallback(async (movieId, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isDemoUser()) {
      setFavIds((p) => {
        const next = p.includes(movieId) ? p.filter((x) => x !== movieId) : [...p, movieId];
        localStorage.setItem(DEMO_FAV_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('favorites-updated'));
        return next;
      });
      return;
    }
    try {
      const has = favIds.includes(movieId);
      if (has) await moviesApi.removeFavorite(movieId);
      else await moviesApi.addFavorite(movieId);
      setFavIds((p) => (has ? p.filter((x) => x !== movieId) : [...p, movieId]));
    } catch (_) {}
  }, [favIds]);

  const isFavorite = useCallback((id) => favIds.includes(id), [favIds]);

  return { isFavorite, toggleFavorite };
}
