// Styles/styles.js
import { StyleSheet } from 'react-native';

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background, // Usa el tema
    padding: 20,
  },
  infoButton: {
    marginBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  closeIconContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: theme.text, // Usa el tema
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default getStyles;
