// Styles/styles.js
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,  // Cambiado a 0
    backgroundColor: theme.background, // Usa el tema
  },
  containerkey: {
    flex: 1,
    maxHeight: 220,
    minWidth: 500,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80,
    marginBottom: 30,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    borderRadius: 10,
    maxWidth: '95%',
    maxHeight: '90%',
    alignSelf: 'center',
    backgroundColor: theme.background, // Usa el tema
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    
  },
 
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleImage: {
    width: 26,
    height: 26,
    marginRight: 10,
  
  },
  benefitTitle: {
    color: theme.text, // Usa el tema
    fontSize: windowWidth > 600 ? 29 : 18,
    marginLeft: 20,
    marginTop: 20,
    fontFamily: 'Poppins_400Regular',
  },
  benefitDescription: {
    color: theme.text, // Usa el tema
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    borderRadius: 20,
    marginVertical: 5,
    marginBottom: 20,
    marginTop: -200,

  },
  buttonText: {
    color: theme.buttonText, // Usa el tema
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  restoreButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '120%',
    fontFamily: 'Poppins-Bold',
    marginTop: 15,
  },
  restoreButtonContainer: {
    maxWidth: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.text, // Usa el tema
    fontFamily: 'Poppins-Regular',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: theme.text, // Usa el tema
    fontFamily: 'Poppins-Regular',
  },
  cancelSubscriptionText: {
    margin: 10,
    color: theme.text, // Usa el tema
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitImage: {
    width: 0,
    height: 0,
    marginLeft: 10,
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 20,
    padding: 20,
    width: windowWidth * 1.0,
    maxHeight: windowHeight * 1.0,
    margin: 20,
    alignSelf: 'center',
  },
  modalText: {
    fontSize: 21,
    color: theme.text, // Usa el tema
    textAlign: 'center',
    padding: 20,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
  },
  subscribedContainer: {
    backgroundColor: '#0ef0da',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 0,
    marginBottom: 20,

  },
  tryClickerButtonTextCentered: {
    color: '#c6c6c6',
    marginTop: 20,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loadingText: {
    color: theme.text, // Usa el tema
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: windowWidth / 4 - 10,
    height: windowWidth / 4 - 10,
    margin: 5,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  fullImage: {
    width: '90%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 20,
    height: windowHeight * 0.4,
    resizeMode: 'contain',
  },
  draggableBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 8,
  },
  buttonStyle: {
    borderRadius: 5,
  },
  headerImage: {
    width: windowWidth,
    height: 220,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: -20,
    width: '100%',
    marginTop: -30,
  },
  priceText: {
    fontSize: 17,
    color:  '#009688',
    textAlign: 'center',
    marginBottom: 50,
    padding:20,
    fontFamily: 'Poppins-Regular',
  },


  buttonIcon: {
    width: 28,
    height: 28,
    marginLeft: 5,
    marginTop: 70,
  },
  subscriptionButtonTexti: {
    color: theme.text, // Usa el tema
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  messageContainere: {
    marginTop: 140,
  },
  bouncingImage: {
    width: 120,
    height: 120,
    alignSelf:'center',
    marginTop:40,
    
  },

});

export default getStyles;
