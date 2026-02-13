import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>לוח בקרה</h1>
        <nav>
          <Link to="/admin/movies">ניהול סרטים</Link>
          <Link to="/admin/users">ניהול משתמשים</Link>
        </nav>
      </div>
    </Layout>
  );
}
