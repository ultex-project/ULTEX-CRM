import React from 'react';

interface ClientAvatarProps {
  name: string;
  photoUrl?: string;
  size?: number;
}

const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316'];

const getInitials = (fullName: string) => {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return '';
  }
  const parts = trimmed.split(' ');
  const first = parts[0]?.[0]?.toUpperCase() ?? '';
  const second = parts[1]?.[0]?.toUpperCase() ?? '';
  const initials = `${first}${second}`;
  return initials || trimmed.slice(0, 2).toUpperCase();
};

const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 0xffffffff;
  }
  return COLORS[Math.abs(Math.floor(hash)) % COLORS.length];
};

const ClientAvatar: React.FC<ClientAvatarProps> = ({ name, photoUrl, size = 42 }) => {
  const safeSize = Number.isFinite(size) && size > 0 ? size : 42;
  const normalizedName = name?.trim() || '?';
  const initials = getInitials(normalizedName) || '?';

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={normalizedName}
        style={{
          width: `${safeSize}px`,
          height: `${safeSize}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  const backgroundColor = getColorFromName(normalizedName);

  return (
    <div
      style={{
        width: `${safeSize}px`,
        height: `${safeSize}px`,
        borderRadius: '50%',
        backgroundColor,
        color: '#fff',
        fontWeight: 600,
        fontSize: `${safeSize / 2.5}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export default ClientAvatar;
