import Layout from '../components/Layout';
import { useAuth } from '../store/authStore';

export default function Profile() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="profile-page">
        <h1>הפרופיל שלי</h1>
        <div className="profile-card">
          <p><strong>שם:</strong> {user?.name}</p>
          <p><strong>אימייל:</strong> {user?.email}</p>
          <p><strong>מנוי:</strong> {user?.plan}</p>
        </div>
      </div>
    </Layout>
  );
}
