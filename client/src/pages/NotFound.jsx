import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>הדף המבוקש לא נמצא</p>
      <Link to="/home" className="btn btn-primary">חזרה לדף הבית</Link>
    </div>
  );
}
