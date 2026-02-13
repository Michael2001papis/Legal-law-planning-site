import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import MovieRow from '../components/MovieRow';
import { userApi } from '../services/api';
import { getDemoMovies } from '../data/demoMovies';
import { isDemoUser } from '../utils/isDemo';

export default function MyList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDemoFavorites = () => {
    try {
      const ids = JSON.parse(localStorage.getItem('demo-favorites') || '[]');
      const all = getDemoMovies('diamond');
      setMovies(all.filter((m) => ids.includes(m._id)));
    } catch {
      setMovies([]);
    }
  };

  useEffect(() => {
    if (isDemoUser()) {
      loadDemoFavorites();
      setLoading(false);
      return;
    }
    userApi.myList()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => isDemoUser() && loadDemoFavorites();
    window.addEventListener('favorites-updated', handler);
    return () => window.removeEventListener('favorites-updated', handler);
  }, []);

  return (
    <Layout>
      <div className="my-list-page animate-fade-in">
        <h1>הרשימה שלי</h1>
        {loading ? (
          <div className="skeleton netflix-row__skeleton" style={{ margin: '0 48px' }} />
        ) : movies.length === 0 ? (
          <p className="empty-state">אין סרטים ברשימה. הוסף מסרטים.</p>
        ) : (
          <MovieRow title="המועדפים שלי" items={movies} />
        )}
      </div>
    </Layout>
  );
}
