import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import MovieRow from '../components/MovieRow';
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
