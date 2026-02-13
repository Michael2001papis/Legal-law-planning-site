import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

const TERMS_VERSION = '1.0';

export default function Disclaimer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    localStorage.setItem('disclaimerVersion', TERMS_VERSION);
    navigate(user ? '/home' : '/auth/login');
  };

  const handleExit = () => {
    window.close();
    window.location.href = 'about:blank';
  };

  return (
    <div className="disclaimer-page">
      <div className="disclaimer-card">
        <h1>הודעת שימוש חשובה – אתר לימודי</h1>
        <div className="disclaimer-text">
          <p>האתר "עולם הסרטים של MP" הינו פרויקט לצורכי לימוד והדגמה בלבד.</p>
          <p>האתר אינו שירות ציבורי ואינו שירות מסחרי.</p>
          <p>ייתכן שמוצגים בו תכנים או נתונים לדוגמה בלבד.</p>
          <p><strong>בהמשך השימוש באתר אתה מאשר שהבנת והסכמת לכך.</strong></p>
        </div>
        <div className="disclaimer-actions">
          <button className="btn btn-primary" onClick={handleAccept}>
            מאשר וממשיך
          </button>
          <button className="btn btn-outline" onClick={handleExit}>
            יציאה
          </button>
        </div>
      </div>
    </div>
  );
}
