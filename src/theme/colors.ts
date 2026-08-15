export const colors = {
  // Backgrounds
  background: '#020617',
  backgroundMid: '#0f172a',
  backgroundTop: '#1e293b',
  surface: '#0f172a',
  surfaceElevated: '#1e293b',

  // Brand / actions
  primary: '#3b82f6',
  accent: '#06b6d4',
  accentMuted: 'rgba(6, 182, 212, 0.15)',
  accentBorder: 'rgba(6, 182, 212, 0.3)',
  onPrimary: '#ffffff',

  // Text
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textSubtle: 'rgba(255, 255, 255, 0.8)',

  // Borders & glass
  border: '#1e293b',
  glass: 'rgba(255, 255, 255, 0.03)',
  glassInner: 'rgba(255, 255, 255, 0.02)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  ring: '#ffffff',

  // Semantic
  error: '#f87171',
  errorSurface: 'rgba(220, 38, 38, 0.1)',
  errorBorder: 'rgba(220, 38, 38, 0.2)',
  success: '#10b981',
  successMuted: 'rgba(16, 185, 129, 0.15)',

  // Effects
  shadow: '#3b82f6',
  tabBar: 'rgba(30, 41, 59, 0.85)',
} as const;

export const gradients = {
  background: [colors.backgroundTop, colors.backgroundMid, colors.background],
  screen: [colors.surfaceElevated, colors.background],
  primaryButton: [colors.primary, colors.accent],
} as const;
