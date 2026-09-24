import { memo } from 'react';
import { Icon } from './Icon.jsx';
import { BrandIcon } from './BrandIcon.jsx';

/** @param {{ name: string, icon: string, brand?: string }} props */
function SkillBadgeBase({ name, icon, brand }) {
  const fallback = <Icon name={icon} size={13} style={{ flex: 'none', opacity: 0.8 }} />;
  return (
    <li className="pill">
      {brand ? <BrandIcon slug={brand} size={14} fallback={fallback} /> : fallback}
      {name}
    </li>
  );
}

export const SkillBadge = memo(SkillBadgeBase);
