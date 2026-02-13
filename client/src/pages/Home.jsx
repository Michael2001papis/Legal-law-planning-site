import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import MovieRow from '../components/MovieRow';
import { moviesApi } from '../services/api';
import { userApi } from '../services/api';
import { useAuth } from '../store/authStore';

export default function Home() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const plan = user?.plan || 'basic';
        const [moviesRes, cwRes] = await Promise.all([
          moviesApi.list({ plan, limit: 24 }),
          userApi.continueWatching().catch(() => ({})),
        ]);
        setMovies(moviesRes.movies || []);
        setContinueWatching(Array.isArray(cwRes) ? cwRes : []);
      } catch (_) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.plan]);

  const heroBg = movies[0]?.posterUrl || null;

  if (loading) {
    return (
      <Layout>
        <div className="home home--loading">
          <div className="hero hero--skeleton">
            <div className="skeleton hero__skeleton" />
          </div>
          <div className="home__rows">
            <div className="skeleton netflix-row__skeleton" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="home">
        <section className="hero hero--home animate-fade-in" ref={heroRef}>
          <div className="hero__bg" style={heroBg ? { backgroundImage: `url(${heroBg})` } : {}} />
          <div className="hero__overlay" />
          <div className="hero__content">
            <h1 className="hero__title">
              שלום, <span className="hero__title-accent">{user?.name}</span>
            </h1>
            <p className="hero__subtitle">גלה סרטים חדשים במנוי {user?.plan}. צפה עכשיו.</p>
            <div className="hero__actions">
              <Link to="/search" className="btn btn-primary btn--hero">
                גלה סרטים
              </Link>
              <span className="hero__badge">מנוי {user?.plan}</span>
            </div>
          </div>
        </section>

        <div className="home__rows">
          {continueWatching.length > 0 && (
            <MovieRow title="המשך צפייה" items={continueWatching} showProgress />
          )}
          {movies.length > 0 && (
            <MovieRow title="סרטים עבורך" items={movies} />
          )}
          {movies.length === 0 && continueWatching.length === 0 && (
            <div className="home__empty animate-fade-in">
              <h2>אין תוכן זמין</h2>
              <p>עדכן את המנוי או חפש סרטים.</p>
              <Link to="/search" className="btn btn-primary">חיפוש</Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
