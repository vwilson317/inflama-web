// Brazilian flag–inspired theme (matches app icon): green, yellow, sapphire blue, glossy depth
export const theme = {
  // Background: white
  bgDark: '#ffffff',
  bgGradient: ['#ffffff', '#f5f5f5', '#ffffff'],

  // Greens (outer layer): forest → flag green → lime highlight
  green: '#009739',
  greenDark: '#1b5e20',
  greenLight: '#7cb342',

  // Yellow (rhombus): golden → luminous
  gold: '#ffdd00',
  goldDark: '#f9a825',
  goldLight: '#ffeb3b',

  // Blue (heart/sphere): sapphire
  blue: '#002776',
  blueLight: '#1565c0',

  // Neutrals
  white: '#ffffff',
  // Global typography: burnt orange
  textPrimary: '#cc5500',
  textSecondary: 'rgba(204,85,0,0.85)',

  // Cards: deep blue with subtle green tint (glossy sphere feel)
  cardBg: '#002776',
  cardBgOverlay: 'rgba(0,39,118,0.92)',

  // Shadow: soft depth, slight green tint like icon
  shadow: {
    shadowColor: '#1b5e20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },

  borderRadius: 24,
};
