import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function MovieRow({ title, items, showProgress }) {
  const rowRef = useRef(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const scroll = (dir) => {
    if (!rowRef.current) return;
    const amt = 400 * (document.documentElement.dir === 'rtl' ? -1 : 1);
    rowRef.current.scrollBy({ left: dir * amt, behavior: 'smooth' });
  };

  if (!items?.length) return null;

  return (
    <section className="netflix-row animate-fade-in">
      <div className="netflix-row__header">
        <h2 className="netflix-row__title">{title}</h2>
        <div className="netflix-row__arrows">
          <button onClick={() => scroll(1)} aria-label="הבא">‹</button>
          <button onClick={() => scroll(-1)} aria-label="הקודם">›</button>
        </div>
      </div>
      <div className="netflix-row__track" ref={rowRef}>
        {items.map((item) => {
          const movie = item.movie || item;
          const progress = item.progressSeconds;
          const fav = isFavorite(movie._id) || item.isFavorite || movie.isFavorite;
          return (
            <div key={movie._id} className="netflix-card">
              <Link to={`/movie/${movie._id}`} className="netflix-card__link">
                <div className="netflix-card__img-wrap">
                  <img src={movie.posterUrl || '/placeholder.png'} alt={movie.title} loading="lazy" />
                  <div className="netflix-card__overlay">
                    <div className="netflix-card__actions">
                      <button
                        type="button"
                        className={`netflix-card__btn ${fav ? 'is-favorite' : ''}`}
                        onClick={(e) => toggleFavorite(movie._id, e)}
                        title={fav ? 'הסר מרשימה' : 'הוסף למועדפים'}
                        aria-label={fav ? 'הסר מרשימה' : 'הוסף למועדפים'}
                      >
                        {fav ? '✓' : '+'}
                      </button>
                      <Link
                        to={`/movie/${movie._id}`}
                        className="netflix-card__btn netflix-card__btn--play"
                        title="צפייה"
                        aria-label="צפייה"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ▶
                      </Link>
                      <button
                        type="button"
                        className="netflix-card__btn netflix-card__btn--disabled"
                        title="הורדה לא זמינה"
                        disabled
                        aria-label="הורדה"
                      >
                        ⬇
                      </button>
                    </div>
                    <span className="netflix-card__title">{movie.title}</span>
                    {movie.year && <span className="netflix-card__meta">{movie.year}</span>}
                  </div>
                  {showProgress && progress > 0 && (
                    <div className="netflix-card__progress">
                      <div className="netflix-card__progress-bar" style={{ width: `${Math.min(progress / 7200, 100)}%` }} />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
