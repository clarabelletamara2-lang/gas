import React from 'react';

interface GloriaLogoProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  variant?: 'blue' | 'white' | 'auto';
}

/**
 * Logo Resmi Sekolah Kristen Gloria (SMP Kristen Gloria 2 Pakuwon City)
 * Menampilkan emblem resmi: bola dunia, salib Kristus vertikal, dan Alkitab terbuka autentik.
 */
export const GloriaLogo: React.FC<GloriaLogoProps> = ({
  className = 'w-6 h-6',
  style,
  title = 'Logo SMP Kristen Gloria 2',
  variant = 'auto',
}) => {
  // Secara otomatis tentukan apakah menggunakan versi putih (pada banner gelap / badge putih) atau biru resmi
  const isWhite =
    variant === 'white' ||
    (variant === 'auto' &&
      (className.includes('text-white') ||
        className.includes('white') ||
        className.includes('text-sky-100') ||
        className.includes('text-blue-100')));

  const logoSrc = isWhite ? '/gloria-crest-white.png' : '/gloria-crest-blue.png';

  return (
    <img
      src={logoSrc}
      alt={title}
      title={title}
      className={`shrink-0 inline-block object-contain select-none pointer-events-none drop-shadow-2xs ${className}`}
      style={style}
      loading="eager"
      decoding="async"
    />
  );
};

