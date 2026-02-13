import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { moviesApi } from '../services/api';
import { useAuth } from '../store/authStore';
import { getDemoMovie, getDemoMovies } from '../data/demoMovies';

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    moviesApi.get(id)
      .then((m) => {
        setMovie(m);
        setFavorite(m.isFavorite);
        return moviesApi.list({ plan: user?.plan || 'basic', limit: 6 }).catch(() => ({ movies: [] }));
      })
      .then((r) => setSimilar(r.movies?.filter((m) => m._id !== id) || []))
      .catch(() => {
        const demo = getDemoMovie(id);
        if (demo) {
          setMovie(demo);
          setSimilar(getDemoMovies(user?.plan).filter((m) => m._id !== id));
        } else {
          setError('סרט לא נמצא');
        }
      })
      .finally(() => setLoading(false));
  }, [id, user?.plan]);

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
        <div className="movie-detail movie-detail--loading">
          <div className="skeleton movie-detail__hero-skeleton" />
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="movie-detail movie-detail--error">
          <h2>{error || 'סרט לא נמצא'}</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="movie-detail animate-fade-in">
        <div className="movie-detail__hero">
          <div
            className="movie-detail__hero-bg"
            style={{ backgroundImage: `url(${movie.posterUrl || '/placeholder.png'})` }}
          />
          <div className="movie-detail__hero-overlay" />
          <div className="movie-detail__hero-content">
            <h1 className="movie-detail__title">{movie.title}</h1>
            <p className="movie-detail__meta">
              {movie.year && <span>{movie.year}</span>}
              {movie.genres?.length > 0 && <span> • {movie.genres.join(', ')}</span>}
            </p>
            <p className="movie-detail__desc">{movie.description}</p>
            <div className="movie-detail__actions">
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

        {similar.length > 0 && (
          <section className="movie-detail__similar">
            <h2>סרטים דומים</h2>
            <div className="movie-detail__similar-row">
              {similar.map((m) => (
                <Link key={m._id} to={`/movie/${m._id}`} className="netflix-card">
                  <div className="netflix-card__img-wrap">
                    <img src={m.posterUrl || '/placeholder.png'} alt={m.title} />
                    <div className="netflix-card__overlay">
                      <span className="netflix-card__title">{m.title}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
