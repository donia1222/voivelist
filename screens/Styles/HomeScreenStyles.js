// Styles/HomeScreenStyles.js
import { StyleSheet } from 'react-native';

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.buttonBackground,


  },
  headerIcons: {
    flexDirection: 'row',
    alignSelf: 'center', // Alinea el contenedor a la derecha
  },
  headerIcon: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight:3,
    
  },
  headerSaveContainer: {
    position:'absolute',
    bottom:28,
     backgroundColor: theme.background,
    width:'50%',
    alignSelf:'center',
    padding:10,
    right:0,

  },

  headerSaveContainereliminar: {
    flexDirection: 'row',
    alignSelf: 'center', // Alinea el contenedor a la derecha
    padding:10,

    borderRadius:20,

  },


  headerIconSaveimagen: {
     backgroundColor: theme.background,
    width:'60%',
    alignSelf:'center',
    padding:20,
    right:-50,
  

  },




  headerSaveContainerplay: {
    position:'absolute',
    alignItems: 'center',
    bottom:130,
    padding:5,
    borderRadius:20,
    left:20,
  
    
      },
      singleCard: {
        justifyContent: 'center',
        alignItems: 'center',
marginRight:150,
      },

      headerIconSave: {
        marginRight: 5, // Espacio entre el ícono y el texto
        flexDirection: 'row', 
        marginRight:45,
        
        
      },
      headerIconSavedelete: {
        marginRight: 5, // Espacio entre el ícono y el texto
        flexDirection: 'row', 
        marginLeft: 45,
        
      },

      headerIconSaveplus: {
        flexDirection: 'row', 
      },


  headerIconSaveImagene: {
    marginRight: 5, // Espacio entre el ícono y el texto
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:120,
    marginLeft:10,
    
  },
  

  headerIconver: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:30,
    backgroundColor:'#a4a9a524',
    borderRadius:20,
    padding:20,
    marginBottom:60,
    
  },

  headerIconSaveplay: {
    marginRight: 5, // Espacio entre el ícono y el texto
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:20,

    
  },


  saveText: {
    color: '#009688',
    fontSize: 16, // Ajusta el tamaño de la fuente según tus necesidades
    marginLeft:5,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },


  eliminarlista: {
    color: '#e91e63',
    fontSize: 16, // Ajusta el tamaño de la fuente según tus necesidades
    marginLeft:5,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },

  headerIcontime: {
    marginLeft: 20,
    marginTop: 10,
  },
  headerIconi: {
    marginLeft: 20,
    marginTop: 7,
  },
  title: {
    color: theme.text,
    fontFamily: 'Poppins-Regular',
    marginLeft: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.text,
  },

  iconsContainer: {
    flexDirection: 'row',
  },
  editIcon: {
   marginRight:20,
   color:  'blue',
  },

  
  itemText: {
    fontSize: 18,
    color: theme.text,
    fontFamily: 'Poppins-Regular',
  },

  itemTextcure: {
    fontSize: 18,
    color: '#e91e63',
    fontFamily: 'Poppins-Regular',
  },

  messageList: {
    flex: 1,

  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 60,
   maxHeight:400,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.8,
   shadowRadius: 2,

 
  },

  buttonplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 60,
   maxHeight:380,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.8,
   shadowRadius: 2,

 
  },


  buttonimagen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 60,
   maxHeight:440,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.8,
   shadowRadius: 2,

 
  },



  buttonText: {
    fontSize: 17,
    color: theme.buttonText,
    marginLeft: 5,
    marginRight:10,
    color:  'white',
    fontFamily: 'Poppins-Regular',
    
  },

  

  buttonTextplay: {
    fontSize: 17,
    color: theme.buttonText,
    marginLeft: 5,
    marginRight:10,
    color:  'white',
    fontFamily: 'Poppins-Regular',
    
  },

  closeIcon: {
    color:  '#e91e63',

  },

  buttonTextescr: {
    fontSize: 17,
    color: theme.buttonText,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    color: 'black',
    
  },

  buttonTextShare: {
    fontSize: 17,
    color: theme.text,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
  },
  pulseCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor:'white',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.text,
  },

  historyList: {
    flex: 1,
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItem: {
    flex: 1,
  },
  historyItemText: {
    fontSize: 18,
    color: theme.text,
  },
  historyItemIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.text,
    flex: 1,
    color: theme.text,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.buttonBackground,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  listButtonText: {
    color: theme.buttonText,
    fontSize: 16,
    marginLeft: 5,
  },
 
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop:-20,
    backgroundColor: theme.background,
    height:500,
  },
  nextIconContainer: {
    marginTop: -10,
  },
  welcomeImage: {
    width: 200,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
    marginTop: -40,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    lineHeight: 25,
    fontFamily: 'Poppins_400Regular',
    padding: 20,
  },
  welcomeTextw: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    lineHeight: 25,
    fontFamily: 'Poppins_400Regular',
    padding: 20,
    marginBottom: 80,
    marginTop: -20,
  },
  subscriptionModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  subscriptionModalContent: {
    width: '80%',
    height: '30%',
    backgroundColor: theme.background,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  subscriptionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  subscriptionModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.text,
  },
  subscriptionModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.text,
  },
  subscriptionModalButton: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  subscriptionModalButtonText: {
    color: theme.buttonText,
    fontSize: 16,
    textAlign: 'center',
  },
  pressAndSpeakText: {
    color: theme.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: -35,
    fontFamily: 'Poppins_400Regular',
    padding: 30,
  },
  pressToStopText: {
    color: '#e91e63',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: -30,
    fontFamily: 'Poppins_400Regular',
    padding: 20,
  },
  closeWelcomeButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 100,
  },
  closeWelcomeButtonText: {
    color: theme.buttonText,
    textAlign: 'center',
    fontSize: 16,
  },
  closeWelcomeButtone: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  closeIconContainer: {
    padding: 20,
    marginBottom: 40,
  },

  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:  '#cccccc33',
    padding:10,
    width: '90%',
    alignSelf:'center',
    borderRadius:20,
  },
  emptyListImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
     marginTop:20,
     borderRadius:20,
  },
  overlayImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',   
  },
  overlayImage: {
    width: 100,
    height: 100,
    marginLeft:80,
  
  },
  emptyListImageImage: {
    width: 120,
    height: 120,
    marginTop:-200,

  },

  emptyListImageImagen: {
    width: 120,
    height: 120,
    marginTop: 40,

  },

  emptyListText: {
    fontSize: 19,
    textAlign: 'center',
    color: theme.text,
    maxWidth: '80%',
    marginTop:20,
    fontFamily: 'Poppins-Regular',
    marginBottom:20,

  },

  emptyListTextvoz: {
    fontSize: 20,
    textAlign: 'center',
    color: theme.text,
    maxWidth: '80%',
    fontFamily: 'Poppins-Regular',
    marginBottom:20,

  },


  emptyListTextImagen: {
    fontSize: 19,
    textAlign: 'center',
    color:  '#009688',
    maxWidth: '80%',
    marginTop:20,
    fontFamily: 'Poppins-Bold',

  },

  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  circleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  emptyListTextsubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: theme.text,
    maxWidth: '100%',
    fontFamily: 'Poppins-Regular',
    color:  '#009688'

  },

  emptyListTextsuscribe: {
    fontSize: 15,
    textAlign: 'center',
    color: '#009688',
    maxWidth: '80%',
    marginBottom:40,
    fontFamily: 'Poppins-Regular',
    marginLeft:10,

  },

  emptyListTextsuscribemodalize: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    maxWidth: '80%',
    fontFamily: 'Poppins-Regular',
    marginLeft:10,
    padding:15,

  },
  


  emptyListTextsuscribetes: {
    fontSize: 21,
    textAlign: 'center',
    color: theme.text,
    maxWidth: '80%',
    fontFamily: 'Poppins-Regular',
    marginLeft:10,
    marginTop:20,
  },

  
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedMenu: {
    flexDirection: 'row',
    marginTop: 10,
  },

  expandedMenuText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.background,
  },

  modalContainerflat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#009688',
  },


  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: theme.text,
     fontFamily: 'Poppins-Regular',
     textAlign:'center',
  },
  modalTitleprimermodal: {
    fontSize: 21,
    marginBottom: 20,
    color: theme.text,
    fontFamily: 'Poppins-Bold',
     textAlign:'center',
  },
  modalText: {
    fontSize: 17,
    marginBottom: 20,
    color: theme.text,
     fontFamily: 'Poppins-Regular',
     color: theme.textdos
  },
  modalTextex: {
    fontSize: 15,
    marginBottom: 20,
    color: '#009688',
     fontFamily: 'Poppins-Regular',
     textAlign:'center',
  },

  modalTitleimagen: {
    fontSize: 21,
    marginBottom: 20,
    color: theme.text,
     fontFamily: 'Poppins-Regular',
     textAlign:'center',
  },
  modalTitlecurrency: {
    fontSize: 24,
    marginBottom: 20,
    color: theme.text,
    marginTop:-40,
  },
    closeIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },

  modalInput: {
    width: '100%',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    color: theme.text,
    fontSize: 16,
  },
  modalButtonimane: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#009688',
    padding: 15,
    borderRadius: 50,
    width: '80%',
    justifyContent: 'center',
  },

  modalButtonSettins: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    borderRadius: 50,
    width: '80%',
    justifyContent: 'center',
  },

  modalButtonno: {
 top:10,
 right:10,
    position: 'absolute',
  },




  modalButtonpencil: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#009688',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    marginBottom:120,
    marginTop:20,
    
    
  },

  modalButtoncerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    backgroundColor:'#e91e63',
  },


  modalButtonnos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    borderRadius: 50,
    width: '80%',
    justifyContent: 'center',
    backgroundColor:'#e91e63',
  },


  modalButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',

  },

  modalButtonTextSettins: {
    color: 'blue',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',

  },


  modalButtonTextimanet: {
    color:  'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  
  modalButtonTextcerar: {
    color:  'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',

  },
  modalButtonTexte: {
    color: 'grey', // Color de texto diferente
    padding:10,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',

  },

  modalButtonTexteidi: {
    color: theme.text,
    padding:10,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom:20,

  },


  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height:70,
    overflow: 'hidden',
    marginRight:5,
  },
  expandedMenuText: {
    fontSize: 16,
    color: 'white',
  },
  menuIcon: {
    marginRight: 5,
  },
  expandedMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    marginRight:10,
    height:40,

  },
  iconButton: {
    marginRight: 10,
    marginTop:10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
   backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:20,
  },
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding:30,
    borderRadius:20,
  },

  selectedImage: {
    width: 300,
    height: 500,
  
    borderRadius:20,

  },
  modalContaineri: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    margin: 20,
    borderRadius: 20,
    padding: 35,
    shadowColor: '#009688',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.65,
    shadowRadius: 8.84,
    elevation: 5,
    width:'80%',
   maxHeight:300,
   alignSelf: 'center',
   marginTop: 100,
  },

  modalContaineris: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    margin: 20,
    borderRadius: 20,
    padding: 35,
    shadowColor: '#009688',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.65,
    shadowRadius: 8.84,
    elevation: 5,
    width:'90%',
   maxHeight:300,
   alignSelf: 'center',
   marginTop: 100,
  },

  
  costButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'80%',
    alignSelf: 'center',
    marginTop:20,
    marginBottom:40,
    borderRadius:20,

  },

  costButtonContaineriumage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom:80,



  },
  costButtonText: {
    fontSize: 18,
     color: theme.text,
    padding:10,
    fontFamily: 'Poppins-Regular',
    textAlign:'center',
  },
  confirmationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationModalContent: {
    width: '50%',
     backgroundColor: '#3f51b5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: 'white',
  },
    bouncingImageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',

  },
  bouncingImage: {
    width: 150,
    height: 150,
    
  },
  creatingMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  creatingMessageText: {
    marginTop: 20,
    fontSize: 18,
    color: theme.text,
    textAlign: 'center',
    marginBottom:20,
    fontFamily: 'Poppins-Bold'
  },
  liveResultsContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 10,
  },
  liveResultText: {
    color: 'black', // color normal
    fontSize: 16,
    fontFamily: 'Poppins-Regular'
  },

 
  highlightedText: {
    color: '#e91e63',
    fontSize: 16,
    fontFamily: 'Poppins-Bold', 
  },
  chipStyle: {
    backgroundColor: '#009688', // Un color de fondo, ajusta según tu paleta de colores
    color: 'white', // Color del texto
    fontSize: 16, // Tamaño del texto
    paddingHorizontal: 12, // Espacio horizontal dentro del chip
    paddingVertical: 6, // Espacio vertical dentro del chip
    borderRadius: 15, // Borde redondeado para el efecto de chip/cápsula
    overflow: 'hidden', // Asegura que el fondo se recorte con los bordes redondeados
    textAlign: 'center', // Centra el texto dentro del chip
    marginTop: 5, // Margen superior, ajusta según necesidad
    marginBottom: -5, // Margen inferior, ajusta según necesidad
  },
  buttones: {
    alignItems: 'center',
    justifyContent: 'center',
    height:150,
  },
  textbuttomnes: {
    color: 'black',
    fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
    padding:20,
    textAlign: 'center', 
    fontSize:17,
  },
  publicidad: {
    alignSelf:'center', 
    borderRadius:20,
    marginTop:20,
    marginBottom:40,
  },

  buttonCustom: {
    alignSelf:'center', 
    borderRadius:20,
    marginTop:10,
    marginTop:-60,

  },
  buttonCustommodlaize: {
    alignSelf:'center', 
    borderRadius:20,
    marginTop:10,
    marginTop:-60,
backgroundColor: '#009688',

  },


  buttonCustomer: {
    alignSelf:'center', 
    borderRadius:20,
    marginTop:10,
   


  },

  addButtonText: {
    marginLeft: 10,
    color: theme.buttonBackground,
    fontSize: 16,
  },
  addButtonContainer: {
    position: 'absolute',
    alignSelf:'center',          
    bottom: 30        
  },
  containeridiomas: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:20,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalContaineridiomas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentidiomas: {
    width: 300,
    padding: 20,
    backgroundColor: theme.background,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  settingsButtonlengua: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: theme.text,
  },
  warningModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  warningModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  warningModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyListImageImagenes: {
    width: 160,
    height: 160,
    marginTop: -60,
    marginBottom:20,

  },

  primermodalView: {
    margin: 20,
    backgroundColor: theme.backgrounddos,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop:100,
  },
  emptyListImagenotifi: {
    width:60,
    height:60,
    alignSelf:'center',
    marginBottom:10,
    marginRight:10,
    },
    emptyListImagenotifisetttins: {
      width:100,
      height:100,
      alignSelf:'center',
      marginBottom:10,
      marginRight:10,
      },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginRight: 5,
    },
    modalButtones: {
      backgroundColor: '#009688',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom:20,
      marginTop:20,
      minWidth:10,
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#009688',
      justifyContent: 'center',
      alignItems: 'center',
    },
    suggestionItem: {
      padding: 10,
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      fontFamily: 'Poppins-Regular',
      color: theme.text,
      textAlign:  'center',
    },
    modalButtoneslist: {
      backgroundColor: '#009688',
      borderRadius:50,
      marginBottom:10,
     
    },
    pulseCircle: {
      width: 90,
      height: 90,
      borderRadius: 50,
      backgroundColor: 'rgba(63, 81, 181, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerCircle: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: '#3f51b5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    plusText: {
      color: 'white',
      fontSize: 30,
    },
    innerCirclered: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: '#e91e63',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerCircleredimagen: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: '#3f51b5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rateTitle: {
      fontSize: 26,
      marginBottom: 10,
      textAlign:  'center',
      fontFamily: 'Poppins-Bold', 
      padding:10,
      color: theme.backgroundtresapp,
    },
    modalMessage: {
      fontSize: 17,
      marginBottom: 20,
      textAlign:  'center',
      padding:10,
      fontFamily: 'Poppins-Regular', 
      color: theme.text,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    modalViewo: {
      margin: 20,
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderColor: "grey",
      borderWidth: 1,
    },
    modalImageestre: {
      width: 150,
      height: 150,

    },
    
    
});

export default getStyles;
