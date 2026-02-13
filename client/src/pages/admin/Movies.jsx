import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { adminApi } from '../../services/api';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', year: '', genres: [], posterUrl: '', trailerUrl: '', availabilityPlans: ['basic'] });

  useEffect(() => {
    adminApi.movies()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      const data = { ...form, genres: typeof form.genres === 'string' ? form.genres.split(',').map(g => g.trim()) : form.genres };
      if (editing) {
        await adminApi.updateMovie(editing._id, data);
        setMovies((m) => m.map((x) => (x._id === editing._id ? { ...x, ...data } : x)));
      } else {
        const created = await adminApi.createMovie(data);
        setMovies((m) => [created, ...m]);
      }
      setEditing(null);
      setForm({ title: '', description: '', year: '', genres: [], posterUrl: '', trailerUrl: '', availabilityPlans: ['basic'] });
    } catch (_) {}
  };

  const del = async (id) => {
    if (!confirm('למחוק?')) return;
    try {
      await adminApi.deleteMovie(id);
      setMovies((m) => m.filter((x) => x._id !== id));
    } catch (_) {}
  };

  return (
    <Layout>
      <div className="admin-movies">
        <h1>ניהול סרטים</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ title: '', description: '', year: '', genres: [], posterUrl: '', trailerUrl: '', availabilityPlans: ['basic'] }); }}>
          הוסף סרט
        </button>
        {loading ? (
          <p>טוען...</p>
        ) : (
          <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>כותרת</th>
                <th>שנה</th>
                <th>תוכניות</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.year}</td>
                  <td>{(m.availabilityPlans || []).join(', ')}</td>
                  <td>
                    <button onClick={() => { setEditing(m); setForm(m); }}>עריכה</button>
                    <button onClick={() => del(m._id)}>מחיקה</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        {editing !== null && (
          <div className="modal">
            <h3>{editing ? 'עריכת סרט' : 'סרט חדש'}</h3>
            <input placeholder="כותרת" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="שנה" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            <input placeholder="תיאור" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="ז'אנרים (מופרדים בפסיק)" value={Array.isArray(form.genres) ? form.genres.join(', ') : form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} />
            <input placeholder="posterUrl" value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
            <input placeholder="trailerUrl" value={form.trailerUrl} onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })} />
            <input placeholder="availabilityPlans (basic,platinum,diamond)" value={(form.availabilityPlans || []).join(',')} onChange={(e) => setForm({ ...form, availabilityPlans: e.target.value.split(',').map(p => p.trim()).filter(Boolean) })} />
            <div>
              <button className="btn btn-primary" onClick={save}>שמור</button>
              <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
