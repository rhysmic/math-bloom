import { StarIcon } from './Icons';

export function Stars({ count, size = 76 }: { count: number; size?: number }) {
  return (
    <div className="stars" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`stars__item ${i < count ? 'is-filled' : ''}`} style={{ animationDelay: `${0.15 + i * 0.15}s` }}>
          <StarIcon size={size} filled={i < count} />
        </span>
      ))}
    </div>
  );
}
