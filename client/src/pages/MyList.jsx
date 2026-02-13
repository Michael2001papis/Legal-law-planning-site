import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { userApi } from '../services/api';

export default function MyList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.myList()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="my-list-page">
        <h1>הרשימה שלי</h1>
        {loading ? (
          <div className="movie-row">
            {[1,2,3,4].map((i) => (
              <div key={i} className="skeleton movie-card" style={{ width: 180, height: 270 }} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <p className="empty-state">אין סרטים ברשימה. הוסף מסרטים.</p>
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
      </div>
    </Layout>
  );
}
