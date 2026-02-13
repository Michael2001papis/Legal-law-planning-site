import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MovieRow from '../components/MovieRow';
import { moviesApi } from '../services/api';
import { useAuth } from '../store/authStore';
import { getDemoMovies } from '../data/demoMovies';
import { isDemoUser } from '../utils/isDemo';

export default function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoUser()) {
      setLoading(true);
      let demo = getDemoMovies(user?.plan);
      if (query) demo = demo.filter((m) => m.title?.toLowerCase().includes(query.toLowerCase()));
      if (genre) demo = demo.filter((m) => m.genres?.includes(genre));
      setMovies(demo);
      setLoading(false);
      return;
    }
    if (!query && !genre) {
      setMovies([]);
      return;
    }
    setLoading(true);
    moviesApi.list({ query: query || undefined, genre: genre || undefined, plan: user?.plan })
      .then((r) => setMovies(r.movies || []))
      .catch(() => {
        let demo = getDemoMovies(user?.plan);
        if (query) demo = demo.filter((m) => m.title?.toLowerCase().includes(query.toLowerCase()));
        if (genre) demo = demo.filter((m) => m.genres?.includes(genre));
        setMovies(demo);
      })
      .finally(() => setLoading(false));
  }, [query, genre, user?.plan]);

  return (
    <Layout>
      <div className="search-page animate-fade-in">
        <h1>חיפוש</h1>
        <div className="search-bar">
          <input
            type="search"
            placeholder="חפש סרט..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="search-bar__genre-wrap">
            <select
              className="search-bar__select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">כל הז'אנרים</option>
              <option value="דרמה">דרמה</option>
              <option value="קומדיה">קומדיה</option>
              <option value="אקשן">אקשן</option>
              <option value="מדע בדיוני">מדע בדיוני</option>
              <option value="רומנטי">רומנטי</option>
              <option value="מתח">מתח</option>
            </select>
          </div>
        </div>
        {loading && <p className="search-loading">טוען...</p>}
        {movies.length > 0 && <MovieRow title={query || genre ? "תוצאות" : "כל הסרטים"} items={movies} />}
        {!loading && !isDemoUser() && !query && !genre && (
          <p className="empty-state">התחל לחפש סרטים</p>
        )}
        {!loading && (query || genre) && movies.length === 0 && (
          <p className="empty-state">לא נמצאו תוצאות</p>
        )}
      </div>
    </Layout>
  );
}
