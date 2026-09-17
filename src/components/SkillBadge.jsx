import { memo } from 'react';
import { Icon } from './Icon.jsx';

/** @param {{ name: string, icon: string }} props */
function SkillBadgeBase({ name, icon }) {
  return (
    <li className="pill">
      <Icon name={icon} size={13} style={{ flex: 'none', opacity: 0.8 }} />
      {name}
    </li>
  );
}

export const SkillBadge = memo(SkillBadgeBase);
