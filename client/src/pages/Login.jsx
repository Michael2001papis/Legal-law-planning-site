import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../store/authStore';

export default function Login() {
  const { user, setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user, navigate]);

  const DEMO_ACCOUNTS = {
    'abc@abc.com': { password: 'abc123', user: { _id: 'demo1', name: 'משתמש רגיל', email: 'abc@abc.com', plan: 'basic', role: 'user' } },
    'prim@abc.com': { password: 'P123', user: { _id: 'demo2', name: 'משתמש פרימיום', email: 'prim@abc.com', plan: 'platinum', role: 'user' } },
    'd@abc.com': { password: 'D123', user: { _id: 'demo3', name: 'משתמש דיימונד', email: 'D@abc.com', plan: 'diamond', role: 'user' } },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const demo = DEMO_ACCOUNTS[email?.toLowerCase()?.trim()];
      if (demo && demo.password === password) {
        setAuth(demo.user, 'demo');
        navigate('/home');
        return;
      }
      const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);
      const data = await authApi.login(email, password, deviceId, navigator.userAgent);
      setAuth(data.user, data.accessToken);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>התחברות</h1>
        <form onSubmit={handleSubmit}>
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
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        <p>
          אין לך חשבון? <Link to="/auth/register">הרשמה</Link>
        </p>
        <Link to="/pricing">תשלומי מנוי</Link>
        <div className="auth-demo">
          <p className="auth-demo-title">בלי שרת? השתמש ב:</p>
          <p className="auth-demo-creds">abc@abc.com / abc123 · prim@abc.com / P123 · D@abc.com / D123</p>
          <button type="button" className="btn-demo" onClick={() => { setAuth({ _id: 'demo', name: 'משתמש דמו', email: 'demo@mp.com', plan: 'diamond', role: 'user' }, 'demo'); navigate('/home'); }}>
            כניסה ישירה לדמו
          </button>
        </div>
      </div>
    </div>
  );
}
