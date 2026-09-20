import { Icon } from './Icon.jsx';

/** @param {{ onRefresh: () => void }} props */
export function UpdateBanner({ onRefresh }) {
  return (
    <div role="status" className="update-banner">
      <Icon name="refresh-cw" size={15} />
      <span>A new version of this site is available.</span>
      <button type="button" onClick={onRefresh} className="update-banner-btn">
        Refresh
      </button>
    </div>
  );
}
