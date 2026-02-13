import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { moviesApi } from '../services/api';
import { useAuth } from '../store/authStore';

export default function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query && !genre) {
      setMovies([]);
      return;
    }
    setLoading(true);
    moviesApi.list({ query: query || undefined, genre: genre || undefined, plan: user?.plan })
      .then((r) => setMovies(r.movies || []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [query, genre, user?.plan]);

  return (
    <Layout>
      <div className="search-page">
        <h1>חיפוש</h1>
        <div className="search-bar">
          <input
            type="search"
            placeholder="חפש סרט..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">כל הז'אנרים</option>
            <option value="דרמה">דרמה</option>
            <option value="קומדיה">קומדיה</option>
            <option value="אקשן">אקשן</option>
            <option value="מדע בדיוני">מדע בדיוני</option>
          </select>
        </div>
        {loading && <p>טוען...</p>}
        <div className="movie-row">
          {movies.map((m) => (
            <Link key={m._id} to={`/movie/${m._id}`} className="movie-card">
              <img src={m.posterUrl || '/placeholder.png'} alt={m.title} loading="lazy" />
              <span className="title">{m.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
