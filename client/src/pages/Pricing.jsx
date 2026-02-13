import { Link } from 'react-router-dom';

const plans = [
  { id: 'basic', name: 'Basic', devices: 1, desc: 'קטלוג מצומצם, מכשיר אחד' },
  { id: 'platinum', name: 'Platinum', devices: 3, desc: 'קטלוג רחב, עד 3 מכשירים' },
  { id: 'diamond', name: 'Diamond', devices: '∞', desc: 'כל התוכן, ללא הגבלה' },
];

export default function Pricing() {
  return (
    <div className="auth-page">
      <div className="pricing-card">
        <h1>תוכניות מנוי</h1>
        <div className="pricing-grid">
          {plans.map((p) => (
            <div key={p.id} className="plan-card">
              <h2>{p.name}</h2>
              <p className="devices">{p.devices} מכשירים</p>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
        <Link to="/auth/login" className="btn btn-primary">התחבר</Link>
      </div>
    </div>
  );
}
