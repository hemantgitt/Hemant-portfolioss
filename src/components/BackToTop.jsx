import { Icon } from './Icon.jsx';

/** @param {{ visible: boolean, onClick: () => void }} props */
export function BackToTop({ visible, onClick }) {
  if (!visible) return null;
  return (
    <button type="button" className="fab" onClick={onClick} aria-label="Back to top" title="Back to top">
      <Icon name="arrow-up" size={19} />
    </button>
  );
}
