/**
 * Site Configuration Constants
 */

// Site URLs and metadata
export const SITE_CONFIG = {
  url: 'https://paperlanterns.ink',
  name: 'Paper Lanterns',
  description: 'A modern anthology of history\'s most profound correspondence',
  author: 'Bhuvanesh',
  social: {
    twitter: 'https://x.com/bebhuvan',
    linkedin: 'https://www.linkedin.com/in/bebhuvan/'
  }
} as const;

// Typography constants
export const TYPOGRAPHY = {
  WORDS_PER_MINUTE: 200, // Average reading speed
  DEFAULT_DROP_CAP_COLOR: '#e07a5f',
  FONT_WEIGHTS: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600
  }
} as const;

// Layout constants
export const LAYOUT = {
  MAX_WIDTH: {
    sm: '640px',
    md: '840px',
    lg: '1200px',
    xl: '1600px'
  },
  FEATURED_LIMITS: {
    lectures: 2,
    essays: 2,
    letters: 2,
    speeches: 1,
    totalDisplay: 6
  },
  RELATED_CONTENT_LIMIT: 4
} as const;

// Breakpoints (mobile-first)
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  searchData: 3600,      // 1 hour
  randomContent: 300,    // 5 minutes
  static: 31536000,      // 1 year
  dynamic: 300           // 5 minutes
} as const;

// Touch target minimum size (accessibility)
export const ACCESSIBILITY = {
  MIN_TOUCH_TARGET: 44,  // 44px minimum for mobile
  MIN_FONT_SIZE: 16,     // 16px minimum for body text
  MIN_CONTRAST_RATIO: 4.5 // WCAG AA for normal text
} as const;

// Animation durations (in ms)
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

// Z-index layers
export const Z_INDEX = {
  background: -1,
  base: 0,
  navigation: 100,
  modal: 1000,
  toast: 1000
} as const;

// Color palette for decorative elements
export const COLLECTION_COLORS = {
  love: 'rgba(220, 120, 130, 0.5)',
  wartime: 'rgba(80, 80, 90, 0.35)',
  scientific: 'rgba(100, 140, 180, 0.4)',
  creative: 'rgba(200, 140, 90, 0.45)',
  prison: 'rgba(100, 80, 70, 0.4)',
  family: 'rgba(170, 140, 110, 0.4)'
} as const;

// Route paths
export const ROUTES = {
  home: '/',
  letters: '/letters',
  speeches: '/speeches',
  lectures: '/lectures',
  essays: '/essays',
  archive: '/archive',
  about: '/about',
  garden: '/garden',
  collections: '/collections'
} as const;

// Content type mapping
export const CONTENT_TYPE_LABELS = {
  letter: 'Letter',
  speech: 'Speech',
  lecture: 'Lecture',
  essay: 'Essay'
} as const;

// External resources
export const EXTERNAL_URLS = {
  fonts: {
    googleapis: 'https://fonts.googleapis.com',
    gstatic: 'https://fonts.gstatic.com'
  },
  schema: 'https://schema.org',
  cloudflare: 'https://static.cloudflareinsights.com'
} as const;
