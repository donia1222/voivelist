import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,

  },
  card: {
    backgroundColor: theme.backgrounddos,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#57575770',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3,
    height: 580,
    width: width - 10,
    alignSelf: 'center',
    shadowOpacity: 0.2,
  
  

  },
  cardespan: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3,
    height: 550,
    width: width - 40,
    alignSelf: 'center',
    marginTop:-30,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    marginRight:18,
  },
  cardTitle: {
    fontSize: 21,
    color: theme.text,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop:20,
  },

  cardTitlefav: {
    fontSize: 26,
    color: theme.text,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop:20,
  },


  cardTitlespan: {
    fontSize: 26,
    color: theme.text,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop:-30,
  },

  cardTitlespanes: {
    fontSize: 26,
    color: theme.text,
    fontFamily: 'Poppins_400Regular',
    marginTop:-30,
  },

  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
marginLeft:-20,
marginTop:-20,


  },
  
  notofi: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#a8a8a85c',
    padding:5,
    borderRadius:10,
    marginTop:10,
  },

  cardContent: {
    flex: 1,
    marginTop: 10,
  },
  listItemText: {
    fontSize:19,
    color: theme.text,
    marginVertical: 10,
    fontFamily: 'Poppins_400Regular',
  },

  listItemTextfa: {
    fontSize:21,
    color: theme.text,
    marginVertical: 10,
    fontFamily: 'Poppins_400Regular',
  },


  listItemTextspan: {
    fontSize: 21,
    color: theme.text,
    marginVertical: 10,
    fontFamily: 'Poppins_400Regular',
  },

  historyItemInput: {
    fontSize: 20,
    color: theme.text,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: theme.text,
    flex: 1,
    
  },

  
  emptyText: {
    fontSize: 18,
    color: theme.text,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },

  openListButton: {
    backgroundColor: '#a8a8a85c',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
    alignSelf: 'center',
  },
  openListButtonText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
    padding: 10,
    width: '60%',
    borderRadius: 50,
    marginTop: -10,
    marginBottom: 80,
  },
  headerIconi: {
    marginLeft: 20,
    marginTop:20,
    backgroundColor: theme.backgroundtres,
    padding:7,
    borderRadius:50,
    shadowColor: '#575757a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,

  },
favoritesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10, // Ajusta según sea necesario

    marginLeft:190,
    padding:10,
  
  },
  headerIconiav: {
    marginHorizontal: 15, // Espacio entre los íconos
       shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.8,
   shadowRadius: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,

  },

  headerIconiave: {
    padding: 7,
    borderRadius: 10,
    shadowColor: '#575757a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    position: 'absolute', // Asegúrate de manejar el posicionamiento correctamente
    right: 20, // Ajusta según sea necesario
    top:5,
    zIndex: 100,
    marginRight:120,
  }, 
  headerIconiavo: {
    padding: 7,
    borderRadius: 10,
    shadowColor: '#575757a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    position: 'absolute', // Asegúrate de manejar el posicionamiento correctamente
    right: 20, // Ajusta según sea necesario
    top:5,
    zIndex: 100,
    marginRight:120,
  }, 
  
  headerIconopen: {
    position: 'absolute',  // Añadir posición absoluta      // Alinearlo en la parte inferior
    backgroundColor: theme.backgroundtres,
    padding: 7,
    borderRadius: 50,
    shadowColor: '#575757a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  
  headerIconis: {
    marginLeft: 10,
    marginTop:20,
    padding:7,
    borderRadius:50,

  },
  completedItem: {
    textDecorationLine: 'line-through',
    color: '#e91e63',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 10,
    marginTop:40,
  },
  
  modalContainerrow: {
    width: '100%',
    height: '90%',
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 10,
    marginTop:40,
  },

  modalContainerespa: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 10,
  },
  successModalContainer: {
    width: '60%',
    height: '30%',
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  successModalButton: {
    backgroundColor: theme.buttonBackground,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitleInput: {
    fontSize: 20,
    color: theme.text,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: theme.text,
    flex: 1,
  },


  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },

  modalContent: {
    flex: 1,
  },
  modalItemInput: {
    borderBottomWidth: 1,
    borderColor: theme.text,
    fontSize: 18,
    color: theme.text,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: theme.buttonBackground,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  modalButton: {
    backgroundColor:'#009688',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    maxWidth:300,
    alignSelf:'center',
  },
  modalButtoncloses: {
    top:-10,
    right:20,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    maxWidth:300,
    alignSelf:'center',
    position:'absolute',

  },


  addButtonadditem: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    maxWidth:300,
    alignSelf:'center',
  },
  homeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3f51b5',
    borderRadius: 20,
    alignItems: 'center',
    padding:10,
    width: '80%',
    alignSelf: 'center',
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.8,
   shadowRadius: 2,
  },

  homeButtonText: {
    color: '#fff',
    fontSize: 17,
    textAlign:'center',
    fontFamily: 'Poppins-Bold',

  },

  modalButtonclose: {
    backgroundColor:'#e91e63',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    maxWidth:300,
    alignSelf:'center',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
  },
  reminderText: {
    fontSize: 16,
    color: theme.text,
  },

  modalTitle: {
    fontSize: 28,
    color: theme.backgroundtresapp,
    fontFamily: 'Poppins-Regular',
    marginBottom:10,
  },

  modalText: {
    fontSize: 16,
    color: theme.text,
    fontFamily: 'Poppins-Regular',
    marginBottom:30,
    textAlign:'center',
    marginTop:20,

  },

  reminderPassed: {
    textDecorationLine: 'line-through',
    color: '#e91e63',
  },
  emptyListImage: {
  width:80,
  height:80,
  alignSelf:'center',
  marginBottom:10,
  },

  emptyListImagenotifi: {
    width:30,
    height:30,
    alignSelf:'center',
    marginBottom:10,
    marginRight:10,
    },

    emptyListImagenotificacionmodal: {
      width:60,
      height:60,
      alignSelf:'center',
      marginBottom:10,
      marginRight:10,
      },

    removeIcon: {
      marginLeft: 10,
    },
    modalContainerpiker: {
      backgroundColor:'#8c8c8c4d',
      borderRadius:20,
      padding:20,
      alignSelf:'center',
      height:250,
      width:300,
      },


      thumbnailList: {
        marginTop: 20,
        marginBottom: -25,
        borderRadius: 50,
        marginTop:-25,
      },
      hidden: {
        display: 'none', // En React Native usarías 'display: none' para ocultar
      },
      thumbnailListContainer: {
        paddingHorizontal: 10,
        height:60,
        marginTop:10,
        borderRadius: 50,
      },
      thumbnailContainer: {
        flexDirection: 'row', // Asegura que los elementos hijos se alineen horizontalmente
        alignItems: 'center', // Alinea los elementos verticalmente en el centro
        padding: 10,
        margin: 5,
        borderRadius: 10,
        borderBlockColor: theme.backgrounddos,
        borderBottomWidth: 2,
  
        
      },
      menuIcon: {
        marginLeft: 10, // Espacio entre el texto y el ícono
      },
      selectedThumbnail: {
        borderBlockColor: theme.backgrounddos,
        borderBottomWidth: 4,
        borderRadius: 10,
        
      },
      thumbnailText: {
        fontSize: 16,
        color: theme.text,
        fontFamily: 'Poppins-Regular',
      },
      selectedThumbnailText: {
        fontFamily: 'Poppins-Regular',
        color: theme.textthum,
      },
      successTextoe: {
       marginTop:50,
       color: 'white',
      },
      closeExpandedCardButton: {
        marginTop:40,
       },
       background: {
        flex: 1,
        resizeMode: 'cover',
      },
      emptyListImageImagen: {
        width: 120,
        height: 120,
        marginTop: 40,
        marginBottom:30,
        alignSelf:'center',
        
    
      },
      folderContainer: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: theme.folderBackgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      },
      folderText: {
        color: theme.folderTextColor,
        fontSize: 16,
        fontWeight: 'bold',
      },

      pencilIcon: {
        marginLeft: 8,

      },
      pencilIcone: {
        marginLeft: 8,
        marginTop:10,
      },
      modalButtoninfo: {
        flexDirection: 'row',
    justifyContent: 'flex-end',
   
      },
      elimkanrfavo: {
        fontSize: 14,
        color: 'grey',
        marginVertical: 10,
        fontFamily: 'Poppins-Regular',
        marginLeft: 8,
      },
      headerIconifacos: {
        marginHorizontal: 10, // Espacio entre los íconos
      },
      headerIconifaco: {
        marginHorizontal: 10, // Espacio entre los íconos
      },
  
      iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      badgeContainer: {
        position: 'absolute',
        right: -10,
        top: 2,
        backgroundColor: theme.backgroundtres,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      badgeText: {
        color: theme.text,
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
      },
      thumbnailImage: {
        width: 45, // Tamaño de la miniatura
        height: 45, // Tamaño de la miniatura
        borderRadius:50,

      },

      thumbnailImageModal: {
        width: 80, // Tamaño de la miniatura
        height: 80, // Tamaño de la miniatura
        marginTop:10,
        marginBottom:10,
        borderRadius:50,
        

      },

      favoritesIconsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
      },
      chip: {
        backgroundColor: theme.background,
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 5,
      },
      chipSelected: {
 
      },
      chipText: {
        color: theme.text,
        fontFamily: 'Poppins-Regular',

      },

      nofav: {
        color: theme.text,
        fontFamily: 'Poppins-Regular',
        textAlign:  'center',
        marginTop:100,
        fontSize: 18,
        padding:20,
      },

      chipTextSelected: {
        color: theme.text,
        fontFamily: 'Poppins-Regular',
      },
      headerIconifaco: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      uploadIconContainer: {
        position: 'absolute',
        top: 40,
        left: 80,
        borderRadius: 50,
        padding: 5,
      },
      favoritesButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
        zIndex:100,
      },
      publicidad: {
    marginBottom:20,

      },
      modalUploadButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        elevation: 5,
      },
      thumbnailImageModale: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius:50,
        marginBottom:40,
      },
      modalContainert: {
        width: '80%',
        backgroundColor: theme.backgroundnuevo,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        maxHeight:550,
        borderBlockColor:'grey',
        borderWidth:5,
      },
      modalOverlayt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c2c2ceb',
      },
      imageContainer: {
        position: 'relative',
        margin: 5,
      },
      checkIcon: {
        position: 'absolute',
        top: 5,
        right: -5,
      },
});

export default getStyles;
