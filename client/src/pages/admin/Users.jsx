import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { adminApi } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.users()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const updateUser = async (id, data) => {
    try {
      const updated = await adminApi.updateUser(id, data);
      setUsers((u) => u.map((x) => (x._id === id ? updated : x)));
    } catch (_) {}
  };

  return (
    <Layout>
      <div className="admin-users">
        <h1>ניהול משתמשים</h1>
        {loading ? (
          <p>טוען...</p>
        ) : (
          <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>אימייל</th>
                <th>תפקיד</th>
                <th>מנוי</th>
                <th>סטטוס</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => updateUser(u._id, { role: e.target.value })}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="content_admin">content_admin</option>
                    </select>
                  </td>
                  <td>
                    <select value={u.plan} onChange={(e) => updateUser(u._id, { plan: e.target.value })}>
                      <option value="basic">basic</option>
                      <option value="platinum">platinum</option>
                      <option value="diamond">diamond</option>
                    </select>
                  </td>
                  <td>
                    <select value={u.status} onChange={(e) => updateUser(u._id, { status: e.target.value })}>
                      <option value="active">active</option>
                      <option value="blocked">blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
