import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { moviesApi } from '../services/api';
import { userApi } from '../services/api';
import { useAuth } from '../store/authStore';

export default function Home() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Layout>
        <div className="home-skeleton">
          <div className="skeleton" style={{ height: 200, marginBottom: 20 }} />
          <div className="movie-row">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="skeleton movie-card" style={{ width: 180, height: 270 }} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="home">
        <h1>שלום, {user?.name}</h1>
        <p className="plan-badge">מנוי {user?.plan}</p>
        {continueWatching.length > 0 && (
          <section>
            <h2>המשך צפייה</h2>
            <div className="movie-row">
              {continueWatching.map(({ movie, progressSeconds }) => (
                <Link key={movie?._id} to={`/movie/${movie?._id}`} className="movie-card">
                  <img src={movie?.posterUrl || '/placeholder.png'} alt={movie?.title} />
                  <span className="progress">{Math.round((progressSeconds || 0) / 60)} דקות</span>
                </Link>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2>סרטים עבורך</h2>
          {movies.length === 0 ? (
            <p className="empty-state">אין סרטים זמינים במנוי שלך. עדכן את המנוי או חפש.</p>
          ) : (
            <div className="movie-row">
              {movies.map((m) => (
                <Link key={m._id} to={`/movie/${m._id}`} className="movie-card">
                  <img src={m.posterUrl || '/placeholder.png'} alt={m.title} loading="lazy" />
                  <span className="title">{m.title}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
