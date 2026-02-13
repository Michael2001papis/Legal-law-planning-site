import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../store/authStore';

const TERMS_VERSION = '1.0';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user, navigate]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const termsAcceptedAt = new Date().toISOString();
      const data = await authApi.register({
        name,
        email,
        password,
        termsAcceptedAt,
        termsVersion: TERMS_VERSION,
      });
      setAuth(data.user, data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>הרשמה</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="שם מלא"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="סיסמה (לפחות 6 תווים)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'נרשם...' : 'הרשמה'}
          </button>
        </form>
        <p>
          כבר יש חשבון? <Link to="/auth/login">התחברות</Link>
        </p>
        <Link to="/pricing">תשלומי מנוי</Link>
      </div>
    </div>
  );
}
