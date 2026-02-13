import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { moviesApi } from '../services/api';

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    moviesApi.get(id)
      .then((m) => {
        setMovie(m);
        setFavorite(m.isFavorite);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (favorite) await moviesApi.removeFavorite(id);
      else await moviesApi.addFavorite(id);
      setFavorite(!favorite);
    } catch (_) {}
  };

  if (loading) {
    return (
      <Layout>
        <div className="movie-page-skeleton">
          <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="error-state">
          <h2>{error || 'סרט לא נמצא'}</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="movie-page">
        <div className="movie-hero">
          <img src={movie.posterUrl || '/placeholder.png'} alt={movie.title} className="poster" />
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="meta">{movie.year} • {movie.genres?.join(', ')}</p>
            <p>{movie.description}</p>
            <div className="actions">
              <button className="btn btn-primary" onClick={toggleFavorite}>
                {favorite ? '✓ ברשימה' : '+ הרשימה שלי'}
              </button>
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  טריילר
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
