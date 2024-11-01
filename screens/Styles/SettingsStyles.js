// Styles/styles.js
import { StyleSheet } from 'react-native';

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: 20,
  },
  settingsTitle: {
    fontSize: 24,
    color: theme.text,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    color: theme.text,
  },
  // Otros estilos que ya tengas definidos...
});

export default getStyles;
