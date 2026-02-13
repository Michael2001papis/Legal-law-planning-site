import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { userApi } from '../services/api';
import { useAuth } from '../store/authStore';
import { getPlanPolicy } from '../services/planPolicy';

export default function Devices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.devices()
      .then(setDevices)
      .catch(() => setDevices([]))
      .finally(() => setLoading(false));
  }, []);

  const policy = getPlanPolicy(user?.plan);
  const maxDevices = policy?.maxDevices ?? 1;

  const removeDevice = async (deviceId) => {
    try {
      await userApi.removeDevice(deviceId);
      setDevices((d) => d.filter((x) => x.deviceId !== deviceId));
    } catch (_) {}
  };

  return (
    <Layout>
      <div className="devices-page">
        <h1>מכשירים מחוברים</h1>
        <p>מגבלת מכשירים: {maxDevices === Infinity ? 'ללא הגבלה' : maxDevices}</p>
        {loading ? (
          <div className="skeleton" style={{ height: 100 }} />
        ) : devices.length === 0 ? (
          <p className="empty-state">אין מכשירים מחוברים.</p>
        ) : (
          <ul className="devices-list">
            {devices.map((d) => (
              <li key={d.deviceId}>
                <span>{d.deviceName || d.deviceId}</span>
                <span>{new Date(d.lastSeen).toLocaleString('he-IL')}</span>
                <button className="btn btn-outline" onClick={() => removeDevice(d.deviceId)}>
                  נתק
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
