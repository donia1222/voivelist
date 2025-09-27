/**
 * Base de datos local de productos estacionales
 * Organizada por mes, región y país para recomendaciones sin IA
 */

import * as RNLocalize from 'react-native-localize'

// Detectar región del usuario (puedes expandir esto con más lógica de geolocalización)
const detectUserRegion = () => {
  // Por ahora asumimos España/Europa, pero puedes añadir lógica para detectar:
  // - Europa, América del Norte, América del Sur, Asia, África, Oceanía
  return 'europa'
}

// Detectar idioma del dispositivo
const detectUserLanguage = () => {
  try {
    return RNLocalize.getLocales()[0].languageCode || 'es'
  } catch (error) {
    return 'es'
  }
}

// Base de datos de productos estacionales por mes y región
const seasonalDatabase = {
  europa: {
    1: [ // Enero - Europa (50+ productos)
      'Naranjas 🍊', 'Mandarinas 🍊', 'Kiwis 🥝', 'Peras 🍐', 'Manzanas 🍎',
      'Pomelos 🍊', 'Limones 🍋', 'Limas 🍋', 'Plátanos 🍌', 'Piñas 🍍',
      'Coles de Bruselas 🥬', 'Coliflor 🥬', 'Brócoli 🥦', 'Acelgas 🌿', 'Espinacas 🌿',
      'Puerros 🌿', 'Apio 🌿', 'Zanahorias 🥕', 'Remolacha 🌿', 'Nabos 🌿',
      'Coles rizadas 🥬', 'Lombardas 🥬', 'Endivias 🌿', 'Escarola 🌿', 'Berros 🌿',
      'Alcachofas 🌿', 'Cardos 🌿', 'Hinojo 🌿', 'Chirivías 🥕', 'Apionabos 🌿',
      'Lentejas 🌿', 'Garbanzos 🌿', 'Alubias 🌿', 'Judías pintas 🌿', 'Frijoles 🌿',
      'Frutos secos 🌰', 'Castañas 🌰', 'Nueces 🌰', 'Almendras 🌰', 'Avellanas 🌰',
      'Pistachos 🌰', 'Piñones 🌰', 'Anacardos 🌰', 'Pacanas 🌰', 'Dátiles 🌰',
      'Sopas calientes 🍲', 'Caldos 🍲', 'Cremas 🍲', 'Purés 🍲', 'Guisos 🍲',
      'Infusiones 🍵', 'Té caliente ☕', 'Chocolate 🍫', 'Cacao 🍫', 'Chocolate negro 🍫',
      'Jengibre 🌿', 'Cúrcuma 🌿', 'Canela 🌿', 'Clavo 🌿', 'Cardamomo 🌿',
      'Miel 🍯', 'Jalea real 🍯', 'Propóleo 🍯', 'Polen 🌿', 'Vitamina C 💊',
      'Avena 🌾', 'Quinoa 🌾', 'Arroz integral 🌾', 'Cebada 🌾', 'Centeno 🌾',
      'Pasta integral 🍝', 'Pan integral 🍞', 'Pan de centeno 🍞', 'Crackers 🍞', 'Tortitas 🍞',
      'Pescado azul 🐟', 'Salmón 🐟', 'Sardinas 🐟', 'Bacalao 🐟', 'Merluza 🐟',
      'Atún 🐟', 'Caballa 🐟', 'Boquerones 🐟', 'Anchoas 🐟', 'Rodaballo 🐟',
      'Yogur 🥛', 'Kéfir 🥛', 'Probióticos 🥛', 'Leche 🥛', 'Queso 🧀',
      'Mantequilla 🧈', 'Nata 🥛', 'Crema agria 🥛', 'Requesón 🧀', 'Cuajada 🥛',
      'Agua 💧', 'Aceite de oliva 🫒', 'Aceite de coco 🥥', 'Vinagre 🌿', 'Mostaza 🌿',
      'Patatas 🥔', 'Boniatos 🍠', 'Calabaza 🎃', 'Cebolletas 🌿', 'Ajo 🧄',
      'Cebolla roja 🧅', 'Chalotes 🧅', 'Puerros baby 🌿', 'Rábanos 🌿', 'Nabiza 🌿'
    ],
    2: [ // Febrero - Europa (60+ productos)
      'Fresas 🍓', 'Fresas del bosque 🍓', 'Mandarinas 🍊', 'Naranjas 🍊', 'Kiwis 🥝',
      'Plátanos 🍌', 'Pomelos rosados 🍊', 'Limones 🍋', 'Manzanas rojas 🍎', 'Peras conferencia 🍐',
      'Acelgas 🌿', 'Espinacas 🌿', 'Lechugas 🥬', 'Canónigos 🌿', 'Rúcula 🌿',
      'Endivias 🌿', 'Escarola 🌿', 'Berros 🌿', 'Achicoria 🌿', 'Radichio 🌿',
      'Alcachofas 🌿', 'Cardos 🌿', 'Apio 🌿', 'Hinojo 🌿', 'Puerros 🌿',
      'Brócoli 🥦', 'Coliflor 🥬', 'Romanesco 🥬', 'Coles de Bruselas 🥬', 'Lombardas 🥬',
      'Chocolate 🍫', 'Chocolate negro 🍫', 'Cacao puro 🍫', 'Chocolate blanco 🍫', 'Bombones 🍫',
      'Frutos secos 🌰', 'Almendras 🌰', 'Nueces 🌰', 'Avellanas 🌰', 'Pistachos 🌰',
      'Anacardos 🌰', 'Piñones 🌰', 'Macadamias 🌰', 'Castañas 🌰', 'Dátiles 🌰',
      'Vino tinto 🍷', 'Vino rosado 🍷', 'Champán 🍾', 'Cava 🍾', 'Sidra 🍻',
      'Té romántico 🍵', 'Infusiones 🍵', 'Té rojo 🍵', 'Té verde 🍵', 'Manzanilla 🍵',
      'Miel 🍯', 'Jalea real 🍯', 'Mermeladas 🍯', 'Confituras 🍯', 'Compotas 🍯',
      'Canela 🌿', 'Vainilla 🌿', 'Cardamomo 🌿', 'Jengibre 🌿', 'Clavo 🌿',
      'Legumbres 🌿', 'Lentejas rojas 🌿', 'Garbanzos 🌿', 'Judías blancas 🌿', 'Soja 🌿',
      'Alubias pintas 🌿', 'Guisantes secos 🌿', 'Habas secas 🌿', 'Azukis 🌿', 'Quinoa 🌾',
      'Pescado 🐟', 'Salmón 🐟', 'Trucha 🐟', 'Bacalao 🐟', 'Merluza 🐟',
      'Marisco 🦐', 'Langostinos 🦐', 'Gambas 🦐', 'Mejillones 🦪', 'Almejas 🦪',
      'Vieiras 🦪', 'Navajas 🦪', 'Percebes 🦐', 'Centollos 🦀', 'Bogavantes 🦞',
      'Quesos 🧀', 'Queso manchego 🧀', 'Queso de cabra 🧀', 'Queso azul 🧀', 'Brie 🧀',
      'Yogur griego 🥛', 'Crema 🥛', 'Mantequilla 🧈', 'Huevos 🥚', 'Leche 🥛',
      'Aceitunas 🫒', 'Aceite virgen 🫒', 'Vinagre 🌿', 'Vinagre balsámico 🌿', 'Mostaza 🌿',
      'Especias 🌿', 'Hierbas aromáticas 🌿', 'Orégano 🌿', 'Tomillo 🌿', 'Romero 🌿',
      'Zanahorias 🥕', 'Remolacha 🌿', 'Nabos 🌿', 'Coles 🥬', 'Berenjenas 🍆',
      'Calabacines 🥒', 'Pepinos 🥒', 'Tomates cherry 🍅', 'Pimientos 🌶️', 'Cebollas 🧅'
    ],
    3: [ // Marzo - Europa (60+ productos)
      'Fresas 🍓', 'Fresas del bosque 🍓', 'Nísperos 🍑', 'Albaricoques 🍑', 'Cerezas 🍒',
      'Kiwis 🥝', 'Plátanos 🍌', 'Limones 🍋', 'Naranjas 🍊', 'Pomelos 🍊',
      'Manzanas verdes 🍎', 'Peras 🍐', 'Granadas 🔴', 'Uvas tempranas 🍇', 'Piñas 🍍',
      'Espárragos 🌿', 'Espárragos trigueros 🌿', 'Alcachofas 🌿', 'Habas 🌿', 'Guisantes 🟢',
      'Judías verdes 🌿', 'Edamame 🌿', 'Tirabeques 🌿', 'Habas baby 🌿', 'Espinacas baby 🌿',
      'Lechugas 🥬', 'Lechugas iceberg 🥬', 'Rúcula 🌿', 'Berros 🌿', 'Canónigos 🌿',
      'Espinacas 🌿', 'Acelgas 🌿', 'Achicoria 🌿', 'Endivia 🌿', 'Escarola 🌿',
      'Zanahorias 🥕', 'Zanahorias baby 🥕', 'Rábanos 🌿', 'Nabos 🌿', 'Remolachas 🌿',
      'Cebollas 🧅', 'Cebolletas 🌿', 'Puerros 🌿', 'Ajo tierno 🧄', 'Chalotes 🧅',
      'Calabacines 🥒', 'Pepinos 🥒', 'Apio 🌿', 'Hinojo 🌿', 'Colinabos 🌿',
      'Productos limpieza 🧽', 'Detergente eco 🌿', 'Jabón natural 🧼', 'Vinagre blanco 🌿', 'Bicarbonato 🌿',
      'Semillas 🌱', 'Brotes 🌱', 'Germinados 🌱', 'Hierba fresca 🌿', 'Perejil 🌿',
      'Cilantro 🌿', 'Albahaca 🌿', 'Menta 🌿', 'Cebollino 🌿', 'Eneldo 🌿',
      'Pescado fresco 🐟', 'Lubina 🐟', 'Dorada 🐟', 'Rape 🐟', 'Rodaballo 🐟',
      'Salmón 🐟', 'Trucha 🐟', 'Lenguado 🐟', 'Merluza 🐟', 'Bacalao 🐟',
      'Huevos frescos 🥚', 'Huevos camperos 🥚', 'Queso fresco 🧀', 'Requesón 🧀', 'Ricotta 🧀',
      'Yogur natural 🥛', 'Kéfir 🥛', 'Yogur griego 🥛', 'Leche fresca 🥛', 'Nata 🥛',
      'Aceite nuevo 🫒', 'Aceite virgen extra 🫒', 'Vinagre primavera 🌿', 'Vinagre de manzana 🌿', 'Mostaza 🌿',
      'Agua depurativa 💧', 'Tés verdes 🍵', 'Infusiones depurativas 🍵', 'Agua con limón 💧', 'Zumos verdes 🥒'
    ],
    4: [ // Abril - Europa (60+ productos)
      'Fresas 🍓', 'Fresas silvestres 🍓', 'Cerezas 🍒', 'Cerezas picotas 🍒', 'Albaricoques 🍑',
      'Nísperos 🍑', 'Ciruelas 🍇', 'Ciruelas claudias 🍇', 'Kiwis 🥝', 'Manzanas 🍎',
      'Peras 🍐', 'Limones 🍋', 'Naranjas 🍊', 'Pomelos 🍊', 'Plátanos 🍌',
      'Espárragos 🌿', 'Espárragos blancos 🌿', 'Alcachofas 🌿', 'Habas 🌿', 'Guisantes 🟢',
      'Judías tiernas 🌿', 'Judías verdes 🌿', 'Edamame 🌿', 'Tirabeques 🌿', 'Vainas 🌿',
      'Lechugas 🥬', 'Lechugas romanas 🥬', 'Canónigos 🌿', 'Rúcula 🌿', 'Berros 🌿',
      'Apio 🌿', 'Espinacas 🌿', 'Acelgas 🌿', 'Endivia 🌿', 'Escarola 🌿',
      'Tomates cherry 🍅', 'Tomates pera 🍅', 'Pepinos 🥒', 'Calabacines 🥒', 'Berenjenas 🍆',
      'Pimientos 🌶️', 'Pimientos italianos 🌶️', 'Cebollas 🧅', 'Cebollas moradas 🧅', 'Ajo 🧄',
      'Huevos Pascua 🥚', 'Chocolate 🍫', 'Chocolate negro 🍫', 'Mazapán 🍯', 'Torrijas 🍞',
      'Rosquillas 🍩', 'Pestiños 🍯', 'Dulces Pascua 🍬', 'Bunuelos 🍩', 'Magdalenas 🧁',
      'Cordero 🐑', 'Cordero lechal 🐑', 'Cabrito 🐐', 'Conejo 🐰', 'Pollo 🐔',
      'Pavo 🦃', 'Pato 🦆', 'Codornices 🐦', 'Perdices 🐦', 'Liebre 🐰',
      'Quesos tiernos 🧀', 'Queso de cabra 🧀', 'Yogures 🥛', 'Cuajada 🥛', 'Nata 🥛',
      'Crema 🥛', 'Leche pastoreo 🥛', 'Mantequilla 🧈', 'Ricotta 🧀', 'Mascarpone 🧀',
      'Vinos rosados 🍷', 'Vinos blancos 🍷', 'Cervezas 🍺', 'Sidra 🍻', 'Aguas 💧',
      'Zumos 🧃', 'Batidos 🥤', 'Limonadas 🍋', 'Aguas saborizadas 💧', 'Té frío 🍵',
      'Hierbas frescas 🌿', 'Menta 🌿', 'Albahaca 🌿', 'Cilantro 🌿', 'Eneldo 🌿',
      'Orégano fresco 🌿', 'Romero 🌿', 'Tomillo 🌿', 'Salvia 🌿', 'Estragón 🌿',
      'Rábanos 🌿', 'Cebollas tiernas 🧅', 'Ajo tierno 🧄', 'Cebollino 🌿', 'Perejil 🌿'
    ],
    5: [ // Mayo - Europa (60+ productos)
      'Fresas 🍓', 'Fresas grandes 🍓', 'Cerezas 🍒', 'Cerezas garrafales 🍒', 'Albaricoques 🍑',
      'Melocotones 🍑', 'Melocotones baby 🍑', 'Ciruelas 🍇', 'Nectarinas 🍑', 'Nísperos 🍑',
      'Kiwis 🥝', 'Manzanas 🍎', 'Peras 🍐', 'Limones 🍋', 'Naranjas 🍊',
      'Espárragos 🌿', 'Espárragos verdes 🌿', 'Judías verdes 🌿', 'Guisantes 🟢', 'Habas 🌿',
      'Alcachofas 🌿', 'Calabacines 🥒', 'Calabacines redondos 🥒', 'Berenjenas 🍆', 'Pimientos 🌶️',
      'Tomates 🍅', 'Tomates cherry 🍅', 'Tomates pera 🍅', 'Pepinos 🥒', 'Pepinillos 🥒',
      'Lechugas 🥬', 'Lechugas batavia 🥬', 'Rúcula 🌿', 'Canónigos 🌿', 'Espinacas 🌿',
      'Acelgas 🌿', 'Apio 🌿', 'Hinojo 🌿', 'Puerros 🌿', 'Cebolletas 🌿',
      'Barbacoa 🔥', 'Carbón 🔥', 'Leña 🔥', 'Parrillas 🔥', 'Sal marina 🧂',
      'Especias BBQ 🌿', 'Hierbas parrilla 🌿', 'Marinadas 🌿', 'Salsas 🍅', 'Alioli 🥒',
      'Cervezas 🍺', 'Cervezas sin alcohol 🍺', 'Vinos frescos 🍷', 'Sangría 🍷', 'Agua con gas 💧',
      'Limonadas 🍋', 'Aguas saborizadas 💧', 'Zumos naturales 🧃', 'Batidos 🥤', 'Granizados 🧊',
      'Pescado plancha 🐟', 'Sardinas 🐟', 'Caballa 🐟', 'Bonito 🐟', 'Atún 🐟',
      'Lubina 🐟', 'Dorada 🐟', 'Rape 🐟', 'Merluza 🐟', 'Rodaballo 🐟',
      'Quesos suaves 🧀', 'Quesos frescos 🧀', 'Yogur griego 🥛', 'Helados 🍦', 'Polos 🍭',
      'Sorbetes 🍧', 'Yogur helado 🥛', 'Granita 🧊', 'Smoothies 🥤', 'Batidos helados 🥤',
      'Aceite barbacoa 🫒', 'Aceite oliva 🫒', 'Vinagre balsámico 🌿', 'Mostaza 🌿', 'Kétchup 🍅',
      'Hierbas frescas 🌿', 'Albahaca 🌿', 'Menta 🌿', 'Cilantro 🌿', 'Perejil 🌿',
      'Rabanitos 🌿', 'Rábanos 🌿', 'Ajo fresco 🧄', 'Cebollas 🧅', 'Chalotes 🧅'
    ],
    6: [ // Junio - Europa (60+ productos)
      'Sandía 🍉', 'Sandía sin pepitas 🍉', 'Melón 🍈', 'Melón galia 🍈', 'Melón cantalupo 🍈',
      'Cerezas 🍒', 'Cerezas del Jerte 🍒', 'Melocotones 🍑', 'Nectarinas 🍑', 'Albaricoques 🍑',
      'Paraguayos 🍑', 'Ciruelas 🍇', 'Fresas 🍓', 'Frambuesas 🍓', 'Arándanos 🫐',
      'Tomates 🍅', 'Tomates RAF 🍅', 'Tomates cherry 🍅', 'Pepinos 🥒', 'Calabacines 🥒',
      'Berenjenas 🍆', 'Berenjenas baby 🍆', 'Pimientos 🌶️', 'Pimientos rojos 🌶️', 'Pimientos verdes 🌶️',
      'Lechugas 🥬', 'Lechugas iceberg 🥬', 'Rúcula 🌿', 'Canónigos 🌿', 'Espinacas 🌿',
      'Acelgas 🌿', 'Berros 🌿', 'Endivia 🌿', 'Escarola 🌿', 'Achicoria 🌿',
      'Judías verdes 🌿', 'Guisantes 🟢', 'Habas 🌿', 'Espárragos 🌿', 'Alcachofas 🌿',
      'Maíz 🌽', 'Maíz dulce 🌽', 'Apio 🌿', 'Hinojo 🌿', 'Puerros 🌿',
      'Protector solar ☀️', 'Crema solar ☀️', 'Sombrillas ☂️', 'Gorras 🧢', 'Gafas sol 🕶️',
      'Neveras portátiles 🧊', 'Hielo 🧊', 'Bolsas frío 🧊', 'Termos 🍵', 'Botellones agua 💧',
      'Helados 🍦', 'Granizados 🧊', 'Polos 🍭', 'Sorbetes 🍧', 'Yogur helado 🥛',
      'Agua 💧', 'Agua con gas 💧', 'Bebidas isotónicas 🥤', 'Zumos 🧃', 'Batidos 🥤',
      'Agua coco 🥥', 'Limonadas 🍋', 'Té helado 🍵', 'Café helado ☕', 'Horchata 🥛',
      'Pescado fresco 🐟', 'Lubina 🐟', 'Dorada 🐟', 'Besugo 🐟', 'Salmonetes 🐟',
      'Mariscos 🦐', 'Langostinos 🦐', 'Gambas 🦐', 'Pulpo 🐙', 'Sepia 🦑',
      'Calamares 🦑', 'Mejillones 🤪', 'Almejas 🤪', 'Berberechos 🤪', 'Navajas 🤪',
      'Ensaladas 🥗', 'Gazpachos 🍅', 'Salmorejo 🍅', 'Sopas frías 🥒', 'Cremas frías 🥛',
      'Yogures 🥛', 'Yogures griegos 🥛', 'Quesos frescos 🧀', 'Cuajada 🥛', 'Requesón 🧀',
      'Cebollas 🧅', 'Ajo 🧄', 'Cebollino 🌿', 'Albahaca 🌿', 'Orégano 🌿'
    ],
    7: [ // Julio - Europa (60+ productos)
      'Sandía 🍉', 'Sandía rayada 🍉', 'Melón 🍈', 'Melón piel de sapo 🍈', 'Melón amarillo 🍈',
      'Melocotones 🍑', 'Melocotones rojos 🍑', 'Nectarinas 🍑', 'Paraguayos 🍑', 'Ciruelas 🍇',
      'Albaricoques 🍑', 'Cerezas tardías 🍒', 'Higos tempranos 🫐', 'Arándanos 🫐', 'Grosellas 🍓',
      'Tomates 🍅', 'Tomates rosa 🍅', 'Tomates cherry 🍅', 'Pepinos 🥒', 'Calabacines 🥒',
      'Berenjenas 🍆', 'Berenjenas rayadas 🍆', 'Pimientos 🌶️', 'Pimientos italianos 🌶️', 'Pimientos del piquillo 🌶️',
      'Lechugas 🥬', 'Lechugas roble 🥬', 'Rúcula 🌿', 'Canónigos 🌿', 'Apio 🌿',
      'Hinojo 🌿', 'Puerros 🌿', 'Espinacas 🌿', 'Acelgas 🌿', 'Berros 🌿',
      'Judías verdes 🌿', 'Judiones 🌿', 'Guisantes 🟢', 'Habas 🌿', 'Calabaza 🎃',
      'Maíz 🌽', 'Maíz dulce 🌽', 'Okra 🌿', 'Edamame 🌿', 'Vainas 🌿',
      'Gazpacho 🍅', 'Gazpacho de remolacha 🍅', 'Salmorejo 🍅', 'Sopas frías 🥒', 'Cremas frías 🥛',
      'Ajoblanco 🥛', 'Vichyssoise 🥛', 'Sopa de melón 🍈', 'Gazpacho verde 🥒', 'Crema aguacate 🥑',
      'Agua 💧', 'Agua con gas 💧', 'Bebidas isotónicas 🥤', 'Zumos 🧃', 'Granizados 🧊',
      'Horchata 🥛', 'Limonadas 🍋', 'Aguas saborizadas 💧', 'Té helado 🍵', 'Batidos 🥤',
      'Pescado plancha 🐟', 'Sardinas 🐟', 'Boquerones 🐟', 'Caballa 🐟', 'Lubina 🐟',
      'Mariscos 🦐', 'Langostinos 🦐', 'Gambas 🦐', 'Pulpo 🐙', 'Sepia 🦑',
      'Calamares 🦑', 'Chipirones 🦑', 'Mejillones 🤪', 'Almejas 🤪', 'Berberechos 🤪',
      'Helados 🍦', 'Sorbetes 🍧', 'Granita 🧊', 'Polos 🍭', 'Yogur helado 🥛',
      'Aceite oliva 🫒', 'Aceite virgen extra 🫒', 'Vinagre jerez 🌿', 'Vinagre balsámico 🌿', 'Limones 🍋',
      'Ajo 🧄', 'Hierbas frescas 🌿', 'Albahaca 🌿', 'Orégano 🌿', 'Tomillo 🌿',
      'Cebollas rojas 🧅', 'Escalivada 🍆', 'Pisto 🍅', 'Ratatouille 🍆', 'Cebolletas 🌿'
    ],
    8: [ // Agosto - Europa (60+ productos)
      'Sandía 🍉', 'Sandía personal 🍉', 'Melón 🍈', 'Melón tendral 🍈', 'Melón verde 🍈',
      'Melocotones 🍑', 'Melocotones tardios 🍑', 'Nectarinas 🍑', 'Paraguayos 🍑', 'Ciruelas 🍇',
      'Higos 🫐', 'Brevas 🫐', 'Uvas tempranas 🍇', 'Peras 🍐', 'Manzanas 🍎',
      'Tomates 🍅', 'Tomates de coñar 🍅', 'Tomates pera 🍅', 'Pepinos 🥒', 'Calabacines 🥒',
      'Berenjenas 🍆', 'Berenjenas moradas 🍆', 'Pimientos 🌶️', 'Pimientos de Padrón 🌶️', 'Guindillas 🌶️',
      'Maíz 🌽', 'Maíz para palomitas 🌽', 'Judías verdes 🌿', 'Vainas 🌿', 'Calabaza 🎃',
      'Apio 🌿', 'Hinojo 🌿', 'Puerros 🌿', 'Lechugas 🥬', 'Rúcula 🌿',
      'Material escolar 📚', 'Cuadernos 📓', 'Bolígrafos ✏️', 'Lápices ✏️', 'Mochilas 🎒',
      'Estuches 📝', 'Gomas borrar ✏️', 'Reglas 📌', 'Compases 📌', 'Tijeras ✂️',
      'Conservas 🥫', 'Conservas tomate 🍅', 'Mermeladas 🍯', 'Encurtidos 🥒', 'Aceitunas 🫒',
      'Frutos secos 🌰', 'Almendras 🌰', 'Nueces 🌰', 'Avellanas 🌰', 'Piñones 🌰',
      'Agua 💧', 'Agua con gas 💧', 'Zumos 🧃', 'Batidos 🥤', 'Granizados 🧊',
      'Horchata 🥛', 'Limonadas 🍋', 'Té helado 🍵', 'Bebidas deportivas 🥤', 'Agua de coco 🥥',
      'Pescado 🐟', 'Lubina 🐟', 'Dorada 🐟', 'Salmenet 🐟', 'Mariscos 🦐',
      'Conservas pescado 🥫', 'Atún 🐟', 'Sardinas 🐟', 'Anchoas 🐟', 'Bonito 🐟',
      'Yogures 🥛', 'Yogures griegos 🥛', 'Quesos frescos 🧀', 'Helados 🍦', 'Sorbetes 🍧',
      'Granita 🧊', 'Polos 🍭', 'Yogur helado 🥛', 'Smoothies 🥤', 'Batidos helados 🥤',
      'Aceite 🫒', 'Aceite girasol 🌻', 'Vinagre 🌿', 'Sal 🧂', 'Especias 🌿',
      'Hierbas secas 🌿', 'Condimentos 🌿', 'Salsa tomate 🍅', 'Kétchup 🍅', 'Mostaza 🌿'
    ],
    9: [ // Septiembre - Europa (80+ productos)
      'Uvas 🍇', 'Uvas moscatel 🍇', 'Uvas negras 🍇', 'Higos 🫐', 'Higos chumbos 🫐',
      'Peras 🍐', 'Peras conferencia 🍐', 'Manzanas 🍎', 'Manzanas golden 🍎', 'Granadas 🔴',
      'Membrillo 🍊', 'Caquis 🟠', 'Nísperos 🍑', 'Ciruelas 🍇', 'Ciruelas claudias 🍇',
      'Melocotones tardíos 🍑', 'Nectarinas 🍑', 'Albaricoques 🍑', 'Brevas 🫐', 'Chirimoyas 🍈',
      'Calabaza 🎃', 'Calabaza butternut 🎃', 'Berenjenas 🍆', 'Pimientos 🌶️', 'Tomates 🍅',
      'Calabacines 🥒', 'Pepinos 🥒', 'Lechugas 🥬', 'Rúcula 🌿', 'Canónigos 🌿',
      'Espinacas 🌿', 'Acelgas 🌿', 'Brócoli 🥦', 'Coliflor 🥬', 'Romanesco 🥬',
      'Judías verdes 🌿', 'Guisantes 🟢', 'Habas 🌿', 'Edamame 🌿', 'Okra 🌿',
      'Setas 🍄', 'Níscalos 🍄', 'Boletus 🍄', 'Champiñones 🍄', 'Portobello 🍄',
      'Shiitake 🍄', 'Ostra 🍄', 'Rebozuelos 🍄', 'Trompetas 🍄', 'Senderuelas 🍄',
      'Castañas 🌰', 'Nueces 🌰', 'Almendras 🌰', 'Avellanas 🌰', 'Piñones 🌰',
      'Pistachos 🌰', 'Anacardos 🌰', 'Pacanas 🌰', 'Macadamias 🌰', 'Bellotas 🌰',
      'Legumbres 🌿', 'Lentejas 🌿', 'Lentejas rojas 🌿', 'Garbanzos 🌿', 'Judías 🌿',
      'Alubias 🌿', 'Azukis 🌿', 'Judías pintas 🌿', 'Soja 🌿', 'Quinoa 🌾',
      'Arroz nuevo 🌾', 'Cebada 🌾', 'Avena 🌾', 'Trigo sarraceno 🌾', 'Mijo 🌾',
      'Vino nuevo 🍷', 'Mosto 🍇', 'Sidra 🍻', 'Licores 🥃', 'Brandy 🥃',
      'Orujo 🥃', 'Pacharán 🥃', 'Anis 🥃', 'Whisky 🥃', 'Ron 🥃',
      'Pescado azul 🐟', 'Sardinas 🐟', 'Caballa 🐟', 'Bonito 🐟', 'Anchoas 🐟',
      'Atún 🐟', 'Salmón 🐟', 'Trucha 🐟', 'Lubina 🐟', 'Dorada 🐟',
      'Langostinos 🦐', 'Gambas 🦐', 'Mejillones 🦪', 'Almejas 🦪', 'Vieiras 🦪',
      'Quesos curados 🧀', 'Queso manchego 🧀', 'Cabrales 🧀', 'Roquefort 🧀', 'Parmesano 🧀',
      'Yogures 🥛', 'Kéfir 🥛', 'Leche 🥛', 'Nata 🥛', 'Mantequilla 🧈',
      'Miel nueva 🍯', 'Jalea real 🍯', 'Polen 🌿', 'Propóleo 🍯', 'Miel de castaño 🍯',
      'Aceite oliva 🫒', 'Aceite virgen extra 🫒', 'Vinagre moscatel 🌿', 'Vinagre jerez 🌿', 'Mostaza 🌿',
      'Especias otoño 🌿', 'Canela 🌿', 'Jengibre 🌿', 'Cúrcuma 🌿', 'Cardamomo 🌿',
      'Pimentón 🌶️', 'Azafrán 🌿', 'Laurel 🌿', 'Romero 🌿', 'Tomillo 🌿',
      'Chirivías 🌿', 'Colinabos 🌿', 'Nabos 🌿', 'Rábanos 🌿', 'Zanahorias 🥕',
      'Remolacha 🌿', 'Patatas nuevas 🥔', 'Boniatos 🍠', 'Ñame 🍠', 'Yuca 🍠'
    ],
    10: [ // Octubre - Europa (60+ productos)
      'Castañas 🌰', 'Castañas asadas 🌰', 'Nueces 🌰', 'Nueces frescas 🌰', 'Almendras 🌰',
      'Avellanas 🌰', 'Piñones 🌰', 'Pistachos 🌰', 'Anacardos 🌰', 'Bellotas 🌰',
      'Calabaza 🎃', 'Calabaza butternut 🎃', 'Boniatos 🍠', 'Patatas 🥔', 'Patatas nuevas 🥔',
      'Nabos 🌿', 'Remolacha 🌿', 'Zanahorias 🥕', 'Chirivias 🌿', 'Colinabos 🌿',
      'Setas 🍄', 'Níscalos 🍄', 'Boletus 🍄', 'Rebozuelos 🍄', 'Trompetas 🍄',
      'Senderuelas 🍄', 'Champiñones 🍄', 'Portobello 🍄', 'Shiitake 🍄', 'Ostra 🍄',
      'Manzanas 🍎', 'Manzanas reineta 🍎', 'Peras 🍐', 'Peras conferencia 🍐', 'Granadas 🔴',
      'Membrillo 🍊', 'Caquis 🟠', 'Higos tardíos 🫐', 'Uvas tardías 🍇', 'Kiwis 🥝',
      'Halloween 🎃', 'Decoración 🎃', 'Velas 🕯️', 'Calabazas decorativas 🎃', 'Dulces 🍬',
      'Caramelos 🍬', 'Chocolate negro 🍫', 'Golosinas 🍭', 'Frutos secos 🌰', 'Miel castaño 🍯',
      'Legumbres 🌿', 'Lentejas 🌿', 'Lentejas rojas 🌿', 'Garbanzos 🌿', 'Alubias 🌿',
      'Judías pintas 🌿', 'Azukis 🌿', 'Soja 🌿', 'Guisantes secos 🌿', 'Habas secas 🌿',
      'Caza 🦌', 'Venado 🦌', 'Jabalí 🐗', 'Liebre 🐰', 'Codorniz 🐦',
      'Perdiz 🐦', 'Fáisán 🐦', 'Cordero 🐑', 'Ternera 🐄', 'Cerdo 🐷',
      'Quesos otoño 🧀', 'Queso manchego 🧀', 'Yogures 🥛', 'Miel castañas 🍯', 'Mermeladas 🍯',
      'Compotas 🍯', 'Conservas 🥫', 'Encurtidos 🥒', 'Aceitunas 🫒', 'Frutos deshidratados 🍇',
      'Aceite oliva 🫒', 'Aceite nuevo 🫒', 'Vinagre jerez 🌿', 'Mostaza 🌿', 'Especias 🌿',
      'Hierbas secas 🌿', 'Canela 🌿', 'Jengibre 🌿', 'Cúrcuma 🌿', 'Pimentón 🌶️',
      'Coles 🥬', 'Coles de Bruselas 🥬', 'Coliflor 🥬', 'Brócoli 🥦', 'Lombarda 🥬',
      'Repollo 🥬', 'Puerros 🌿', 'Acelgas 🌿', 'Espinacas 🌿', 'Apio 🌿'
    ],
    11: [ // Noviembre - Europa (60+ productos)
      'Castañas 🌰', 'Castañas cocidas 🌰', 'Nueces 🌰', 'Nueces peladas 🌰', 'Almendras 🌰',
      'Avellanas 🌰', 'Piñones 🌰', 'Pistachos 🌰', 'Anacardos 🌰', 'Macadamias 🌰',
      'Coles 🥬', 'Coles rizadas 🥬', 'Coliflor 🥬', 'Brócoli 🥦', 'Lombardas 🥬',
      'Repollo 🥬', 'Coles de Bruselas 🥬', 'Romanesco 🥬', 'Coliflor morada 🥬', 'Kale 🥬',
      'Setas 🍄', 'Shiitake 🍄', 'Ostra 🍄', 'Champiñones 🍄', 'Portobello 🍄',
      'Boletus 🍄', 'Níscalos 🍄', 'Trompetas 🍄', 'Rebozuelos 🍄', 'Pie azul 🍄',
      'Manzanas 🍎', 'Manzanas golden 🍎', 'Peras 🍐', 'Peras blanquilla 🍐', 'Granadas 🔴',
      'Caquis 🟠', 'Kiwis 🥝', 'Naranjas 🍊', 'Mandarinas 🍊', 'Limones 🍋',
      'Caldos 🍲', 'Caldo de huesos 🍲', 'Sopas 🍲', 'Cremas 🍲', 'Potajes 🍲',
      'Cocidos 🍲', 'Purés 🍲', 'Consommés 🍲', 'Sopas instantáneas 🍲', 'Caldos vegetales 🍲',
      'Legumbres 🌿', 'Lentejas 🌿', 'Lentejas rojas 🌿', 'Garbanzos 🌿', 'Alubias 🌿',
      'Judías blancas 🌿', 'Azukis 🌿', 'Soja 🌿', 'Quinoa 🌾', 'Trigo sarraceno 🌾',
      'Pavo 🦃', 'Pavo relleno 🦃', 'Pollo 🐔', 'Caza 🦌', 'Cordero 🐑',
      'Ternera 🐄', 'Cerdo 🐷', 'Conejo 🐰', 'Liebre 🐰', 'Codorniz 🐦',
      'Quesos invierno 🧀', 'Queso manchego 🧀', 'Yogures 🥛', 'Miel 🍯', 'Jalea real 🍯',
      'Propóleo 🍯', 'Polen 🌿', 'Miel milùs 🍯', 'Miel romero 🍯', 'Miel eucalipto 🍯',
      'Aceite oliva 🫒', 'Aceite virgen extra 🫒', 'Vinagre 🌿', 'Especias calientes 🌶️', 'Canela 🌿',
      'Jengibre 🌿', 'Cúrcuma 🌿', 'Cardamomo 🌿', 'Clavo 🌿', 'Nuez moscada 🌿',
      'Puerros 🌿', 'Acelgas 🌿', 'Espinacas 🌿', 'Apio 🌿', 'Hinojo 🌿',
      'Zanahorias 🥕', 'Remolacha 🌿', 'Nabos 🌿', 'Chirivias 🌿', 'Colinabos 🌿'
    ],
    12: [ // Diciembre - Europa (60+ productos)
      'Naranjas 🍊', 'Naranjas de mesa 🍊', 'Mandarinas 🍊', 'Clementinas 🍊', 'Kiwis 🥝',
      'Granadas 🔴', 'Piña 🍍', 'Manzanas 🍎', 'Peras 🍐', 'Plátanos 🍌',
      'Castañas 🌰', 'Nueces 🌰', 'Almendras 🌰', 'Dátiles 🌰', 'Higos secos 🫐',
      'Coles Bruselas 🥬', 'Coliflor 🥬', 'Brócoli 🥦', 'Puerros 🌿', 'Apio 🌿',
      'Acelgas 🌿', 'Espinacas 🌿', 'Zanahorias 🥕', 'Remolacha 🌿', 'Nabos 🌿',
      'Pavo 🦃', 'Pavo relleno 🦃', 'Cordero 🐑', 'Cordero lechal 🐑', 'Cochinillo 🐷',
      'Ternera 🐄', 'Pollo 🐔', 'Capones 🐔', 'Pularda 🐔', 'Pato 🦆',
      'Besugo 🐟', 'Lubina 🐟', 'Dorada 🐟', 'Rodaballo 🐟', 'Lenguado 🐟',
      'Turrones 🍯', 'Turrón Jijona 🍯', 'Turrón Alicante 🍯', 'Mazapán 🍯', 'Polvorones 🍪',
      'Mantecados 🍪', 'Roscón reyes 🍞', 'Panettone 🍞', 'Pandoro 🍞', 'Stollen 🍞',
      'Frutos secos 🌰', 'Nueces peladas 🌰', 'Avellanas 🌰', 'Piñones 🌰', 'Pistachos 🌰',
      'Anacardos 🌰', 'Cacahuetes 🥜', 'Almendras tostadas 🌰', 'Pasa moscatel 🍇', 'Ciruelas pasas 🍇',
      'Mariscos 🦐', 'Langostinos tigre 🦐', 'Gambas rojas 🦐', 'Centollo 🦀', 'Bogavante 🦞',
      'Ostras 🦪', 'Almejas 🦪', 'Mejillones 🦪', 'Vieiras 🦪', 'Percebes 🦪',
      'Quesos navideños 🧀', 'Manchego curado 🧀', 'Cabrales 🧀', 'Roquefort 🧀', 'Brie 🧀',
      'Foie gras 🦆', 'Caviar beluga 🐟', 'Salmón ahumado 🐟', 'Jamón ibérico 🥓', 'Lomo embuchado 🥓',
      'Vinos especiales 🍷', 'Vinos reserva 🍷', 'Cava brut 🍾', 'Champán francés 🍾', 'Prosecco 🍾',
      'Licores navideños 🥃', 'Rompope 🥛', 'Ponche navideño 🥛', 'Brandy 🥃', 'Whisky escocés 🥃',
      'Especias navidad 🌿', 'Canela rama 🌿', 'Anís estrellado 🌿', 'Clavo olor 🌿', 'Nuez moscada 🌿',
      'Cardamomo 🌿', 'Jengibre fresco 🌿', 'Vainilla 🌿', 'Azafrán 🌿', 'Pimentón dulce 🌶️',
      'Turrón duro 🍯', 'Turrón blando 🍯', 'Dulces navideños 🍬', 'Bombones 🍫', 'Chocolate negro 🍫',
      'Miel navidad 🍯', 'Mermeladas caseras 🍯', 'Conservas gourmet 🥫', 'Velas navideñas 🕯️', 'Decoración navideña 🎄'
    ]
  },

  // Aquí puedes añadir más regiones en el futuro
  america_norte: {
    // Productos estacionales para Estados Unidos, Canadá, México
    1: ['Cítricos 🍊', 'Raíces 🥕', 'Comfort food 🍲', 'Productos calientes ☕'],
    // ... más meses
  },

  america_sur: {
    // Productos estacionales para Argentina, Chile, Brasil, etc.
    1: ['Frutas verano 🍉', 'Verduras frescas 🥬', 'Barbacoa 🔥', 'Helados 🍦'],
    // ... más meses (recuerda que es verano en enero)
  },

  asia: {
    // Productos estacionales para China, Japón, India, etc.
    1: ['Ingredientes asiáticos 🍜', 'Té 🍵', 'Especias 🌶️', 'Arroz 🍚'],
    // ... más meses
  },

  africa: {
    // Productos estacionales para diferentes países africanos
    1: ['Productos tropicales 🥭', 'Granos 🌾', 'Especias 🌿', 'Frutas 🍌'],
    // ... más meses
  }
}

// Nombres de meses en diferentes idiomas
const monthNames = {
  es: ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['', 'january', 'february', 'march', 'april', 'may', 'june',
       'july', 'august', 'september', 'october', 'november', 'december'],
  fr: ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
       'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
}

// Base de datos de información nutricional y beneficios de productos
const productInfo = {
  // Frutas
  'naranjas': 'Rica en vitamina C y antioxidantes',
  'mandarinas': 'Alta en vitamina C, fácil de pelar',
  'kiwis': 'Más vitamina C que las naranjas',
  'peras': 'Rica en fibra y potasio',
  'manzanas': 'Fibra y antioxidantes naturales',
  'fresas': 'Antioxidantes y vitamina C',
  'cerezas': 'Antiinflamatorias y antioxidantes',
  'albaricoques': 'Beta-caroteno y fibra',
  'nísperos': 'Rica en vitaminas A y C',
  'ciruelas': 'Fibra y vitaminas del grupo B',
  'melocotones': 'Vitamina A y potasio',
  'nectarinas': 'Bajo en calorías, rica en vitaminas',
  'sandía': 'Hidratante y refrescante',
  'melón': 'Alto contenido en agua y vitaminas',
  'uvas': 'Antioxidantes y resveratrol',
  'higos': 'Rica en fibra y calcio',
  'granadas': 'Potente antioxidante natural',
  'membrillo': 'Rico en pectina y taninos',
  'caquis': 'Beta-caroteno y fibra',
  'plátanos': 'Potasio y energía rápida',
  'limones': 'Vitamina C y propiedades digestivas',

  // Verduras
  'tomates': 'Licopeno y vitamina C',
  'pepinos': 'Hidratantes y bajos en calorías',
  'calabacines': 'Bajo en calorías, rico en agua',
  'berenjenas': 'Fibra y antioxidantes',
  'pimientos': 'Vitamina C y capsaicina',
  'lechugas': 'Hidratante y baja en calorías',
  'rúcula': 'Rica en hierro y calcio',
  'canónigos': 'Omega-3 y vitamina C',
  'espinacas': 'Hierro y ácido fólico',
  'acelgas': 'Vitamina K y magnesio',
  'espárragos': 'Ácido fólico y fibra',
  'alcachofas': 'Fibra y antioxidantes hepáticos',
  'habas': 'Proteína vegetal y fibra',
  'guisantes': 'Proteína y vitamina K',
  'judías verdes': 'Fibra y vitamina C',
  'coles de bruselas': 'Vitamina K y antioxidantes',
  'coliflor': 'Vitamina C y fibra',
  'brócoli': 'Superalimento rico en nutrientes',
  'puerros': 'Fibra y compuestos sulfurados',
  'apio': 'Hidratante y depurativo',
  'zanahorias': 'Beta-caroteno para la vista',
  'remolacha': 'Nitratos naturales y folatos',
  'nabos': 'Vitamina C y fibra',
  'cebollas': 'Antioxidantes y propiedades antibacterianas',
  'ajo': 'Propiedades antibióticas naturales',
  'patatas': 'Carbohidratos y potasio',
  'boniatos': 'Beta-caroteno y fibra',
  'calabaza': 'Beta-caroteno y fibra',
  'maíz': 'Carbohidratos y antioxidantes',

  // Setas
  'setas': 'Proteína vegetal y minerales',
  'níscalos': 'Proteína y sabor intenso',
  'boletus': 'Proteína y vitaminas del grupo B',
  'champiñones': 'Proteína y bajo en calorías',
  'portobello': 'Proteína y textura carnosa',
  'shiitake': 'Estimula el sistema inmune',

  // Frutos secos
  'castañas': 'Carbohidratos y fibra',
  'nueces': 'Omega-3 y proteína',
  'almendras': 'Vitamina E y calcio',
  'avellanas': 'Grasas saludables y vitamina E',
  'piñones': 'Proteína y grasas saludables',

  // Productos lácteos
  'yogur': 'Probióticos y calcio',
  'kéfir': 'Probióticos y proteína',
  'leche': 'Calcio y proteína completa',
  'queso': 'Calcio y proteína',
  'mantequilla': 'Vitaminas liposolubles',
  'nata': 'Energía y sabor cremoso',

  // Carnes y pescados
  'pollo': 'Proteína magra y vitaminas del grupo B',
  'pavo': 'Proteína baja en grasa',
  'cordero': 'Proteína y hierro',
  'cochinillo': 'Proteína y tradición culinaria',
  'besugo': 'Proteína y omega-3',
  'lubina': 'Proteína magra y fácil digestión',
  'salmón': 'Omega-3 y proteína de calidad',
  'pescado azul': 'Omega-3 para el corazón',
  'sardinas': 'Omega-3 y calcio',
  'caballa': 'Omega-3 y vitamina D',
  'merluza': 'Proteína magra y fácil digestión',
  'bacalao': 'Proteína baja en grasa',

  // Otros
  'aceite de oliva': 'Grasas monoinsaturadas saludables',
  'miel': 'Energía natural y antioxidantes',
  'chocolate': 'Antioxidantes y mejora el ánimo',
  'infusiones': 'Hidratación y propiedades relajantes',
  'té caliente': 'Antioxidantes y calor reconfortante',
  'agua': 'Hidratación esencial',
  'pan integral': 'Fibra y carbohidratos complejos',
  'arroz integral': 'Carbohidratos y fibra',
  'pasta integral': 'Energía sostenida y fibra',
  'avena': 'Fibra soluble y proteína',
  'quinoa': 'Proteína completa y sin gluten',
  'legumbres': 'Proteína vegetal y fibra',
  'lentejas': 'Proteína, hierro y fibra',
  'garbanzos': 'Proteína vegetal y minerales',
  'alubias': 'Proteína y fibra saciante'
}

/**
 * Extrae el nombre del producto sin emoji para buscar información
 */
const getProductName = (productWithEmoji) => {
  return productWithEmoji.replace(/[^\w\s-]/g, '').trim().toLowerCase()
}

/**
 * Obtiene información nutricional del producto
 */
const getProductInfo = (productName) => {
  const cleanName = getProductName(productName)

  // Buscar coincidencias exactas o parciales
  for (const [key, info] of Object.entries(productInfo)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return info
    }
  }

  // Fallback genérico
  return 'Producto fresco de temporada'
}

/**
 * Obtiene productos estacionales basados en mes, región y país
 */
export const getSeasonalProducts = (month, region = null, language = null) => {
  const userRegion = region || detectUserRegion()
  const userLanguage = language || detectUserLanguage()
  const products = seasonalDatabase[userRegion]?.[month] || seasonalDatabase.europa[month] || []

  return products.map(product => ({
    item: translateProduct(product, userLanguage),
    reason: getProductInfo(product),
    confidence: 0.9,
    type: 'seasonal_local',
    priority: 'high',
    region: userRegion,
    month: month
  }))
}

/**
 * Obtiene el nombre del mes en el idioma especificado
 */
export const getMonthName = (month, language = 'es') => {
  return monthNames[language][month] || monthNames.es[month] || 'mes'
}

/**
 * Detecta la región del usuario (puedes expandir esta lógica)
 */
export const getUserRegion = () => {
  return detectUserRegion()
}

// Base de datos de productos bajos en calorías/dieta (60+ productos)
const dietProducts = [
  // Verduras bajas en calorías
  { item: 'Pepino 🥒', calories: '16 kcal/100g', fat: '0.1g', sugar: '3.6g', reason: 'Muy bajo en calorías, hidratante' },
  { item: 'Apio 🌿', calories: '14 kcal/100g', fat: '0.2g', sugar: '1.4g', reason: 'Diurético natural, alto en fibra' },
  { item: 'Espinacas 🌿', calories: '23 kcal/100g', fat: '0.4g', sugar: '0.4g', reason: 'Rico en hierro, bajo en calorías' },
  { item: 'Lechuga 🥬', calories: '15 kcal/100g', fat: '0.2g', sugar: '2.9g', reason: 'Base perfecta para ensaladas' },
  { item: 'Rúcula 🌿', calories: '25 kcal/100g', fat: '0.7g', sugar: '2.1g', reason: 'Antioxidantes y sabor intenso' },
  { item: 'Coliflor 🥬', calories: '25 kcal/100g', fat: '0.3g', sugar: '4.9g', reason: 'Sustituto del arroz y pasta' },
  { item: 'Brócoli 🥦', calories: '34 kcal/100g', fat: '0.4g', sugar: '1.5g', reason: 'Superalimento, alto en vitaminas' },
  { item: 'Calabacín 🥒', calories: '17 kcal/100g', fat: '0.3g', sugar: '2.5g', reason: 'Versátil y saciante' },
  { item: 'Tomate cherry 🍅', calories: '18 kcal/100g', fat: '0.2g', sugar: '2.6g', reason: 'Antioxidantes, perfecto snack' },
  { item: 'Pimiento rojo 🌶️', calories: '31 kcal/100g', fat: '0.3g', sugar: '4.2g', reason: 'Alto en vitamina C' },

  // Frutas bajas en calorías
  { item: 'Sandía 🍉', calories: '30 kcal/100g', fat: '0.2g', sugar: '6.2g', reason: 'Hidratante, refrescante' },
  { item: 'Fresas 🍓', calories: '32 kcal/100g', fat: '0.3g', sugar: '4.9g', reason: 'Antioxidantes, bajo índice glucémico' },
  { item: 'Melón 🍈', calories: '34 kcal/100g', fat: '0.2g', sugar: '8.2g', reason: 'Vitaminas A y C' },
  { item: 'Papaya 🥭', calories: '43 kcal/100g', fat: '0.3g', sugar: '7.8g', reason: 'Enzimas digestivas' },
  { item: 'Arándanos 🫐', calories: '57 kcal/100g', fat: '0.3g', sugar: '10g', reason: 'Potente antioxidante' },
  { item: 'Frambuesas 🍓', calories: '52 kcal/100g', fat: '0.7g', sugar: '4.4g', reason: 'Alto en fibra' },
  { item: 'Moras 🍓', calories: '43 kcal/100g', fat: '0.5g', sugar: '4.9g', reason: 'Vitamina C y fibra' },
  { item: 'Limón 🍋', calories: '29 kcal/100g', fat: '0.3g', sugar: '1.5g', reason: 'Detox natural, vitamina C' },
  { item: 'Pomelo 🍊', calories: '42 kcal/100g', fat: '0.1g', sugar: '6.9g', reason: 'Quemagrasa natural' },
  { item: 'Kiwi 🥝', calories: '61 kcal/100g', fat: '0.5g', sugar: '9g', reason: 'Vitamina C, fibra digestiva' },

  // Proteínas magras
  { item: 'Pechuga pollo 🐔', calories: '165 kcal/100g', fat: '3.6g', sugar: '0g', reason: 'Proteína magra de calidad' },
  { item: 'Pavo 🦃', calories: '135 kcal/100g', fat: '1.4g', sugar: '0g', reason: 'Bajo en grasa y sodio' },
  { item: 'Merluza 🐟', calories: '90 kcal/100g', fat: '2g', sugar: '0g', reason: 'Pescado blanco magro' },
  { item: 'Bacalao 🐟', calories: '82 kcal/100g', fat: '0.7g', sugar: '0g', reason: 'Alto en proteínas' },
  { item: 'Lenguado 🐟', calories: '86 kcal/100g', fat: '1.2g', sugar: '0g', reason: 'Pescado magro digestivo' },
  { item: 'Lubina 🐟', calories: '97 kcal/100g', fat: '1.5g', sugar: '0g', reason: 'Omega-3 y proteínas' },
  { item: 'Gamba 🦐', calories: '85 kcal/100g', fat: '1.4g', sugar: '0g', reason: 'Marisco bajo en calorías' },
  { item: 'Pulpo 🐙', calories: '82 kcal/100g', fat: '1g', sugar: '0g', reason: 'Alto en proteínas' },
  { item: 'Sepia 🦑', calories: '79 kcal/100g', fat: '1.4g', sugar: '0g', reason: 'Bajo en grasa' },
  { item: 'Clara huevo 🥚', calories: '52 kcal/100g', fat: '0.2g', sugar: '0.7g', reason: 'Proteína pura' },

  // Lácteos bajos en grasa
  { item: 'Yogur 0% 🥛', calories: '56 kcal/100g', fat: '0.2g', sugar: '4g', reason: 'Probióticos sin grasa' },
  { item: 'Queso fresco 0% 🧀', calories: '72 kcal/100g', fat: '0.2g', sugar: '4g', reason: 'Calcio sin grasa' },
  { item: 'Requesón light 🧀', calories: '98 kcal/100g', fat: '4.3g', sugar: '3.4g', reason: 'Proteínas y bajo en grasa' },
  { item: 'Leche desnatada 🥛', calories: '34 kcal/100ml', fat: '0.1g', sugar: '4.8g', reason: 'Calcio sin grasa' },
  { item: 'Kéfir light 🥛', calories: '41 kcal/100g', fat: '1g', sugar: '4g', reason: 'Probióticos digestivos' },

  // Cereales y legumbres integrales
  { item: 'Avena integral 🌾', calories: '389 kcal/100g', fat: '6.9g', sugar: '0.9g', reason: 'Fibra saciante, lenta absorción' },
  { item: 'Quinoa 🌾', calories: '368 kcal/100g', fat: '6.1g', sugar: '0g', reason: 'Proteína completa sin gluten' },
  { item: 'Arroz integral 🌾', calories: '363 kcal/100g', fat: '2.9g', sugar: '0.9g', reason: 'Carbohidrato complejo' },
  { item: 'Lentejas 🌿', calories: '116 kcal/100g', fat: '0.4g', sugar: '1.8g', reason: 'Proteína vegetal y fibra' },
  { item: 'Garbanzos 🌿', calories: '164 kcal/100g', fat: '2.6g', sugar: '2.8g', reason: 'Saciantes y nutritivos' },

  // Snacks saludables
  { item: 'Palitos zanahoria 🥕', calories: '41 kcal/100g', fat: '0.2g', sugar: '4.7g', reason: 'Crujiente y natural' },
  { item: 'Apio con hummus 🌿', calories: '50 kcal/porción', fat: '2g', sugar: '3g', reason: 'Snack saciante' },
  { item: 'Tomates cherry 🍅', calories: '18 kcal/100g', fat: '0.2g', sugar: '2.6g', reason: 'Antioxidantes naturales' },
  { item: 'Gelatina 0% 🍮', calories: '8 kcal/100g', fat: '0g', sugar: '0g', reason: 'Postre sin calorías' },
  { item: 'Infusión natural 🍵', calories: '2 kcal/taza', fat: '0g', sugar: '0g', reason: 'Hidratación sin calorías' },

  // Condimentos y especias
  { item: 'Vinagre balsámico 🌿', calories: '88 kcal/100ml', fat: '0g', sugar: '15g', reason: 'Sabor intenso, pocas calorías' },
  { item: 'Limón exprimido 🍋', calories: '7 kcal/cucharada', fat: '0g', sugar: '0.4g', reason: 'Sabor cítrico natural' },
  { item: 'Hierbas frescas 🌿', calories: '5 kcal/10g', fat: '0g', sugar: '0g', reason: 'Sabor sin calorías' },
  { item: 'Especias naturales 🌿', calories: '5 kcal/cucharadita', fat: '0g', sugar: '0g', reason: 'Acelera metabolismo' },
  { item: 'Mostaza sin azúcar 🌿', calories: '5 kcal/cucharadita', fat: '0g', sugar: '0g', reason: 'Condimento bajo en calorías' },

  // Bebidas
  { item: 'Agua con gas 💧', calories: '0 kcal/100ml', fat: '0g', sugar: '0g', reason: 'Hidratación saciante' },
  { item: 'Té verde 🍵', calories: '2 kcal/taza', fat: '0g', sugar: '0g', reason: 'Antioxidante, acelera metabolismo' },
  { item: 'Café solo ☕', calories: '2 kcal/taza', fat: '0g', sugar: '0g', reason: 'Estimulante natural' },
  { item: 'Agua de coco 🥥', calories: '19 kcal/100ml', fat: '0.2g', sugar: '3.7g', reason: 'Electrolitos naturales' },
  { item: 'Caldo verduras 🍲', calories: '12 kcal/100ml', fat: '0.3g', sugar: '1.4g', reason: 'Saciante y reconfortante' },

  // Productos especiales diet
  { item: 'Shirataki noodles 🍜', calories: '9 kcal/100g', fat: '0g', sugar: '0g', reason: 'Pasta sin calorías' },
  { item: 'Coliflor arroz 🥬', calories: '25 kcal/100g', fat: '0.3g', sugar: '4.9g', reason: 'Sustituto del arroz' },
  { item: 'Espaguetis calabacín 🥒', calories: '20 kcal/100g', fat: '0.4g', sugar: '2.7g', reason: 'Pasta vegetal' },
  { item: 'Chips kale 🥬', calories: '50 kcal/10g', fat: '3.5g', sugar: '1g', reason: 'Snack crujiente saludable' },
  { item: 'Edulcorante stevia 🌿', calories: '0 kcal/sobre', fat: '0g', sugar: '0g', reason: 'Endulzante natural' },

  // Frutos secos en pequeñas cantidades
  { item: 'Almendras (10 unidades) 🌰', calories: '58 kcal/10g', fat: '4.9g', sugar: '0.9g', reason: 'Grasa saludable controlada' },
  { item: 'Nueces (3 unidades) 🌰', calories: '43 kcal/6g', fat: '4.3g', sugar: '0.1g', reason: 'Omega-3 en porción controlada' }
]

// Traducciones de productos a diferentes idiomas
const productTranslations = {
  // Frutas
  'naranjas': { en: 'Oranges 🍊', de: 'Orangen 🍊', es: 'Naranjas 🍊', it: 'Arance 🍊', fr: 'Oranges 🍊', pt: 'Laranjas 🍊', nl: 'Sinaasappels 🍊', sv: 'Apelsiner 🍊', da: 'Appelsiner 🍊', fi: 'Appelsiinit 🍊', no: 'Appelsiner 🍊', ru: 'Апельсины 🍊', zh: '橙子 🍊', ja: 'オレンジ 🍊', ko: '오렌지 🍊', ar: 'برتقال 🍊', he: 'תפוזים 🍊', tr: 'Portakallar 🍊', hu: 'Narancsok 🍊', hi: 'संतरे 🍊' },
  'mandarinas': { en: 'Mandarins 🍊', de: 'Mandarinen 🍊', es: 'Mandarinas 🍊', it: 'Mandarini 🍊', fr: 'Mandarines 🍊', pt: 'Tangerinas 🍊', nl: 'Mandarijnen 🍊', sv: 'Mandariner 🍊', da: 'Mandariner 🍊', fi: 'Mandariinit 🍊', no: 'Mandariner 🍊', ru: 'Мандарины 🍊', zh: '橘子 🍊', ja: 'みかん 🍊', ko: '귤 🍊', ar: 'يوسفي 🍊', he: 'מנדרינות 🍊', tr: 'Mandalina 🍊', hu: 'Mandarin 🍊', hi: 'संतरा 🍊' },
  'kiwis': { en: 'Kiwis 🥝', de: 'Kiwis 🥝', es: 'Kiwis 🥝', it: 'Kiwi 🥝', fr: 'Kiwis 🥝', pt: 'Kiwis 🥝', nl: 'Kiwi\'s 🥝', sv: 'Kiwi 🥝', da: 'Kiwi 🥝', fi: 'Kiivit 🥝', no: 'Kiwi 🥝', ru: 'Киви 🥝', zh: '猕猴桃 🥝', ja: 'キウイ 🥝', ko: '키위 🥝', ar: 'كيوي 🥝', he: 'קיווי 🥝', tr: 'Kivi 🥝', hu: 'Kivi 🥝', hi: 'कीवी 🥝' },
  'peras': { en: 'Pears 🍐', de: 'Birnen 🍐', es: 'Peras 🍐', it: 'Pere 🍐', fr: 'Poires 🍐', pt: 'Peras 🍐', nl: 'Peren 🍐', sv: 'Päron 🍐', da: 'Pærer 🍐', fi: 'Päärynät 🍐', no: 'Pærer 🍐', ru: 'Груши 🍐', zh: '梨 🍐', ja: '洋梨 🍐', ko: '배 🍐', ar: 'كمثرى 🍐', he: 'אגסים 🍐', tr: 'Armut 🍐', hu: 'Körte 🍐', hi: 'नाशपाती 🍐' },
  'manzanas': { en: 'Apples 🍎', de: 'Äpfel 🍎', es: 'Manzanas 🍎', it: 'Mele 🍎', fr: 'Pommes 🍎', pt: 'Maçãs 🍎', nl: 'Appels 🍎', sv: 'Äpplen 🍎', da: 'Æbler 🍎', fi: 'Omenat 🍎', no: 'Epler 🍎', ru: 'Яблоки 🍎', zh: '苹果 🍎', ja: 'りんご 🍎', ko: '사과 🍎', ar: 'تفاح 🍎', he: 'תפוחים 🍎', tr: 'Elma 🍎', hu: 'Alma 🍎', hi: 'सेब 🍎' },
  'fresas': { en: 'Strawberries 🍓', de: 'Erdbeeren 🍓', es: 'Fresas 🍓', it: 'Fragole 🍓', fr: 'Fraises 🍓', pt: 'Morangos 🍓', nl: 'Aardbeien 🍓', sv: 'Jordgubbar 🍓', da: 'Jordbær 🍓', fi: 'Mansikat 🍓', no: 'Jordbær 🍓', ru: 'Клубника 🍓', zh: '草莓 🍓', ja: 'いちご 🍓', ko: '딸기 🍓', ar: 'فراولة 🍓', he: 'תותים 🍓', tr: 'Çilek 🍓', hu: 'Eper 🍓', hi: 'स्ट्रॉबेरी 🍓' },
  'cerezas': { en: 'Cherries 🍒', de: 'Kirschen 🍒', es: 'Cerezas 🍒', it: 'Ciliegie 🍒', fr: 'Cerises 🍒', pt: 'Cerejas 🍒', nl: 'Kersen 🍒', sv: 'Körsbär 🍒', da: 'Kirsebær 🍒', fi: 'Kirsikat 🍒', no: 'Kirsebær 🍒', ru: 'Вишня 🍒', zh: '樱桃 🍒', ja: 'さくらんぼ 🍒', ko: '체리 🍒', ar: 'كرز 🍒', he: 'דובדבנים 🍒', tr: 'Kiraz 🍒', hu: 'Cseresznye 🍒', hi: 'चेरी 🍒' },
  'melocotones': { en: 'Peaches 🍑', de: 'Pfirsiche 🍑', es: 'Melocotones 🍑', it: 'Pesche 🍑', fr: 'Pêches 🍑', pt: 'Pêssegos 🍑', nl: 'Perziken 🍑', sv: 'Persikor 🍑', da: 'Ferskner 🍑', fi: 'Persikat 🍑', no: 'Fersken 🍑', ru: 'Персики 🍑', zh: '桃子 🍑', ja: '桃 🍑', ko: '복숭아 🍑', ar: 'خوخ 🍑', he: 'אפרסקים 🍑', tr: 'Şeftali 🍑', hu: 'Őszibarack 🍑', hi: 'आड़ू 🍑' },
  'sandía': { en: 'Watermelon 🍉', de: 'Wassermelone 🍉', es: 'Sandía 🍉', it: 'Anguria 🍉', fr: 'Pastèque 🍉', pt: 'Melancia 🍉', nl: 'Watermeloen 🍉', sv: 'Vattenmelon 🍉', da: 'Vandmelon 🍉', fi: 'Vesimeloni 🍉', no: 'Vannmelon 🍉', ru: 'Арбуз 🍉', zh: '西瓜 🍉', ja: 'スイカ 🍉', ko: '수박 🍉', ar: 'بطيخ 🍉', he: 'אבטיח 🍉', tr: 'Karpuz 🍉', hu: 'Görögdinnye 🍉', hi: 'तरबूज 🍉' },
  'melón': { en: 'Melon 🍈', de: 'Melone 🍈', es: 'Melón 🍈', it: 'Melone 🍈', fr: 'Melon 🍈', pt: 'Melão 🍈', nl: 'Meloen 🍈', sv: 'Melon 🍈', da: 'Melon 🍈', fi: 'Meloni 🍈', no: 'Melon 🍈', ru: 'Дыня 🍈', zh: '甜瓜 🍈', ja: 'メロン 🍈', ko: '멜론 🍈', ar: 'شمام 🍈', he: 'מלון 🍈', tr: 'Kavun 🍈', hu: 'Dinnye 🍈', hi: 'खरबूजा 🍈' },
  'plátanos': { en: 'Bananas 🍌', de: 'Bananen 🍌', es: 'Plátanos 🍌', it: 'Banane 🍌', fr: 'Bananes 🍌', pt: 'Bananas 🍌', nl: 'Bananen 🍌', sv: 'Bananer 🍌', da: 'Bananer 🍌', fi: 'Banaanit 🍌', no: 'Bananer 🍌', ru: 'Бананы 🍌', zh: '香蕉 🍌', ja: 'バナナ 🍌', ko: '바나나 🍌', ar: 'موز 🍌', he: 'בננות 🍌', tr: 'Muz 🍌', hu: 'Banán 🍌', hi: 'केला 🍌' },
  'uvas': { en: 'Grapes 🍇', de: 'Trauben 🍇', es: 'Uvas 🍇', it: 'Uva 🍇', fr: 'Raisins 🍇', pt: 'Uvas 🍇', nl: 'Druiven 🍇', sv: 'Druvor 🍇', da: 'Druer 🍇', fi: 'Viinirypäleet 🍇', no: 'Druer 🍇', ru: 'Виноград 🍇', zh: '葡萄 🍇', ja: 'ぶどう 🍇', ko: '포도 🍇', ar: 'عنب 🍇', he: 'ענבים 🍇', tr: 'Üzüm 🍇', hu: 'Szőlő 🍇', hi: 'अंगूर 🍇' },
  'limones': { en: 'Lemons 🍋', de: 'Zitronen 🍋', es: 'Limones 🍋', it: 'Limoni 🍋', fr: 'Citrons 🍋', pt: 'Limões 🍋', nl: 'Citroenen 🍋', sv: 'Citroner 🍋', da: 'Citroner 🍋', fi: 'Sitruunat 🍋', no: 'Sitroner 🍋', ru: 'Лимоны 🍋', zh: '柠檬 🍋', ja: 'レモン 🍋', ko: '레몬 🍋', ar: 'ليمون 🍋', he: 'לימונים 🍋', tr: 'Limon 🍋', hu: 'Citrom 🍋', hi: 'नींबू 🍋' },

  // Verduras
  'tomates': { en: 'Tomatoes 🍅', de: 'Tomaten 🍅', es: 'Tomates 🍅', it: 'Pomodori 🍅', fr: 'Tomates 🍅', pt: 'Tomates 🍅', nl: 'Tomaten 🍅', sv: 'Tomater 🍅', da: 'Tomater 🍅', fi: 'Tomaatit 🍅', no: 'Tomater 🍅', ru: 'Помидоры 🍅', zh: '番茄 🍅', ja: 'トマト 🍅', ko: '토마토 🍅', ar: 'طماطم 🍅', he: 'עגבניות 🍅', tr: 'Domates 🍅', hu: 'Paradicsom 🍅', hi: 'टमाटर 🍅' },
  'pepinos': { en: 'Cucumbers 🥒', de: 'Gurken 🥒', es: 'Pepinos 🥒', it: 'Cetrioli 🥒', fr: 'Concombres 🥒', pt: 'Pepinos 🥒', nl: 'Komkommers 🥒', sv: 'Gurkor 🥒', da: 'Agurker 🥒', fi: 'Kurkut 🥒', no: 'Agurker 🥒', ru: 'Огурцы 🥒', zh: '黄瓜 🥒', ja: 'きゅうり 🥒', ko: '오이 🥒', ar: 'خيار 🥒', he: 'מלפפונים 🥒', tr: 'Salatalık 🥒', hu: 'Uborka 🥒', hi: 'खीरा 🥒' },
  'calabacines': { en: 'Zucchini 🥒', de: 'Zucchini 🥒', es: 'Calabacines 🥒', it: 'Zucchine 🥒', fr: 'Courgettes 🥒', pt: 'Abobrinhas 🥒', nl: 'Courgettes 🥒', sv: 'Zucchini 🥒', da: 'Squash 🥒', fi: 'Kesäkurpitsa 🥒', no: 'Squash 🥒', ru: 'Кабачки 🥒', zh: '西葫芦 🥒', ja: 'ズッキーニ 🥒', ko: '호박 🥒', ar: 'كوسة 🥒', he: 'קישואים 🥒', tr: 'Kabak 🥒', hu: 'Cukkini 🥒', hi: 'तोरी 🥒' },
  'berenjenas': { en: 'Eggplants 🍆', de: 'Auberginen 🍆', es: 'Berenjenas 🍆', it: 'Melanzane 🍆', fr: 'Aubergines 🍆', pt: 'Berinjelas 🍆', nl: 'Aubergines 🍆', sv: 'Auberginer 🍆', da: 'Auberginer 🍆', fi: 'Munakoisot 🍆', no: 'Auberginer 🍆', ru: 'Баклажаны 🍆', zh: '茄子 🍆', ja: 'ナス 🍆', ko: '가지 🍆', ar: 'باذنجان 🍆', he: 'חצילים 🍆', tr: 'Patlıcan 🍆', hu: 'Padlizsán 🍆', hi: 'बैंगन 🍆' },
  'pimientos': { en: 'Peppers 🌶️', de: 'Paprika 🌶️', es: 'Pimientos 🌶️', it: 'Peperoni 🌶️', fr: 'Poivrons 🌶️', pt: 'Pimentões 🌶️', nl: 'Paprika\'s 🌶️', sv: 'Paprika 🌶️', da: 'Peberfrugt 🌶️', fi: 'Paprikat 🌶️', no: 'Paprika 🌶️', ru: 'Перцы 🌶️', zh: '辣椒 🌶️', ja: 'ピーマン 🌶️', ko: '고추 🌶️', ar: 'فلفل 🌶️', he: 'פלפלים 🌶️', tr: 'Biber 🌶️', hu: 'Paprika 🌶️', hi: 'मिर्च 🌶️' },
  'lechugas': { en: 'Lettuce 🥬', de: 'Salat 🥬', es: 'Lechugas 🥬', it: 'Lattuga 🥬', fr: 'Laitue 🥬', pt: 'Alface 🥬', nl: 'Sla 🥬', sv: 'Sallad 🥬', da: 'Salat 🥬', fi: 'Salaatti 🥬', no: 'Salat 🥬', ru: 'Салат 🥬', zh: '生菜 🥬', ja: 'レタス 🥬', ko: '양상추 🥬', ar: 'خس 🥬', he: 'חסה 🥬', tr: 'Marul 🥬', hu: 'Saláta 🥬', hi: 'सलाद 🥬' },
  'espinacas': { en: 'Spinach 🌿', de: 'Spinat 🌿', es: 'Espinacas 🌿', it: 'Spinaci 🌿', fr: 'Épinards 🌿', pt: 'Espinafres 🌿', nl: 'Spinazie 🌿', sv: 'Spenat 🌿', da: 'Spinat 🌿', fi: 'Pinaatti 🌿', no: 'Spinat 🌿', ru: 'Шпинат 🌿', zh: '菠菜 🌿', ja: 'ほうれん草 🌿', ko: '시금치 🌿', ar: 'سبانخ 🌿', he: 'תרד 🌿', tr: 'Ispanak 🌿', hu: 'Spenót 🌿', hi: 'पालक 🌿' },
  'acelgas': { en: 'Chard 🌿', de: 'Mangold 🌿', es: 'Acelgas 🌿', it: 'Bietole 🌿', fr: 'Blettes 🌿', pt: 'Acelga 🌿', nl: 'Snijbiet 🌿', sv: 'Mangold 🌿', da: 'Mangold 🌿', fi: 'Lehtijuurikas 🌿', no: 'Mangold 🌿', ru: 'Мангольд 🌿', zh: '甜菜叶 🌿', ja: 'フダンソウ 🌿', ko: '근대 🌿', ar: 'سلق 🌿', he: 'עלי סלק 🌿', tr: 'Pazı 🌿', hu: 'Mángold 🌿', hi: 'चुकंदर 🌿' },
  'brócoli': { en: 'Broccoli 🥦', de: 'Brokkoli 🥦', es: 'Brócoli 🥦', it: 'Broccoli 🥦', fr: 'Brocoli 🥦', pt: 'Brócolis 🥦', nl: 'Broccoli 🥦', sv: 'Broccoli 🥦', da: 'Broccoli 🥦', fi: 'Parsakaali 🥦', no: 'Brokkoli 🥦', ru: 'Брокколи 🥦', zh: '西兰花 🥦', ja: 'ブロッコリー 🥦', ko: '브로콜리 🥦', ar: 'بروكلي 🥦', he: 'ברוקולי 🥦', tr: 'Brokoli 🥦', hu: 'Brokkoli 🥦', hi: 'ब्रोकली 🥦' },
  'coliflor': { en: 'Cauliflower 🥬', de: 'Blumenkohl 🥬', es: 'Coliflor 🥬', it: 'Cavolfiore 🥬', fr: 'Chou-fleur 🥬', pt: 'Couve-flor 🥬', nl: 'Bloemkool 🥬', sv: 'Blomkål 🥬', da: 'Blomkål 🥬', fi: 'Kukkakaali 🥬', no: 'Blomkål 🥬', ru: 'Цветная капуста 🥬', zh: '花椰菜 🥬', ja: 'カリフラワー 🥬', ko: '콜리플라워 🥬', ar: 'قرنبيط 🥬', he: 'כרובית 🥬', tr: 'Karnabahar 🥬', hu: 'Karfiol 🥬', hi: 'फूलगोभी 🥬' },
  'zanahorias': { en: 'Carrots 🥕', de: 'Karotten 🥕', es: 'Zanahorias 🥕', it: 'Carote 🥕', fr: 'Carottes 🥕', pt: 'Cenouras 🥕', nl: 'Wortels 🥕', sv: 'Morötter 🥕', da: 'Gulerødder 🥕', fi: 'Porkkanat 🥕', no: 'Gulrøtter 🥕', ru: 'Морковь 🥕', zh: '胡萝卜 🥕', ja: 'にんじん 🥕', ko: '당근 🥕', ar: 'جزر 🥕', he: 'גזר 🥕', tr: 'Havuç 🥕', hu: 'Sárgarépa 🥕', hi: 'गाजर 🥕' },
  'cebollas': { en: 'Onions 🧅', de: 'Zwiebeln 🧅', es: 'Cebollas 🧅', it: 'Cipolle 🧅', fr: 'Oignons 🧅', pt: 'Cebolas 🧅', nl: 'Uien 🧅', sv: 'Lök 🧅', da: 'Løg 🧅', fi: 'Sipulit 🧅', no: 'Løk 🧅', ru: 'Лук 🧅', zh: '洋葱 🧅', ja: 'たまねぎ 🧅', ko: '양파 🧅', ar: 'بصل 🧅', he: 'בצל 🧅', tr: 'Soğan 🧅', hu: 'Hagyma 🧅', hi: 'प्याज 🧅' },
  'ajo': { en: 'Garlic 🧄', de: 'Knoblauch 🧄', es: 'Ajo 🧄', it: 'Aglio 🧄', fr: 'Ail 🧄', pt: 'Alho 🧄', nl: 'Knoflook 🧄', sv: 'Vitlök 🧄', da: 'Hvidløg 🧄', fi: 'Valkosipuli 🧄', no: 'Hvitløk 🧄', ru: 'Чеснок 🧄', zh: '大蒜 🧄', ja: 'にんにく 🧄', ko: '마늘 🧄', ar: 'ثوم 🧄', he: 'שום 🧄', tr: 'Sarımsak 🧄', hu: 'Fokhagyma 🧄', hi: 'लहसुन 🧄' },
  'patatas': { en: 'Potatoes 🥔', de: 'Kartoffeln 🥔', es: 'Patatas 🥔', it: 'Patate 🥔', fr: 'Pommes de terre 🥔', pt: 'Batatas 🥔', nl: 'Aardappels 🥔', sv: 'Potatis 🥔', da: 'Kartofler 🥔', fi: 'Perunat 🥔', no: 'Poteter 🥔', ru: 'Картофель 🥔', zh: '土豆 🥔', ja: 'じゃがいも 🥔', ko: '감자 🥔', ar: 'بطاطس 🥔', he: 'תפוחי אדמה 🥔', tr: 'Patates 🥔', hu: 'Burgonya 🥔', hi: 'आलू 🥔' },
  'calabaza': { en: 'Pumpkin 🎃', de: 'Kürbis 🎃', es: 'Calabaza 🎃', it: 'Zucca 🎃', fr: 'Citrouille 🎃', pt: 'Abóbora 🎃', nl: 'Pompoen 🎃', sv: 'Pumpa 🎃', da: 'Græskar 🎃', fi: 'Kurpitsa 🎃', no: 'Gresskar 🎃', ru: 'Тыква 🎃', zh: '南瓜 🎃', ja: 'かぼちゃ 🎃', ko: '호박 🎃', ar: 'يقطين 🎃', he: 'דלעת 🎃', tr: 'Balkabağı 🎃', hu: 'Tök 🎃', hi: 'कद्दू 🎃' },

  // Proteínas
  'pollo': { en: 'Chicken 🐔', de: 'Hähnchen 🐔', es: 'Pollo 🐔', it: 'Pollo 🐔', fr: 'Poulet 🐔', pt: 'Frango 🐔', nl: 'Kip 🐔', sv: 'Kyckling 🐔', da: 'Kylling 🐔', fi: 'Kana 🐔', no: 'Kylling 🐔', ru: 'Курица 🐔', zh: '鸡肉 🐔', ja: '鶏肉 🐔', ko: '닭고기 🐔', ar: 'دجاج 🐔', he: 'עוף 🐔', tr: 'Tavuk 🐔', hu: 'Csirke 🐔', hi: 'चिकन 🐔' },
  'pavo': { en: 'Turkey 🦃', de: 'Truthahn 🦃', es: 'Pavo 🦃', it: 'Tacchino 🦃', fr: 'Dinde 🦃', pt: 'Peru 🦃', nl: 'Kalkoen 🦃', sv: 'Kalkon 🦃', da: 'Kalkun 🦃', fi: 'Kalkkuna 🦃', no: 'Kalkun 🦃', ru: 'Индейка 🦃', zh: '火鸡 🦃', ja: '七面鳥 🦃', ko: '칠면조 🦃', ar: 'ديك رومي 🦃', he: 'הודו 🦃', tr: 'Hindi 🦃', hu: 'Pulyka 🦃', hi: 'टर्की 🦃' },
  'pescado': { en: 'Fish 🐟', de: 'Fisch 🐟', es: 'Pescado 🐟', it: 'Pesce 🐟', fr: 'Poisson 🐟', pt: 'Peixe 🐟', nl: 'Vis 🐟', sv: 'Fisk 🐟', da: 'Fisk 🐟', fi: 'Kala 🐟', no: 'Fisk 🐟', ru: 'Рыба 🐟', zh: '鱼 🐟', ja: '魚 🐟', ko: '생선 🐟', ar: 'سمك 🐟', he: 'דג 🐟', tr: 'Balık 🐟', hu: 'Hal 🐟', hi: 'मछली 🐟' },
  'salmón': { en: 'Salmon 🐟', de: 'Lachs 🐟', es: 'Salmón 🐟', it: 'Salmone 🐟', fr: 'Saumon 🐟', pt: 'Salmão 🐟', nl: 'Zalm 🐟', sv: 'Lax 🐟', da: 'Laks 🐟', fi: 'Lohi 🐟', no: 'Laks 🐟', ru: 'Лосось 🐟', zh: '三文鱼 🐟', ja: 'サーモン 🐟', ko: '연어 🐟', ar: 'سلمون 🐟', he: 'סלמון 🐟', tr: 'Somon 🐟', hu: 'Lazac 🐟', hi: 'सैल्मन 🐟' },

  // Lácteos
  'yogur': { en: 'Yogurt 🥛', de: 'Joghurt 🥛', es: 'Yogur 🥛', it: 'Yogurt 🥛', fr: 'Yaourt 🥛', pt: 'Iogurte 🥛', nl: 'Yoghurt 🥛', sv: 'Yoghurt 🥛', da: 'Yoghurt 🥛', fi: 'Jogurtti 🥛', no: 'Yoghurt 🥛', ru: 'Йогурт 🥛', zh: '酸奶 🥛', ja: 'ヨーグルト 🥛', ko: '요거트 🥛', ar: 'زبادي 🥛', he: 'יוגורט 🥛', tr: 'Yoğurt 🥛', hu: 'Joghurt 🥛', hi: 'दही 🥛' },
  'queso': { en: 'Cheese 🧀', de: 'Käse 🧀', es: 'Queso 🧀', it: 'Formaggio 🧀', fr: 'Fromage 🧀', pt: 'Queijo 🧀', nl: 'Kaas 🧀', sv: 'Ost 🧀', da: 'Ost 🧀', fi: 'Juusto 🧀', no: 'Ost 🧀', ru: 'Сыр 🧀', zh: '奶酪 🧀', ja: 'チーズ 🧀', ko: '치즈 🧀', ar: 'جبن 🧀', he: 'גבינה 🧀', tr: 'Peynir 🧀', hu: 'Sajt 🧀', hi: 'पनीर 🧀' },
  'leche': { en: 'Milk 🥛', de: 'Milch 🥛', es: 'Leche 🥛', it: 'Latte 🥛', fr: 'Lait 🥛', pt: 'Leite 🥛', nl: 'Melk 🥛', sv: 'Mjölk 🥛', da: 'Mælk 🥛', fi: 'Maito 🥛', no: 'Melk 🥛', ru: 'Молоко 🥛', zh: '牛奶 🥛', ja: '牛乳 🥛', ko: '우유 🥛', ar: 'حليب 🥛', he: 'חלב 🥛', tr: 'Süt 🥛', hu: 'Tej 🥛', hi: 'दूध 🥛' },
  'huevos': { en: 'Eggs 🥚', de: 'Eier 🥚', es: 'Huevos 🥚', it: 'Uova 🥚', fr: 'Œufs 🥚', pt: 'Ovos 🥚', nl: 'Eieren 🥚', sv: 'Ägg 🥚', da: 'Æg 🥚', fi: 'Munat 🥚', no: 'Egg 🥚', ru: 'Яйца 🥚', zh: '鸡蛋 🥚', ja: '卵 🥚', ko: '달걀 🥚', ar: 'بيض 🥚', he: 'ביצים 🥚', tr: 'Yumurta 🥚', hu: 'Tojás 🥚', hi: 'अंडे 🥚' },

  // Frutos secos
  'nueces': { en: 'Walnuts 🌰', de: 'Walnüsse 🌰', es: 'Nueces 🌰', it: 'Noci 🌰', fr: 'Noix 🌰', pt: 'Nozes 🌰', nl: 'Walnoten 🌰', sv: 'Valnötter 🌰', da: 'Valnødder 🌰', fi: 'Saksanpähkinät 🌰', no: 'Valnøtter 🌰', ru: 'Грецкие орехи 🌰', zh: '核桃 🌰', ja: 'くるみ 🌰', ko: '호두 🌰', ar: 'جوز 🌰', he: 'אגוזי מלך 🌰', tr: 'Ceviz 🌰', hu: 'Dió 🌰', hi: 'अखरोट 🌰' },
  'almendras': { en: 'Almonds 🌰', de: 'Mandeln 🌰', es: 'Almendras 🌰', it: 'Mandorle 🌰', fr: 'Amandes 🌰', pt: 'Amêndoas 🌰', nl: 'Amandelen 🌰', sv: 'Mandlar 🌰', da: 'Mandler 🌰', fi: 'Mantelit 🌰', no: 'Mandler 🌰', ru: 'Миндаль 🌰', zh: '杏仁 🌰', ja: 'アーモンド 🌰', ko: '아몬드 🌰', ar: 'لوز 🌰', he: 'שקדים 🌰', tr: 'Badem 🌰', hu: 'Mandula 🌰', hi: 'बादाम 🌰' },

  // Productos adicionales estacionales
  'nata': { en: 'Cream 🥛', de: 'Sahne 🥛', es: 'Nata 🥛', it: 'Panna 🥛', fr: 'Crème 🥛', pt: 'Nata 🥛', nl: 'Room 🥛', sv: 'Grädde 🥛', da: 'Fløde 🥛', fi: 'Kerma 🥛', no: 'Fløte 🥛', ru: 'Сливки 🥛', zh: '奶油 🥛', ja: 'クリーム 🥛', ko: '크림 🥛', ar: 'كريمة 🥛', he: 'שמנת 🥛', tr: 'Krema 🥛', hu: 'Tejszín 🥛', hi: 'क्रीम 🥛' },
  'ciruelas': { en: 'Plums 🍇', de: 'Pflaumen 🍇', es: 'Ciruelas 🍇', it: 'Prugne 🍇', fr: 'Prunes 🍇', pt: 'Ameixas 🍇', nl: 'Pruimen 🍇', sv: 'Plommon 🍇', da: 'Blommer 🍇', fi: 'Luumut 🍇', no: 'Plommer 🍇', ru: 'Сливы 🍇', zh: '李子 🍇', ja: 'プラム 🍇', ko: '자두 🍇', ar: 'برقوق 🍇', he: 'שזיפים 🍇', tr: 'Erik 🍇', hu: 'Szilva 🍇', hi: 'आलूबुखारा 🍇' },
  'caballa': { en: 'Mackerel 🐟', de: 'Makrele 🐟', es: 'Caballa 🐟', it: 'Sgombro 🐟', fr: 'Maquereau 🐟', pt: 'Cavala 🐟', nl: 'Makreel 🐟', sv: 'Makrill 🐟', da: 'Makrel 🐟', fi: 'Makrilli 🐟', no: 'Makrell 🐟', ru: 'Скумбрия 🐟', zh: '鲭鱼 🐟', ja: 'サバ 🐟', ko: '고등어 🐟', ar: 'إسقمري 🐟', he: 'מקרל 🐟', tr: 'Uskumru 🐟', hu: 'Makréla 🐟', hi: 'मैकेरल 🐟' },
  'avena': { en: 'Oats 🌾', de: 'Hafer 🌾', es: 'Avena 🌾', it: 'Avena 🌾', fr: 'Avoine 🌾', pt: 'Aveia 🌾', nl: 'Haver 🌾', sv: 'Havre 🌾', da: 'Havre 🌾', fi: 'Kaura 🌾', no: 'Havre 🌾', ru: 'Овсянка 🌾', zh: '燕麦 🌾', ja: 'オーツ 🌾', ko: '귀리 🌾', ar: 'شوفان 🌾', he: 'שיבולת שועל 🌾', tr: 'Yulaf 🌾', hu: 'Zab 🌾', hi: 'जई 🌾' },
  'whisky': { en: 'Whisky 🥃', de: 'Whisky 🥃', es: 'Whisky 🥃', it: 'Whisky 🥃', fr: 'Whisky 🥃', pt: 'Whisky 🥃', nl: 'Whisky 🥃', sv: 'Whisky 🥃', da: 'Whisky 🥃', fi: 'Viski 🥃', no: 'Whisky 🥃', ru: 'Виски 🥃', zh: '威士忌 🥃', ja: 'ウイスキー 🥃', ko: '위스키 🥃', ar: 'ويسكي 🥃', he: 'ויסקי 🥃', tr: 'Viski 🥃', hu: 'Whisky 🥃', hi: 'व्हिस्की 🥃' },

  // Productos de temporada comunes
  'granadas': { en: 'Pomegranates 🔴', de: 'Granatäpfel 🔴', es: 'Granadas 🔴', it: 'Melograni 🔴', fr: 'Grenades 🔴', pt: 'Romãs 🔴', nl: 'Granaatappels 🔴', sv: 'Granatäpplen 🔴', da: 'Granatæbler 🔴', fi: 'Granaattiomenat 🔴', no: 'Granatepler 🔴', ru: 'Гранаты 🔴', zh: '石榴 🔴', ja: 'ザクロ 🔴', ko: '석류 🔴', ar: 'رمان 🔴', he: 'רימונים 🔴', tr: 'Nar 🔴', hu: 'Gránátalma 🔴', hi: 'अनार 🔴' },
  'higos': { en: 'Figs 🫐', de: 'Feigen 🫐', es: 'Higos 🫐', it: 'Fichi 🫐', fr: 'Figues 🫐', pt: 'Figos 🫐', nl: 'Vijgen 🫐', sv: 'Fikon 🫐', da: 'Figner 🫐', fi: 'Viikunat 🫐', no: 'Fiken 🫐', ru: 'Инжир 🫐', zh: '无花果 🫐', ja: 'イチジク 🫐', ko: '무화과 🫐', ar: 'تين 🫐', he: 'תאנים 🫐', tr: 'İncir 🫐', hu: 'Füge 🫐', hi: 'अंजीर 🫐' },
  'castañas': { en: 'Chestnuts 🌰', de: 'Kastanien 🌰', es: 'Castañas 🌰', it: 'Castagne 🌰', fr: 'Châtaignes 🌰', pt: 'Castanhas 🌰', nl: 'Kastanjes 🌰', sv: 'Kastanjer 🌰', da: 'Kastanjer 🌰', fi: 'Kastanjat 🌰', no: 'Kastanjer 🌰', ru: 'Каштаны 🌰', zh: '栗子 🌰', ja: '栗 🌰', ko: '밤 🌰', ar: 'كستناء 🌰', he: 'ערמונים 🌰', tr: 'Kestane 🌰', hu: 'Gesztenye 🌰', hi: 'शाहबलूत 🌰' },
  'setas': { en: 'Mushrooms 🍄', de: 'Pilze 🍄', es: 'Setas 🍄', it: 'Funghi 🍄', fr: 'Champignons 🍄', pt: 'Cogumelos 🍄', nl: 'Paddenstoelen 🍄', sv: 'Svamp 🍄', da: 'Svampe 🍄', fi: 'Sienet 🍄', no: 'Sopp 🍄', ru: 'Грибы 🍄', zh: '蘑菇 🍄', ja: 'きのこ 🍄', ko: '버섯 🍄', ar: 'فطر 🍄', he: 'פטריות 🍄', tr: 'Mantar 🍄', hu: 'Gomba 🍄', hi: 'मशरूम 🍄' },
  'calabaza': { en: 'Pumpkin 🎃', de: 'Kürbis 🎃', es: 'Calabaza 🎃', it: 'Zucca 🎃', fr: 'Citrouille 🎃', pt: 'Abóbora 🎃', nl: 'Pompoen 🎃', sv: 'Pumpa 🎃', da: 'Græskar 🎃', fi: 'Kurpitsa 🎃', no: 'Gresskar 🎃', ru: 'Тыква 🎃', zh: '南瓜 🎃', ja: 'かぼちゃ 🎃', ko: '호박 🎃', ar: 'يقطين 🎃', he: 'דלעת 🎃', tr: 'Balkabağı 🎃', hu: 'Tök 🎃', hi: 'कद्दू 🎃' },
  'caquis': { en: 'Persimmons 🟠', de: 'Kakis 🟠', es: 'Caquis 🟠', it: 'Cachi 🟠', fr: 'Kakis 🟠', pt: 'Caquis 🟠', nl: 'Dadelpruimen 🟠', sv: 'Persimon 🟠', da: 'Kaki 🟠', fi: 'Kaki 🟠', no: 'Kaki 🟠', ru: 'Хурма 🟠', zh: '柿子 🟠', ja: '柿 🟠', ko: '감 🟠', ar: 'كاكي 🟠', he: 'אפרסמון 🟠', tr: 'Trabzon hurması 🟠', hu: 'Kaki 🟠', hi: 'ख़ुरमा 🟠' },
  'membrillo': { en: 'Quince 🍊', de: 'Quitte 🍊', es: 'Membrillo 🍊', it: 'Cotogna 🍊', fr: 'Coing 🍊', pt: 'Marmelo 🍊', nl: 'Kweepeer 🍊', sv: 'Kvitten 🍊', da: 'Kvæde 🍊', fi: 'Kvitteni 🍊', no: 'Kvede 🍊', ru: 'Айва 🍊', zh: '榅桲 🍊', ja: 'マルメロ 🍊', ko: '모과 🍊', ar: 'سفرجل 🍊', he: 'חבוש 🍊', tr: 'Ayva 🍊', hu: 'Birs 🍊', hi: 'बही 🍊' },
  'boniatos': { en: 'Sweet potatoes 🍠', de: 'Süßkartoffeln 🍠', es: 'Boniatos 🍠', it: 'Patate dolci 🍠', fr: 'Patates douces 🍠', pt: 'Batatas doces 🍠', nl: 'Zoete aardappels 🍠', sv: 'Sötpotatis 🍠', da: 'Søde kartofler 🍠', fi: 'Bataatti 🍠', no: 'Søtpotet 🍠', ru: 'Батат 🍠', zh: '红薯 🍠', ja: 'サツマイモ 🍠', ko: '고구마 🍠', ar: 'بطاطا حلوة 🍠', he: 'בטטה 🍠', tr: 'Tatlı patates 🍠', hu: 'Édesburgonya 🍠', hi: 'शकरकंद 🍠' },
  'cebolletas': { en: 'Spring onions 🌿', de: 'Frühlingszwiebeln 🌿', es: 'Cebolletas 🌿', it: 'Cipollotti 🌿', fr: 'Cébettes 🌿', pt: 'Cebolinha 🌿', nl: 'Lente-uitjes 🌿', sv: 'Salladslök 🌿', da: 'Forårsløg 🌿', fi: 'Kevätsipuli 🌿', no: 'Vårløk 🌿', ru: 'Зеленый лук 🌿', zh: '小葱 🌿', ja: '万能ねぎ 🌿', ko: '파 🌿', ar: 'بصل أخضر 🌿', he: 'בצל ירוק 🌿', tr: 'Yeşil soğan 🌿', hu: 'Újhagyma 🌿', hi: 'हरा प्याज 🌿' },

  // Productos adicionales comunes estacionales
  'naranjas': { en: 'Oranges 🍊', de: 'Orangen 🍊', es: 'Naranjas 🍊', it: 'Arance 🍊', fr: 'Oranges 🍊', pt: 'Laranjas 🍊', nl: 'Sinaasappels 🍊', sv: 'Apelsiner 🍊', da: 'Appelsiner 🍊', fi: 'Appelsiinit 🍊', no: 'Appelsiner 🍊', ru: 'Апельсины 🍊', zh: '橙子 🍊', ja: 'オレンジ 🍊', ko: '오렌지 🍊', ar: 'برتقال 🍊', he: 'תפוזים 🍊', tr: 'Portakal 🍊', hu: 'Narancs 🍊', hi: 'संतरे 🍊' },
  'mandarinas': { en: 'Tangerines 🍊', de: 'Mandarinen 🍊', es: 'Mandarinas 🍊', it: 'Mandarini 🍊', fr: 'Mandarines 🍊', pt: 'Tangerinas 🍊', nl: 'Mandarijnen 🍊', sv: 'Mandariner 🍊', da: 'Mandariner 🍊', fi: 'Mandariinit 🍊', no: 'Mandariner 🍊', ru: 'Мандарины 🍊', zh: '橘子 🍊', ja: 'みかん 🍊', ko: '귤 🍊', ar: 'يوسفي 🍊', he: 'מנדרינות 🍊', tr: 'Mandalina 🍊', hu: 'Mandarin 🍊', hi: 'संतरा 🍊' },
  'fresas': { en: 'Strawberries 🍓', de: 'Erdbeeren 🍓', es: 'Fresas 🍓', it: 'Fragole 🍓', fr: 'Fraises 🍓', pt: 'Morangos 🍓', nl: 'Aardbeien 🍓', sv: 'Jordgubbar 🍓', da: 'Jordbær 🍓', fi: 'Mansikat 🍓', no: 'Jordbær 🍓', ru: 'Клубника 🍓', zh: '草莓 🍓', ja: 'いちご 🍓', ko: '딸기 🍓', ar: 'فراولة 🍓', he: 'תותים 🍓', tr: 'Çilek 🍓', hu: 'Eper 🍓', hi: 'स्ट्रॉबेरी 🍓' },
  'uvas': { en: 'Grapes 🍇', de: 'Trauben 🍇', es: 'Uvas 🍇', it: 'Uva 🍇', fr: 'Raisins 🍇', pt: 'Uvas 🍇', nl: 'Druiven 🍇', sv: 'Vindruvor 🍇', da: 'Druer 🍇', fi: 'Viinirypäleet 🍇', no: 'Druer 🍇', ru: 'Виноград 🍇', zh: '葡萄 🍇', ja: 'ぶどう 🍇', ko: '포도 🍇', ar: 'عنب 🍇', he: 'ענבים 🍇', tr: 'Üzüm 🍇', hu: 'Szőlő 🍇', hi: 'अंगूर 🍇' },
  'manzanas': { en: 'Apples 🍎', de: 'Äpfel 🍎', es: 'Manzanas 🍎', it: 'Mele 🍎', fr: 'Pommes 🍎', pt: 'Maçãs 🍎', nl: 'Appels 🍎', sv: 'Äpplen 🍎', da: 'Æbler 🍎', fi: 'Omenat 🍎', no: 'Epler 🍎', ru: 'Яблоки 🍎', zh: '苹果 🍎', ja: 'りんご 🍎', ko: '사과 🍎', ar: 'تفاح 🍎', he: 'תפוחים 🍎', tr: 'Elma 🍎', hu: 'Alma 🍎', hi: 'सेब 🍎' },
  'peras': { en: 'Pears 🍐', de: 'Birnen 🍐', es: 'Peras 🍐', it: 'Pere 🍐', fr: 'Poires 🍐', pt: 'Peras 🍐', nl: 'Peren 🍐', sv: 'Päron 🍐', da: 'Pærer 🍐', fi: 'Päärynät 🍐', no: 'Pærer 🍐', ru: 'Груши 🍐', zh: '梨 🍐', ja: '梨 🍐', ko: '배 🍐', ar: 'كمثرى 🍐', he: 'אגסים 🍐', tr: 'Armut 🍐', hu: 'Körte 🍐', hi: 'नाशपाती 🍐' },
  'brevas': { en: 'Early figs 🫐', de: 'Frühe Feigen 🫐', es: 'Brevas 🫐', it: 'Fichi precoci 🫐', fr: 'Figues fleurs 🫐', pt: 'Brevas 🫐', nl: 'Vroege vijgen 🫐', sv: 'Tidiga fikon 🫐', da: 'Tidlige figner 🫐', fi: 'Varhaiset viikunat 🫐', no: 'Tidlige fiken 🫐', ru: 'Ранний инжир 🫐', zh: '早熟无花果 🫐', ja: '早生イチジク 🫐', ko: '조생무화과 🫐', ar: 'تين مبكر 🫐', he: 'תאנים מוקדמות 🫐', tr: 'Erken incir 🫐', hu: 'Korai füge 🫐', hi: 'जल्दी अंजीर 🫐' },
  'melocotones': { en: 'Peaches 🍑', de: 'Pfirsiche 🍑', es: 'Melocotones 🍑', it: 'Pesche 🍑', fr: 'Pêches 🍑', pt: 'Pêssegos 🍑', nl: 'Perziken 🍑', sv: 'Persikor 🍑', da: 'Ferskner 🍑', fi: 'Persikat 🍑', no: 'Fersken 🍑', ru: 'Персики 🍑', zh: '桃子 🍑', ja: '桃 🍑', ko: '복숭아 🍑', ar: 'خوخ 🍑', he: 'אפרסקים 🍑', tr: 'Şeftali 🍑', hu: 'Őszibarack 🍑', hi: 'आड़ू 🍑' },
  'nectarinas': { en: 'Nectarines 🍑', de: 'Nektarinen 🍑', es: 'Nectarinas 🍑', it: 'Nettarine 🍑', fr: 'Nectarines 🍑', pt: 'Nectarinas 🍑', nl: 'Nectarines 🍑', sv: 'Nektariner 🍑', da: 'Nektariner 🍑', fi: 'Nektariinit 🍑', no: 'Nektariner 🍑', ru: 'Нектарины 🍑', zh: '油桃 🍑', ja: 'ネクタリン 🍑', ko: '천도복숭아 🍑', ar: 'نكتارين 🍑', he: 'נקטרינות 🍑', tr: 'Nektarin 🍑', hu: 'Nektarin 🍑', hi: 'नेक्टेरिन 🍑' },
  'sandia': { en: 'Watermelon 🍉', de: 'Wassermelone 🍉', es: 'Sandía 🍉', it: 'Anguria 🍉', fr: 'Pastèque 🍉', pt: 'Melancia 🍉', nl: 'Watermeloen 🍉', sv: 'Vattenmelon 🍉', da: 'Vandmelon 🍉', fi: 'Vesimeloni 🍉', no: 'Vannmelon 🍉', ru: 'Арбуз 🍉', zh: '西瓜 🍉', ja: 'スイカ 🍉', ko: '수박 🍉', ar: 'بطيخ 🍉', he: 'אבטיח 🍉', tr: 'Karpuz 🍉', hu: 'Görögdinnye 🍉', hi: 'तरबूज 🍉' },
  'melon': { en: 'Melon 🍈', de: 'Melone 🍈', es: 'Melón 🍈', it: 'Melone 🍈', fr: 'Melon 🍈', pt: 'Melão 🍈', nl: 'Meloen 🍈', sv: 'Melon 🍈', da: 'Melon 🍈', fi: 'Meloni 🍈', no: 'Melon 🍈', ru: 'Дыня 🍈', zh: '甜瓜 🍈', ja: 'メロン 🍈', ko: '멜론 🍈', ar: 'شمام 🍈', he: 'מלון 🍈', tr: 'Kavun 🍈', hu: 'Sárgadinnye 🍈', hi: 'खरबूजा 🍈' },

  // Productos de temporada septiembre que faltan
  'mosto': { en: 'Must 🍇', de: 'Most 🍇', es: 'Mosto 🍇', it: 'Mosto 🍇', fr: 'Moût 🍇', pt: 'Mosto 🍇', nl: 'Most 🍇', sv: 'Must 🍇', da: 'Most 🍇', fi: 'Viinirypälemehnu 🍇', no: 'Most 🍇', ru: 'Сусло 🍇', zh: '葡萄汁 🍇', ja: 'マスト 🍇', ko: '포도즙 🍇', ar: 'عصير العنب 🍇', he: 'מיץ ענבים 🍇', tr: 'Şıra 🍇', hu: 'Must 🍇', hi: 'अंगूर का रस 🍇' },
  'guisantes': { en: 'Peas 🟢', de: 'Erbsen 🟢', es: 'Guisantes 🟢', it: 'Piselli 🟢', fr: 'Petits pois 🟢', pt: 'Ervilhas 🟢', nl: 'Erwten 🟢', sv: 'Ärtor 🟢', da: 'Ærter 🟢', fi: 'Herneet 🟢', no: 'Erter 🟢', ru: 'Горошек 🟢', zh: '豌豆 🟢', ja: 'エンドウ豆 🟢', ko: '완두콩 🟢', ar: 'بازلاء 🟢', he: 'אפונה 🟢', tr: 'Bezelye 🟢', hu: 'Borsó 🟢', hi: 'मटर 🟢' },
  'mangold': { en: 'Chard 🌿', de: 'Mangold 🌿', es: 'Acelgas 🌿', it: 'Bietola 🌿', fr: 'Blettes 🌿', pt: 'Acelga 🌿', nl: 'Snijbiet 🌿', sv: 'Mangold 🌿', da: 'Mangold 🌿', fi: 'Mangoldi 🌿', no: 'Mangold 🌿', ru: 'Мангольд 🌿', zh: '瑞士甜菜 🌿', ja: 'フダンソウ 🌿', ko: '근대 🌿', ar: 'سلق 🌿', he: 'תרד 🌿', tr: 'Pazı 🌿', hu: 'Mángold 🌿', hi: 'चुकंदर पत्ता 🌿' },
  'tomillo': { en: 'Thyme 🌿', de: 'Thymian 🌿', es: 'Tomillo 🌿', it: 'Timo 🌿', fr: 'Thym 🌿', pt: 'Tomilho 🌿', nl: 'Tijm 🌿', sv: 'Timjan 🌿', da: 'Timian 🌿', fi: 'Timjami 🌿', no: 'Timian 🌿', ru: 'Тимьян 🌿', zh: '百里香 🌿', ja: 'タイム 🌿', ko: '타임 🌿', ar: 'زعتر 🌿', he: 'קורנית 🌿', tr: 'Kekik 🌿', hu: 'Kakukkfű 🌿', hi: 'अजवायन 🌿' },

  // Productos de dieta que faltan
  'clara': { en: 'Egg white 🥚', de: 'Eiweiß 🥚', es: 'Clara de huevo 🥚', it: 'Albume 🥚', fr: 'Blanc d\'œuf 🥚', pt: 'Clara de ovo 🥚', nl: 'Eiwit 🥚', sv: 'Äggvita 🥚', da: 'Æggehvide 🥚', fi: 'Munanvalkuainen 🥚', no: 'Eggehvite 🥚', ru: 'Белок яйца 🥚', zh: '蛋白 🥚', ja: '卵白 🥚', ko: '달걀흰자 🥚', ar: 'بياض البيض 🥚', he: 'חלבון ביצה 🥚', tr: 'Yumurta akı 🥚', hu: 'Tojásfehérje 🥚', hi: 'अंडे का सफेद भाग 🥚' },
  'huevo': { en: 'Egg 🥚', de: 'Ei 🥚', es: 'Huevo 🥚', it: 'Uovo 🥚', fr: 'Œuf 🥚', pt: 'Ovo 🥚', nl: 'Ei 🥚', sv: 'Ägg 🥚', da: 'Æg 🥚', fi: 'Muna 🥚', no: 'Egg 🥚', ru: 'Яйцо 🥚', zh: '鸡蛋 🥚', ja: '卵 🥚', ko: '달걀 🥚', ar: 'بيضة 🥚', he: 'ביצה 🥚', tr: 'Yumurta 🥚', hu: 'Tojás 🥚', hi: 'अंडा 🥚' },
  'apio': { en: 'Celery 🌿', de: 'Sellerie 🌿', es: 'Apio 🌿', it: 'Sedano 🌿', fr: 'Céleri 🌿', pt: 'Aipo 🌿', nl: 'Selderij 🌿', sv: 'Selleri 🌿', da: 'Selleri 🌿', fi: 'Selleri 🌿', no: 'Selleri 🌿', ru: 'Сельдерей 🌿', zh: '芹菜 🌿', ja: 'セロリ 🌿', ko: '셀러리 🌿', ar: 'كرفس 🌿', he: 'סלרי 🌿', tr: 'Kereviz 🌿', hu: 'Zeller 🌿', hi: 'अजमोद 🌿' },
  'hummus': { en: 'Hummus 🌿', de: 'Hummus 🌿', es: 'Hummus 🌿', it: 'Hummus 🌿', fr: 'Houmous 🌿', pt: 'Homus 🌿', nl: 'Hummus 🌿', sv: 'Hummus 🌿', da: 'Hummus 🌿', fi: 'Hummus 🌿', no: 'Hummus 🌿', ru: 'Хумус 🌿', zh: '鹰嘴豆泥 🌿', ja: 'フムス 🌿', ko: '후무스 🌿', ar: 'حمص 🌿', he: 'חומוס 🌿', tr: 'Humus 🌿', hu: 'Humusz 🌿', hi: 'हम्मस 🌿' },
  'vinagre': { en: 'Vinegar 🌿', de: 'Essig 🌿', es: 'Vinagre 🌿', it: 'Aceto 🌿', fr: 'Vinaigre 🌿', pt: 'Vinagre 🌿', nl: 'Azijn 🌿', sv: 'Vinäger 🌿', da: 'Eddike 🌿', fi: 'Etikka 🌿', no: 'Eddik 🌿', ru: 'Уксус 🌿', zh: '醋 🌿', ja: '酢 🌿', ko: '식초 🌿', ar: 'خل 🌿', he: 'חומץ 🌿', tr: 'Sirke 🌿', hu: 'Ecet 🌿', hi: 'सिरका 🌿' },
  'balsamico': { en: 'Balsamic 🌿', de: 'Balsamico 🌿', es: 'Balsámico 🌿', it: 'Balsamico 🌿', fr: 'Balsamique 🌿', pt: 'Balsâmico 🌿', nl: 'Balsamico 🌿', sv: 'Balsamico 🌿', da: 'Balsamico 🌿', fi: 'Balsamico 🌿', no: 'Balsamico 🌿', ru: 'Бальзамик 🌿', zh: '香醋 🌿', ja: 'バルサミコ 🌿', ko: '발사믹 🌿', ar: 'بلسمي 🌿', he: 'בלסמי 🌿', tr: 'Balsamik 🌿', hu: 'Balzsamecet 🌿', hi: 'बालसामिक 🌿' },
  'infusion': { en: 'Herbal tea 🍵', de: 'Kräutertee 🍵', es: 'Infusión 🍵', it: 'Tisana 🍵', fr: 'Infusion 🍵', pt: 'Infusão 🍵', nl: 'Kruidenthee 🍵', sv: 'Örtte 🍵', da: 'Urtete 🍵', fi: 'Yrttitee 🍵', no: 'Urtete 🍵', ru: 'Травяной чай 🍵', zh: '草药茶 🍵', ja: 'ハーブティー 🍵', ko: '허브차 🍵', ar: 'شاي أعشاب 🍵', he: 'תה צמחים 🍵', tr: 'Bitki çayı 🍵', hu: 'Gyógytea 🍵', hi: 'जड़ी बूटी चाय 🍵' },
  'natural': { en: 'Natural 🌿', de: 'Natürlich 🌿', es: 'Natural 🌿', it: 'Naturale 🌿', fr: 'Naturel 🌿', pt: 'Natural 🌿', nl: 'Natuurlijk 🌿', sv: 'Naturlig 🌿', da: 'Naturlig 🌿', fi: 'Luonnollinen 🌿', no: 'Naturlig 🌿', ru: 'Натуральный 🌿', zh: '天然 🌿', ja: 'ナチュラル 🌿', ko: '천연 🌿', ar: 'طبيعي 🌿', he: 'טבעי 🌿', tr: 'Doğal 🌿', hu: 'Természetes 🌿', hi: 'प्राकृतिक 🌿' },
  'azucar': { en: 'Sugar 🌿', de: 'Zucker 🌿', es: 'Azúcar 🌿', it: 'Zucchero 🌿', fr: 'Sucre 🌿', pt: 'Açúcar 🌿', nl: 'Suiker 🌿', sv: 'Socker 🌿', da: 'Sukker 🌿', fi: 'Sokeri 🌿', no: 'Sukker 🌿', ru: 'Сахар 🌿', zh: '糖 🌿', ja: '砂糖 🌿', ko: '설탕 🌿', ar: 'سكر 🌿', he: 'סוכר 🌿', tr: 'Şeker 🌿', hu: 'Cukor 🌿', hi: 'चीनी 🌿' },
  'mostaza': { en: 'Mustard 🌿', de: 'Senf 🌿', es: 'Mostaza 🌿', it: 'Senape 🌿', fr: 'Moutarde 🌿', pt: 'Mostarda 🌿', nl: 'Mosterd 🌿', sv: 'Senap 🌿', da: 'Sennep 🌿', fi: 'Sinappi 🌿', no: 'Sennep 🌿', ru: 'Горчица 🌿', zh: '芥末 🌿', ja: 'マスタード 🌿', ko: '겨자 🌿', ar: 'خردل 🌿', he: 'חרדל 🌿', tr: 'Hardal 🌿', hu: 'Mustár 🌿', hi: 'सरसों 🌿' },
  'sin': { en: 'Without', de: 'Ohne', es: 'Sin', it: 'Senza', fr: 'Sans', pt: 'Sem', nl: 'Zonder', sv: 'Utan', da: 'Uden', fi: 'Ilman', no: 'Uten', ru: 'Без', zh: '无', ja: 'なし', ko: '없이', ar: 'بدون', he: 'בלי', tr: 'Olmadan', hu: 'Nélkül', hi: 'बिना' },
  'con': { en: 'With', de: 'Mit', es: 'Con', it: 'Con', fr: 'Avec', pt: 'Com', nl: 'Met', sv: 'Med', da: 'Med', fi: 'Kanssa', no: 'Med', ru: 'С', zh: '带', ja: 'と', ko: '와', ar: 'مع', he: 'עם', tr: 'İle', hu: 'Val', hi: 'के साथ' },
  'de': { en: 'Of', de: 'Von', es: 'De', it: 'Di', fr: 'De', pt: 'De', nl: 'Van', sv: 'Av', da: 'Af', fi: 'Kohteesta', no: 'Av', ru: 'Из', zh: '的', ja: 'の', ko: '의', ar: 'من', he: 'של', tr: 'Dan', hu: 'Ból', hi: 'से' },

  // PRODUCTOS DE SEPTIEMBRE QUE FALTAN (los del log)
  'gambas': { en: 'Prawns 🦐', de: 'Garnelen 🦐', es: 'Gambas 🦐', it: 'Gamberetti 🦐', fr: 'Crevettes 🦐', pt: 'Camarões 🦐', nl: 'Garnalen 🦐', sv: 'Räkor 🦐', da: 'Rejer 🦐', fi: 'Katkaravut 🦐', no: 'Reker 🦐', ru: 'Креветки 🦐', zh: '虾 🦐', ja: 'エビ 🦐', ko: '새우 🦐', ar: 'جمبري 🦐', he: 'שרימפס 🦐', tr: 'Karides 🦐', hu: 'Garnélarák 🦐', hi: 'झींगा 🦐' },
  'mejillones': { en: 'Mussels 🦪', de: 'Muscheln 🦪', es: 'Mejillones 🦪', it: 'Cozze 🦪', fr: 'Moules 🦪', pt: 'Mexilhões 🦪', nl: 'Mosselen 🦪', sv: 'Musslor 🦪', da: 'Muslinger 🦪', fi: 'Simpukat 🦪', no: 'Blåskjell 🦪', ru: 'Мидии 🦪', zh: '贻贝 🦪', ja: 'ムール貝 🦪', ko: '홍합 🦪', ar: 'بلح البحر 🦪', he: 'צדפות 🦪', tr: 'Midye 🦪', hu: 'Kagyló 🦪', hi: 'सीप 🦪' },
  'licores': { en: 'Liqueurs 🥃', de: 'Liköre 🥃', es: 'Licores 🥃', it: 'Liquori 🥃', fr: 'Liqueurs 🥃', pt: 'Licores 🥃', nl: 'Likeuren 🥃', sv: 'Likörer 🥃', da: 'Likører 🥃', fi: 'Liköörit 🥃', no: 'Likører 🥃', ru: 'Ликёры 🥃', zh: '利口酒 🥃', ja: 'リキュール 🥃', ko: '리큐어 🥃', ar: 'مشروبات كحولية 🥃', he: 'ליקרים 🥃', tr: 'Likör 🥃', hu: 'Likőrök 🥃', hi: 'शराब 🥃' },
  'lentejas': { en: 'Lentils 🌿', de: 'Linsen 🌿', es: 'Lentejas 🌿', it: 'Lenticchie 🌿', fr: 'Lentilles 🌿', pt: 'Lentilhas 🌿', nl: 'Linzen 🌿', sv: 'Linser 🌿', da: 'Linser 🌿', fi: 'Linssit 🌿', no: 'Linser 🌿', ru: 'Чечевица 🌿', zh: '扁豆 🌿', ja: 'レンズ豆 🌿', ko: '렌틸콩 🌿', ar: 'عدس 🌿', he: 'עדשים 🌿', tr: 'Mercimek 🌿', hu: 'Lencse 🌿', hi: 'मसूर 🌿' },
  'curcuma': { en: 'Turmeric 🌿', de: 'Kurkuma 🌿', es: 'Cúrcuma 🌿', it: 'Curcuma 🌿', fr: 'Curcuma 🌿', pt: 'Açafrão-da-terra 🌿', nl: 'Kurkuma 🌿', sv: 'Gurkmeja 🌿', da: 'Gurkemeje 🌿', fi: 'Kurkuma 🌿', no: 'Gurkemeie 🌿', ru: 'Куркума 🌿', zh: '姜黄 🌿', ja: 'ターメリック 🌿', ko: '강황 🌿', ar: 'كركم 🌿', he: 'כורכום 🌿', tr: 'Zerdeçal 🌿', hu: 'Kurkuma 🌿', hi: 'हल्दी 🌿' },
  'bellotas': { en: 'Acorns 🌰', de: 'Eicheln 🌰', es: 'Bellotas 🌰', it: 'Ghiande 🌰', fr: 'Glands 🌰', pt: 'Bolotas 🌰', nl: 'Eikels 🌰', sv: 'Ekollon 🌰', da: 'Agern 🌰', fi: 'Tammenterhot 🌰', no: 'Eikenøtter 🌰', ru: 'Жёлуди 🌰', zh: '橡子 🌰', ja: 'どんぐり 🌰', ko: '도토리 🌰', ar: 'بلوط 🌰', he: 'בלוטים 🌰', tr: 'Meşe palamudu 🌰', hu: 'Makk 🌰', hi: 'बलूत 🌰' },
  'miel': { en: 'Honey 🍯', de: 'Honig 🍯', es: 'Miel 🍯', it: 'Miele 🍯', fr: 'Miel 🍯', pt: 'Mel 🍯', nl: 'Honing 🍯', sv: 'Honung 🍯', da: 'Honning 🍯', fi: 'Hunaja 🍯', no: 'Honning 🍯', ru: 'Мёд 🍯', zh: '蜂蜜 🍯', ja: 'ハチミツ 🍯', ko: '꿀 🍯', ar: 'عسل 🍯', he: 'דבש 🍯', tr: 'Bal 🍯', hu: 'Méz 🍯', hi: 'शहद 🍯' },
  'castano': { en: 'Chestnut 🌰', de: 'Kastanie 🌰', es: 'Castaño 🌰', it: 'Castagno 🌰', fr: 'Châtaignier 🌰', pt: 'Castanha 🌰', nl: 'Kastanje 🌰', sv: 'Kastanj 🌰', da: 'Kastanje 🌰', fi: 'Kastanja 🌰', no: 'Kastanje 🌰', ru: 'Каштан 🌰', zh: '栗子 🌰', ja: '栗 🌰', ko: '밤 🌰', ar: 'كستناء 🌰', he: 'ערמון 🌰', tr: 'Kestane 🌰', hu: 'Gesztenye 🌰', hi: 'शाहबलूत 🌰' },
  'trigo': { en: 'Wheat 🌾', de: 'Weizen 🌾', es: 'Trigo 🌾', it: 'Grano 🌾', fr: 'Blé 🌾', pt: 'Trigo 🌾', nl: 'Tarwe 🌾', sv: 'Vete 🌾', da: 'Hvede 🌾', fi: 'Vehnä 🌾', no: 'Hvete 🌾', ru: 'Пшеница 🌾', zh: '小麦 🌾', ja: '小麦 🌾', ko: '밀 🌾', ar: 'قمح 🌾', he: 'חיטה 🌾', tr: 'Buğday 🌾', hu: 'Búza 🌾', hi: 'गेहूं 🌾' },
  'sarraceno': { en: 'Buckwheat 🌾', de: 'Buchweizen 🌾', es: 'Sarraceno 🌾', it: 'Grano saraceno 🌾', fr: 'Sarrasin 🌾', pt: 'Trigo mourisco 🌾', nl: 'Boekweit 🌾', sv: 'Bovete 🌾', da: 'Boghvede 🌾', fi: 'Tattari 🌾', no: 'Bokhvete 🌾', ru: 'Гречка 🌾', zh: '荞麦 🌾', ja: 'そば 🌾', ko: '메밀 🌾', ar: 'حنطة سوداء 🌾', he: 'כוסמת 🌾', tr: 'Karabuğday 🌾', hu: 'Hajdina 🌾', hi: 'कुट्टू 🌾' },
  'senderuelas': { en: 'Senderuelas mushrooms 🍄', de: 'Senderuelas-Pilze 🍄', es: 'Senderuelas 🍄', it: 'Senderuelas 🍄', fr: 'Senderuelas 🍄', pt: 'Senderuelas 🍄', nl: 'Senderuelas 🍄', sv: 'Senderuelas 🍄', da: 'Senderuelas 🍄', fi: 'Senderuelas 🍄', no: 'Senderuelas 🍄', ru: 'Сендеруэлас 🍄', zh: '森德鲁埃拉斯蘑菇 🍄', ja: 'センデルエラス 🍄', ko: '센데루엘라스 🍄', ar: 'فطر سندرويلاس 🍄', he: 'פטריות סנדרואלס 🍄', tr: 'Senderuelas mantarı 🍄', hu: 'Senderuelas gomba 🍄', hi: 'सेंडरुएलास मशरूम 🍄' },
  'especias': { en: 'Spices 🌿', de: 'Gewürze 🌿', es: 'Especias 🌿', it: 'Spezie 🌿', fr: 'Épices 🌿', pt: 'Especiarias 🌿', nl: 'Kruiden 🌿', sv: 'Kryddor 🌿', da: 'Krydderier 🌿', fi: 'Mausteet 🌿', no: 'Krydder 🌿', ru: 'Специи 🌿', zh: '香料 🌿', ja: 'スパイス 🌿', ko: '향신료 🌿', ar: 'توابل 🌿', he: 'תבלינים 🌿', tr: 'Baharat 🌿', hu: 'Fűszerek 🌿', hi: 'मसाले 🌿' },
  'otono': { en: 'Autumn', de: 'Herbst', es: 'Otoño', it: 'Autunno', fr: 'Automne', pt: 'Outono', nl: 'Herfst', sv: 'Höst', da: 'Efterår', fi: 'Syksy', no: 'Høst', ru: 'Осень', zh: '秋天', ja: '秋', ko: '가을', ar: 'خريف', he: 'סתיו', tr: 'Sonbahar', hu: 'Ősz', hi: 'शरद ऋतु' },
  'atun': { en: 'Tuna 🐟', de: 'Thunfisch 🐟', es: 'Atún 🐟', it: 'Tonno 🐟', fr: 'Thon 🐟', pt: 'Atum 🐟', nl: 'Tonijn 🐟', sv: 'Tonfisk 🐟', da: 'Tunfisk 🐟', fi: 'Tonnikala 🐟', no: 'Tunfisk 🐟', ru: 'Тунец 🐟', zh: '金枪鱼 🐟', ja: 'マグロ 🐟', ko: '참치 🐟', ar: 'تونة 🐟', he: 'טונה 🐟', tr: 'Ton balığı 🐟', hu: 'Tonhal 🐟', hi: 'टूना मछली 🐟' },
  'alubias': { en: 'Beans 🌿', de: 'Bohnen 🌿', es: 'Alubias 🌿', it: 'Fagioli 🌿', fr: 'Haricots 🌿', pt: 'Feijões 🌿', nl: 'Bonen 🌿', sv: 'Bönor 🌿', da: 'Bønner 🌿', fi: 'Pavut 🌿', no: 'Bønner 🌿', ru: 'Фасоль 🌿', zh: '豆类 🌿', ja: 'インゲン豆 🌿', ko: '콩 🌿', ar: 'فاصولياء 🌿', he: 'שעועית 🌿', tr: 'Fasulye 🌿', hu: 'Bab 🌿', hi: 'बीन्स 🌿' },

  // PRODUCTOS SEPTIEMBRE MASIVOS - TODOS LOS 13 IDIOMAS
  'moscatel': { en: 'Muscat 🍇', de: 'Muskat 🍇', es: 'Moscatel 🍇', it: 'Moscato 🍇', fr: 'Muscat 🍇', pt: 'Moscatel 🍇', nl: 'Muskaat 🍇', sv: 'Muskat 🍇', da: 'Muskat 🍇', fi: 'Muskatti 🍇', no: 'Muskat 🍇', ru: 'Мускат 🍇', zh: '麝香葡萄 🍇', ja: 'マスカット 🍇', ko: '머스캣 🍇', ar: 'مسقط 🍇', he: 'מוסקט 🍇', tr: 'Muskat 🍇', hu: 'Muskotály 🍇', hi: 'मस्कट 🍇' },
  'negras': { en: 'Black 🍇', de: 'Schwarze 🍇', es: 'Negras 🍇', it: 'Nere 🍇', fr: 'Noires 🍇', pt: 'Negras 🍇', nl: 'Zwarte 🍇', sv: 'Svarta 🍇', da: 'Sorte 🍇', fi: 'Mustat 🍇', no: 'Svarte 🍇', ru: 'Чёрные 🍇', zh: '黑色 🍇', ja: '黒 🍇', ko: '검은 🍇', ar: 'سوداء 🍇', he: 'שחורות 🍇', tr: 'Siyah 🍇', hu: 'Fekete 🍇', hi: 'काले 🍇' },
  'chumbos': { en: 'Prickly pear 🫐', de: 'Kaktusfeigen 🫐', es: 'Higos chumbos 🫐', it: 'Fichi d\'India 🫐', fr: 'Figues de Barbarie 🫐', pt: 'Figos da Índia 🫐', nl: 'Vijgcactus 🫐', sv: 'Kaktusfikon 🫐', da: 'Kaktusfigen 🫐', fi: 'Kaktusviikuna 🫐', no: 'Kaktusfiken 🫐', ru: 'Опунция 🫐', zh: '仙人掌果 🫐', ja: 'ウチワサボテン 🫐', ko: '선인장 열매 🫐', ar: 'تين شوكي 🫐', he: 'צבר 🫐', tr: 'Dikenli armut 🫐', hu: 'Kaktuszfüge 🫐', hi: 'कांटेदार नाशपाती 🫐' },
  'conferencia': { en: 'Conference 🍐', de: 'Conference 🍐', es: 'Conferencia 🍐', it: 'Conference 🍐', fr: 'Conférence 🍐', pt: 'Conferência 🍐', nl: 'Conference 🍐', sv: 'Conference 🍐', da: 'Conference 🍐', fi: 'Conference 🍐', no: 'Conference 🍐', ru: 'Конференс 🍐', zh: '会议梨 🍐', ja: 'カンファレンス 🍐', ko: '컨퍼런스 🍐', ar: 'مؤتمر 🍐', he: 'כנס 🍐', tr: 'Konferans 🍐', hu: 'Konferencia 🍐', hi: 'सम्मेलन 🍐' },
  'golden': { en: 'Golden 🍎', de: 'Golden 🍎', es: 'Golden 🍎', it: 'Golden 🍎', fr: 'Golden 🍎', pt: 'Golden 🍎', nl: 'Golden 🍎', sv: 'Golden 🍎', da: 'Golden 🍎', fi: 'Golden 🍎', no: 'Golden 🍎', ru: 'Голден 🍎', zh: '金苹果 🍎', ja: 'ゴールデン 🍎', ko: '골든 🍎', ar: 'ذهبي 🍎', he: 'זהוב 🍎', tr: 'Altın 🍎', hu: 'Golden 🍎', hi: 'सुनहरा 🍎' },
  'nisperos': { en: 'Loquats 🍑', de: 'Mispeln 🍑', es: 'Nísperos 🍑', it: 'Nespole 🍑', fr: 'Nèfles 🍑', pt: 'Nêsperas 🍑', nl: 'Loquats 🍑', sv: 'Mispel 🍑', da: 'Mispel 🍑', fi: 'Japanilainen mispeli 🍑', no: 'Mispel 🍑', ru: 'Мушмула 🍑', zh: '枇杷 🍑', ja: 'ビワ 🍑', ko: '비파 🍑', ar: 'أكدنيا 🍑', he: 'שסק 🍑', tr: 'Malta eriği 🍑', hu: 'Naspolya 🍑', hi: 'लोकाट 🍑' },
  'tardios': { en: 'Late 🍑', de: 'Späte 🍑', es: 'Tardíos 🍑', it: 'Tardivi 🍑', fr: 'Tardifs 🍑', pt: 'Tardios 🍑', nl: 'Late 🍑', sv: 'Sena 🍑', da: 'Sene 🍑', fi: 'Myöhäiset 🍑', no: 'Sene 🍑', ru: 'Поздние 🍑', zh: '晚熟 🍑', ja: '晩生 🍑', ko: '늦은 🍑', ar: 'متأخرة 🍑', he: 'מאוחרות 🍑', tr: 'Geç 🍑', hu: 'Késői 🍑', hi: 'देर से पकने वाले 🍑' },
  'albaricoques': { en: 'Apricots 🍑', de: 'Aprikosen 🍑', es: 'Albaricoques 🍑', it: 'Albicocche 🍑', fr: 'Abricots 🍑', pt: 'Damascos 🍑', nl: 'Abrikozen 🍑', sv: 'Aprikoser 🍑', da: 'Abrikoser 🍑', fi: 'Aprikoosit 🍑', no: 'Aprikoser 🍑', ru: 'Абрикосы 🍑', zh: '杏 🍑', ja: 'アプリコット 🍑', ko: '살구 🍑', ar: 'مشمش 🍑', he: 'משמשים 🍑', tr: 'Kayısı 🍑', hu: 'Barack 🍑', hi: 'खुबानी 🍑' },
  'chirimoyas': { en: 'Custard apples 🍈', de: 'Zimtäpfel 🍈', es: 'Chirimoyas 🍈', it: 'Cirimoia 🍈', fr: 'Chérimoles 🍈', pt: 'Chirimoias 🍈', nl: 'Cherimoya 🍈', sv: 'Cherimoya 🍈', da: 'Cherimoya 🍈', fi: 'Cherimoya 🍈', no: 'Cherimoya 🍈', ru: 'Черимойя 🍈', zh: '番荔枝 🍈', ja: 'チェリモヤ 🍈', ko: '체리모야 🍈', ar: 'قشطة 🍈', he: 'צ\'רימויה 🍈', tr: 'Cherimoya 🍈', hu: 'Cherimoya 🍈', hi: 'चेरिमोया 🍈' },
  'butternut': { en: 'Butternut 🎃', de: 'Butternut 🎃', es: 'Butternut 🎃', it: 'Butternut 🎃', fr: 'Butternut 🎃', pt: 'Butternut 🎃', nl: 'Butternut 🎃', sv: 'Butternut 🎃', da: 'Butternut 🎃', fi: 'Butternut 🎃', no: 'Butternut 🎃', ru: 'Баттернат 🎃', zh: '胡桃南瓜 🎃', ja: 'バターナット 🎃', ko: '버터넛 🎃', ar: 'قرع الزبدة 🎃', he: 'דלעת חמאה 🎃', tr: 'Butternut 🎃', hu: 'Butternut 🎃', hi: 'बटरनट 🎃' },

  'berenjenas': { en: 'Eggplants 🍆', de: 'Auberginen 🍆', es: 'Berenjenas 🍆', it: 'Melanzane 🍆', fr: 'Aubergines 🍆', pt: 'Berinjelas 🍆', nl: 'Aubergines 🍆', sv: 'Auberginer 🍆', da: 'Auberginer 🍆', fi: 'Munakoisot 🍆', no: 'Auberginer 🍆', ru: 'Баклажаны 🍆', zh: '茄子 🍆', ja: 'ナス 🍆', ko: '가지 🍆', ar: 'باذنجان 🍆', he: 'חצילים 🍆', tr: 'Patlıcan 🍆', hu: 'Padlizsán 🍆', hi: 'बैंगन 🍆' },
  'pimientos': { en: 'Peppers 🌶️', de: 'Paprika 🌶️', es: 'Pimientos 🌶️', it: 'Peperoni 🌶️', fr: 'Poivrons 🌶️', pt: 'Pimentões 🌶️', nl: 'Paprika 🌶️', sv: 'Paprika 🌶️', da: 'Peberfrugter 🌶️', fi: 'Paprikat 🌶️', no: 'Paprika 🌶️', ru: 'Перцы 🌶️', zh: '辣椒 🌶️', ja: 'ピーマン 🌶️', ko: '피망 🌶️', ar: 'فلفل 🌶️', he: 'פלפלים 🌶️', tr: 'Biber 🌶️', hu: 'Paprika 🌶️', hi: 'शिमला मिर्च 🌶️' },
  'tomates': { en: 'Tomatoes 🍅', de: 'Tomaten 🍅', es: 'Tomates 🍅', it: 'Pomodori 🍅', fr: 'Tomates 🍅', pt: 'Tomates 🍅', nl: 'Tomaten 🍅', sv: 'Tomater 🍅', da: 'Tomater 🍅', fi: 'Tomaatit 🍅', no: 'Tomater 🍅', ru: 'Помидоры 🍅', zh: '番茄 🍅', ja: 'トマト 🍅', ko: '토마토 🍅', ar: 'طماطم 🍅', he: 'עגבניות 🍅', tr: 'Domates 🍅', hu: 'Paradicsom 🍅', hi: 'टमाटर 🍅' },
  'calabacines': { en: 'Zucchini 🥒', de: 'Zucchini 🥒', es: 'Calabacines 🥒', it: 'Zucchine 🥒', fr: 'Courgettes 🥒', pt: 'Abobrinhas 🥒', nl: 'Courgettes 🥒', sv: 'Zucchini 🥒', da: 'Squash 🥒', fi: 'Kesäkurpitsa 🥒', no: 'Squash 🥒', ru: 'Кабачки 🥒', zh: '西葫芦 🥒', ja: 'ズッキーニ 🥒', ko: '주키니 🥒', ar: 'كوسة 🥒', he: 'קישואים 🥒', tr: 'Kabak 🥒', hu: 'Cukkini 🥒', hi: 'तोरी 🥒' },
  'pepinos': { en: 'Cucumbers 🥒', de: 'Gurken 🥒', es: 'Pepinos 🥒', it: 'Cetrioli 🥒', fr: 'Concombres 🥒', pt: 'Pepinos 🥒', nl: 'Komkommers 🥒', sv: 'Gurkor 🥒', da: 'Agurker 🥒', fi: 'Kurkut 🥒', no: 'Agurker 🥒', ru: 'Огурцы 🥒', zh: '黄瓜 🥒', ja: 'キュウリ 🥒', ko: '오이 🥒', ar: 'خيار 🥒', he: 'מלפפונים 🥒', tr: 'Salatalık 🥒', hu: 'Uborka 🥒', hi: 'खीरा 🥒' },
  'lechugas': { en: 'Lettuces 🥬', de: 'Salate 🥬', es: 'Lechugas 🥬', it: 'Lattughe 🥬', fr: 'Laitues 🥬', pt: 'Alfaces 🥬', nl: 'Sla 🥬', sv: 'Sallad 🥬', da: 'Salat 🥬', fi: 'Salaatit 🥬', no: 'Salat 🥬', ru: 'Салат 🥬', zh: '生菜 🥬', ja: 'レタス 🥬', ko: '상추 🥬', ar: 'خس 🥬', he: 'חסה 🥬', tr: 'Marul 🥬', hu: 'Saláta 🥬', hi: 'सलाद पत्ता 🥬' },
  'rucula': { en: 'Arugula 🌿', de: 'Rucola 🌿', es: 'Rúcula 🌿', it: 'Rucola 🌿', fr: 'Roquette 🌿', pt: 'Rúcula 🌿', nl: 'Rucola 🌿', sv: 'Rucola 🌿', da: 'Rucola 🌿', fi: 'Sinappikaali 🌿', no: 'Rucola 🌿', ru: 'Руккола 🌿', zh: '芝麻菜 🌿', ja: 'ルッコラ 🌿', ko: '루꼴라 🌿', ar: 'جرجير 🌿', he: 'רוקט 🌿', tr: 'Roka 🌿', hu: 'Rukkola 🌿', hi: 'अरुगुला 🌿' },
  'canonigos': { en: 'Corn salad 🌿', de: 'Feldsalat 🌿', es: 'Canónigos 🌿', it: 'Valeriana 🌿', fr: 'Mâche 🌿', pt: 'Alface de cordeiro 🌿', nl: 'Veldsla 🌿', sv: 'Rapunzel 🌿', da: 'Vårsalat 🌿', fi: 'Lampaansalaatti 🌿', no: 'Vårsalat 🌿', ru: 'Валерианница 🌿', zh: '野苣 🌿', ja: 'ノヂシャ 🌿', ko: '양상추 🌿', ar: 'خس الضأن 🌿', he: 'חסת כבש 🌿', tr: 'Kuzu marulu 🌿', hu: 'Bárányksaláta 🌿', hi: 'मेमने का सलाद 🌿' },
  'espinacas': { en: 'Spinach 🌿', de: 'Spinat 🌿', es: 'Espinacas 🌿', it: 'Spinaci 🌿', fr: 'Épinards 🌿', pt: 'Espinafres 🌿', nl: 'Spinazie 🌿', sv: 'Spenat 🌿', da: 'Spinat 🌿', fi: 'Pinaatti 🌿', no: 'Spinat 🌿', ru: 'Шпинат 🌿', zh: '菠菜 🌿', ja: 'ホウレンソウ 🌿', ko: '시금치 🌿', ar: 'سبانخ 🌿', he: 'תרד 🌿', tr: 'Ispanak 🌿', hu: 'Spenót 🌿', hi: 'पालक 🌿' },
  'acelgas': { en: 'Swiss chard 🌿', de: 'Mangold 🌿', es: 'Acelgas 🌿', it: 'Bietole 🌿', fr: 'Blettes 🌿', pt: 'Acelgas 🌿', nl: 'Snijbiet 🌿', sv: 'Mangold 🌿', da: 'Mangold 🌿', fi: 'Mangoldi 🌿', no: 'Mangold 🌿', ru: 'Мангольд 🌿', zh: '瑞士甜菜 🌿', ja: 'フダンソウ 🌿', ko: '근대 🌿', ar: 'سلق 🌿', he: 'תרד 🌿', tr: 'Pazı 🌿', hu: 'Mángold 🌿', hi: 'चुकंदर पत्ता 🌿' },
  'brocoli': { en: 'Broccoli 🥦', de: 'Brokkoli 🥦', es: 'Brócoli 🥦', it: 'Broccoli 🥦', fr: 'Brocoli 🥦', pt: 'Brócolis 🥦', nl: 'Broccoli 🥦', sv: 'Broccoli 🥦', da: 'Broccoli 🥦', fi: 'Parsakaali 🥦', no: 'Brokkoli 🥦', ru: 'Брокколи 🥦', zh: '西兰花 🥦', ja: 'ブロッコリー 🥦', ko: '브로콜리 🥦', ar: 'بروكلي 🥦', he: 'ברוקולי 🥦', tr: 'Brokoli 🥦', hu: 'Brokkoli 🥦', hi: 'ब्रोकली 🥦' },
  'coliflor': { en: 'Cauliflower 🥬', de: 'Blumenkohl 🥬', es: 'Coliflor 🥬', it: 'Cavolfiore 🥬', fr: 'Chou-fleur 🥬', pt: 'Couve-flor 🥬', nl: 'Bloemkool 🥬', sv: 'Blomkål 🥬', da: 'Blomkål 🥬', fi: 'Kukkakaali 🥬', no: 'Blomkål 🥬', ru: 'Цветная капуста 🥬', zh: '花椰菜 🥬', ja: 'カリフラワー 🥬', ko: '콜리플라워 🥬', ar: 'قرنبيط 🥬', he: 'כרובית 🥬', tr: 'Karnabahar 🥬', hu: 'Karfiol 🥬', hi: 'फूलगोभी 🥬' },
  'romanesco': { en: 'Romanesco 🥦', de: 'Romanesco 🥦', es: 'Romanesco 🥦', it: 'Romanesco 🥦', fr: 'Romanesco 🥦', pt: 'Romanesco 🥦', nl: 'Romanesco 🥦', sv: 'Romanesco 🥦', da: 'Romanesco 🥦', fi: 'Romanesco 🥦', no: 'Romanesco 🥦', ru: 'Романеско 🥦', zh: '罗马花椰菜 🥦', ja: 'ロマネスコ 🥦', ko: '로마네스코 🥦', ar: 'رومانيسكو 🥦', he: 'רומנסקو 🥦', tr: 'Romanesco 🥦', hu: 'Romanesco 🥦', hi: 'रोमानेस्को 🥦' },
  'judias': { en: 'Beans 🌿', de: 'Bohnen 🌿', es: 'Judías 🌿', it: 'Fagiolini 🌿', fr: 'Haricots 🌿', pt: 'Feijões 🌿', nl: 'Bonen 🌿', sv: 'Bönor 🌿', da: 'Bønner 🌿', fi: 'Pavut 🌿', no: 'Bønner 🌿', ru: 'Фасоль 🌿', zh: '豆角 🌿', ja: 'インゲン豆 🌿', ko: '콩 🌿', ar: 'فاصولياء 🌿', he: 'שעועית 🌿', tr: 'Fasulye 🌿', hu: 'Bab 🌿', hi: 'सेम 🌿' },
  'verdes': { en: 'Green', de: 'Grüne', es: 'Verdes', it: 'Verdi', fr: 'Verts', pt: 'Verdes', nl: 'Groene', sv: 'Gröna', da: 'Grønne', fi: 'Vihreät', no: 'Grønne', ru: 'Зелёные', zh: '绿色', ja: '緑', ko: '녹색', ar: 'خضراء', he: 'ירוקות', tr: 'Yeşil', hu: 'Zöld', hi: 'हरे' },
  'habas': { en: 'Broad beans 🌿', de: 'Dicke Bohnen 🌿', es: 'Habas 🌿', it: 'Fave 🌿', fr: 'Fèves 🌿', pt: 'Favas 🌿', nl: 'Tuinbonen 🌿', sv: 'Bondbönar 🌿', da: 'Hestebønner 🌿', fi: 'Härkäpavut 🌿', no: 'Hestebønner 🌿', ru: 'Бобы 🌿', zh: '蚕豆 🌿', ja: 'そら豆 🌿', ko: '누에콩 🌿', ar: 'فول 🌿', he: 'פול 🌿', tr: 'Bakla 🌿', hu: 'Lóbab 🌿', hi: 'सेम की फली 🌿' },
  'edamame': { en: 'Edamame 🌿', de: 'Edamame 🌿', es: 'Edamame 🌿', it: 'Edamame 🌿', fr: 'Edamame 🌿', pt: 'Edamame 🌿', nl: 'Edamame 🌿', sv: 'Edamame 🌿', da: 'Edamame 🌿', fi: 'Edamame 🌿', no: 'Edamame 🌿', ru: 'Эдамаме 🌿', zh: '毛豆 🌿', ja: '枝豆 🌿', ko: '에다마메 🌿', ar: 'إداماميه 🌿', he: 'אדמאמה 🌿', tr: 'Edamame 🌿', hu: 'Edamame 🌿', hi: 'एडामामे 🌿' },
  'okra': { en: 'Okra 🌿', de: 'Okra 🌿', es: 'Okra 🌿', it: 'Okra 🌿', fr: 'Okra 🌿', pt: 'Quiabo 🌿', nl: 'Okra 🌿', sv: 'Okra 🌿', da: 'Okra 🌿', fi: 'Okra 🌿', no: 'Okra 🌿', ru: 'Окра 🌿', zh: '秋葵 🌿', ja: 'オクラ 🌿', ko: '오크라 🌿', ar: 'بامية 🌿', he: 'באמיה 🌿', tr: 'Bamya 🌿', hu: 'Okra 🌿', hi: 'भिंडी 🌿' },
  'setas': { en: 'Mushrooms 🍄', de: 'Pilze 🍄', es: 'Setas 🍄', it: 'Funghi 🍄', fr: 'Champignons 🍄', pt: 'Cogumelos 🍄', nl: 'Paddenstoelen 🍄', sv: 'Svamp 🍄', da: 'Svampe 🍄', fi: 'Sienet 🍄', no: 'Sopp 🍄', ru: 'Грибы 🍄', zh: '蘑菇 🍄', ja: 'きのこ 🍄', ko: '버섯 🍄', ar: 'فطر 🍄', he: 'פטריות 🍄', tr: 'Mantar 🍄', hu: 'Gomba 🍄', hi: 'मशरूम 🍄' },
  'niscalos': { en: 'Saffron milk caps 🍄', de: 'Reizker 🍄', es: 'Níscalos 🍄', it: 'Lattari 🍄', fr: 'Lactaires 🍄', pt: 'Píscalos 🍄', nl: 'Echte melkzwam 🍄', sv: 'Riska 🍄', da: 'Mælkhat 🍄', fi: 'Männynlakki 🍄', no: 'Manet 🍄', ru: 'Рыжики 🍄', zh: '松乳菇 🍄', ja: 'アカハツ 🍄', ko: '송이버섯 🍄', ar: 'فطر الصنوبر 🍄', he: 'פטריות אורן 🍄', tr: 'Çam mantarı 🍄', hu: 'Rizike 🍄', hi: 'पाइन मशरूम 🍄' },
  'boletus': { en: 'Boletus 🍄', de: 'Steinpilze 🍄', es: 'Boletus 🍄', it: 'Porcini 🍄', fr: 'Cèpes 🍄', pt: 'Boletos 🍄', nl: 'Eekhoorntjesbrood 🍄', sv: 'Stensopp 🍄', da: 'Karl Johan 🍄', fi: 'Herkkutatti 🍄', no: 'Steinsopp 🍄', ru: 'Белые грибы 🍄', zh: '牛肝菌 🍄', ja: 'ポルチーニ 🍄', ko: '포르치니 🍄', ar: 'فطر بورتشيني 🍄', he: 'פורצ\'יני 🍄', tr: 'Porcini 🍄', hu: 'Vargánya 🍄', hi: 'पोर्चिनी 🍄' },
  'champinones': { en: 'Button mushrooms 🍄', de: 'Champignons 🍄', es: 'Champiñones 🍄', it: 'Champignon 🍄', fr: 'Champignons 🍄', pt: 'Cogumelos 🍄', nl: 'Champignons 🍄', sv: 'Champinjoner 🍄', da: 'Champignoner 🍄', fi: 'Herkkusienet 🍄', no: 'Sjampinjong 🍄', ru: 'Шампиньоны 🍄', zh: '蘑菇 🍄', ja: 'マッシュルーム 🍄', ko: '양송이버섯 🍄', ar: 'عيش الغراب 🍄', he: 'פטריות 🍄', tr: 'Şampinyon 🍄', hu: 'Csiperke 🍄', hi: 'बटन मशरूम 🍄' },
  'portobello': { en: 'Portobello 🍄', de: 'Portobello 🍄', es: 'Portobello 🍄', it: 'Portobello 🍄', fr: 'Portobello 🍄', pt: 'Portobello 🍄', nl: 'Portobello 🍄', sv: 'Portobello 🍄', da: 'Portobello 🍄', fi: 'Portobello 🍄', no: 'Portobello 🍄', ru: 'Портобелло 🍄', zh: '大蘑菇 🍄', ja: 'ポートベロー 🍄', ko: '포르토벨로 🍄', ar: 'بورتوبيلو 🍄', he: 'פורטובלו 🍄', tr: 'Portobello 🍄', hu: 'Portobello 🍄', hi: 'पोर्टोबेलो 🍄' },
  'shiitake': { en: 'Shiitake 🍄', de: 'Shiitake 🍄', es: 'Shiitake 🍄', it: 'Shiitake 🍄', fr: 'Shiitake 🍄', pt: 'Shiitake 🍄', nl: 'Shiitake 🍄', sv: 'Shiitake 🍄', da: 'Shiitake 🍄', fi: 'Shiitake 🍄', no: 'Shiitake 🍄', ru: 'Шиитаке 🍄', zh: '香菇 🍄', ja: 'しいたけ 🍄', ko: '표고버섯 🍄', ar: 'شيتاكي 🍄', he: 'שיטאקה 🍄', tr: 'Shiitake 🍄', hu: 'Shiitake 🍄', hi: 'शिताके 🍄' },
  'ostra': { en: 'Oyster mushrooms 🍄', de: 'Austernpilze 🍄', es: 'Setas ostra 🍄', it: 'Pleurotus 🍄', fr: 'Pleurotes 🍄', pt: 'Cogumelos ostra 🍄', nl: 'Oesterzwammen 🍄', sv: 'Ostronmussling 🍄', da: 'Østershat 🍄', fi: 'Osterivinokas 🍄', no: 'Østerssopp 🍄', ru: 'Вёшенки 🍄', zh: '平菇 🍄', ja: 'ヒラタケ 🍄', ko: '느타리버섯 🍄', ar: 'فطر المحار 🍄', he: 'פטריות צדפה 🍄', tr: 'İstiridye mantarı 🍄', hu: 'Laskagomba 🍄', hi: 'सीप मशरूम 🍄' },
  'rebozuelos': { en: 'Chanterelles 🍄', de: 'Pfifferlinge 🍄', es: 'Rebozuelos 🍄', it: 'Finferli 🍄', fr: 'Chanterelles 🍄', pt: 'Cantarelos 🍄', nl: 'Hanenkammen 🍄', sv: 'Kantareller 🍄', da: 'Kantareller 🍄', fi: 'Kantarelli 🍄', no: 'Kantarell 🍄', ru: 'Лисички 🍄', zh: '鸡油菌 🍄', ja: 'アンズタケ 🍄', ko: '살구버섯 🍄', ar: 'فطر الشانتيريل 🍄', he: 'שנטרל 🍄', tr: 'Chanterelle 🍄', hu: 'Rókagomba 🍄', hi: 'चांटेरेल 🍄' },
  'trompetas': { en: 'Trumpet mushrooms 🍄', de: 'Trompetenpilze 🍄', es: 'Trompetas 🍄', it: 'Trombette 🍄', fr: 'Trompettes 🍄', pt: 'Trombetas 🍄', nl: 'Trompetzwammen 🍄', sv: 'Trumpetsvamp 🍄', da: 'Trompetsvamp 🍄', fi: 'Torvisieni 🍄', no: 'Trompetsopp 🍄', ru: 'Трубчатые грибы 🍄', zh: '喇叭菌 🍄', ja: 'トランペットきのこ 🍄', ko: '나팔버섯 🍄', ar: 'فطر البوق 🍄', he: 'פטריות חצוצרה 🍄', tr: 'Trompet mantarı 🍄', hu: 'Trombitagomba 🍄', hi: 'तुरही मशरूम 🍄' },

  // FRUTOS SECOS Y MÁS PRODUCTOS ESTACIONALES MASIVOS
  'pinones': { en: 'Pine nuts 🌰', de: 'Pinienkerne 🌰', es: 'Piñones 🌰', it: 'Pinoli 🌰', fr: 'Pignons 🌰', pt: 'Pinhões 🌰', nl: 'Pijnboompitten 🌰', sv: 'Pinjenötter 🌰', da: 'Pinjekerner 🌰', fi: 'Männynsiemenet 🌰', no: 'Pinjekjerner 🌰', ru: 'Кедровые орехи 🌰', zh: '松子 🌰', ja: '松の実 🌰', ko: '잣 🌰', ar: 'صنوبر 🌰', he: 'אגוזי אורן 🌰', tr: 'Çam fıstığı 🌰', hu: 'Fenyőmag 🌰', hi: 'चीड़ के बीज 🌰' },
  'pistachos': { en: 'Pistachios 🌰', de: 'Pistazien 🌰', es: 'Pistachos 🌰', it: 'Pistacchi 🌰', fr: 'Pistaches 🌰', pt: 'Pistácios 🌰', nl: 'Pistachenoten 🌰', sv: 'Pistaschnötter 🌰', da: 'Pistacienødder 🌰', fi: 'Pistaasipähkinät 🌰', no: 'Pistasjnøtter 🌰', ru: 'Фисташки 🌰', zh: '开心果 🌰', ja: 'ピスタチオ 🌰', ko: '피스타치오 🌰', ar: 'فستق 🌰', he: 'פיסטוקים 🌰', tr: 'Antep fıstığı 🌰', hu: 'Pisztácia 🌰', hi: 'पिस्ता 🌰' },
  'anacardos': { en: 'Cashews 🌰', de: 'Cashewnüsse 🌰', es: 'Anacardos 🌰', it: 'Anacardi 🌰', fr: 'Noix de cajou 🌰', pt: 'Castanha de caju 🌰', nl: 'Cashewnoten 🌰', sv: 'Cashewnötter 🌰', da: 'Cashewnødder 🌰', fi: 'Cashewpähkinät 🌰', no: 'Cashewnøtter 🌰', ru: 'Кешью 🌰', zh: '腰果 🌰', ja: 'カシューナッツ 🌰', ko: '캐슈넛 🌰', ar: 'كاجو 🌰', he: 'קשיו 🌰', tr: 'Kaju 🌰', hu: 'Kesudió 🌰', hi: 'काजू 🌰' },
  'pacanas': { en: 'Pecans 🌰', de: 'Pekannüsse 🌰', es: 'Pacanas 🌰', it: 'Noci pecan 🌰', fr: 'Noix de pécan 🌰', pt: 'Nozes-pecã 🌰', nl: 'Pecannoten 🌰', sv: 'Pekannötter 🌰', da: 'Pekannødder 🌰', fi: 'Pekaanipähkinät 🌰', no: 'Pekannøtter 🌰', ru: 'Пекан 🌰', zh: '山核桃 🌰', ja: 'ペカン 🌰', ko: '피칸 🌰', ar: 'بيكان 🌰', he: 'פקאן 🌰', tr: 'Pekan cevizi 🌰', hu: 'Pekándió 🌰', hi: 'पेकान 🌰' },
  'macadamias': { en: 'Macadamias 🌰', de: 'Macadamianüsse 🌰', es: 'Macadamias 🌰', it: 'Macadamia 🌰', fr: 'Noix de macadamia 🌰', pt: 'Macadâmias 🌰', nl: 'Macadamianoten 🌰', sv: 'Macadamianötter 🌰', da: 'Macadamianødder 🌰', fi: 'Macadamiapähkinät 🌰', no: 'Macadamianøtter 🌰', ru: 'Макадамия 🌰', zh: '夏威夷果 🌰', ja: 'マカダミア 🌰', ko: '마카다미아 🌰', ar: 'ماكاداميا 🌰', he: 'מקדמיה 🌰', tr: 'Makadamya 🌰', hu: 'Makadámia 🌰', hi: 'मकाडामिया 🌰' },
  'azukis': { en: 'Azuki beans 🌿', de: 'Azukibohnen 🌿', es: 'Azukis 🌿', it: 'Fagioli azuki 🌿', fr: 'Haricots azuki 🌿', pt: 'Feijão azuki 🌿', nl: 'Azukibonen 🌿', sv: 'Azukibönor 🌿', da: 'Azukibønner 🌿', fi: 'Azukipavut 🌿', no: 'Azukibønner 🌿', ru: 'Адзуки 🌿', zh: '红豆 🌿', ja: '小豆 🌿', ko: '팥 🌿', ar: 'فاصولياء أزوكي 🌿', he: 'אזוקי 🌿', tr: 'Azuki fasulyesi 🌿', hu: 'Azuki bab 🌿', hi: 'अजुकी बीन्स 🌿' },
  'pintas': { en: 'Pinto beans 🌿', de: 'Pintobohnen 🌿', es: 'Judías pintas 🌿', it: 'Fagioli pinto 🌿', fr: 'Haricots pinto 🌿', pt: 'Feijão rajado 🌿', nl: 'Pintobonen 🌿', sv: 'Pintobönor 🌿', da: 'Pintobønner 🌿', fi: 'Pintopavut 🌿', no: 'Pintobønner 🌿', ru: 'Пинто 🌿', zh: '花豆 🌿', ja: 'ピント豆 🌿', ko: '핀토콩 🌿', ar: 'فاصولياء منقطة 🌿', he: 'שעועית פינטו 🌿', tr: 'Pinto fasulye 🌿', hu: 'Pinto bab 🌿', hi: 'पिंटो बीन्स 🌿' },
  'quinoa': { en: 'Quinoa 🌾', de: 'Quinoa 🌾', es: 'Quinoa 🌾', it: 'Quinoa 🌾', fr: 'Quinoa 🌾', pt: 'Quinoa 🌾', nl: 'Quinoa 🌾', sv: 'Quinoa 🌾', da: 'Quinoa 🌾', fi: 'Kvinoa 🌾', no: 'Quinoa 🌾', ru: 'Киноа 🌾', zh: '藜麦 🌾', ja: 'キヌア 🌾', ko: '퀴노아 🌾', ar: 'كينوا 🌾', he: 'קינואה 🌾', tr: 'Kinoa 🌾', hu: 'Quinoa 🌾', hi: 'क्विनोआ 🌾' },
  'arroz': { en: 'Rice 🌾', de: 'Reis 🌾', es: 'Arroz 🌾', it: 'Riso 🌾', fr: 'Riz 🌾', pt: 'Arroz 🌾', nl: 'Rijst 🌾', sv: 'Ris 🌾', da: 'Ris 🌾', fi: 'Riisi 🌾', no: 'Ris 🌾', ru: 'Рис 🌾', zh: '大米 🌾', ja: '米 🌾', ko: '쌀 🌾', ar: 'أرز 🌾', he: 'אורז 🌾', tr: 'Pirinç 🌾', hu: 'Rizs 🌾', hi: 'चावल 🌾' },
  'nuevo': { en: 'New', de: 'Neu', es: 'Nuevo', it: 'Nuovo', fr: 'Nouveau', pt: 'Novo', nl: 'Nieuw', sv: 'Ny', da: 'Ny', fi: 'Uusi', no: 'Ny', ru: 'Новый', zh: '新', ja: '新', ko: '새', ar: 'جديد', he: 'חדש', tr: 'Yeni', hu: 'Új', hi: 'नया' },
  'cebada': { en: 'Barley 🌾', de: 'Gerste 🌾', es: 'Cebada 🌾', it: 'Orzo 🌾', fr: 'Orge 🌾', pt: 'Cevada 🌾', nl: 'Gerst 🌾', sv: 'Korn 🌾', da: 'Byg 🌾', fi: 'Ohra 🌾', no: 'Bygg 🌾', ru: 'Ячмень 🌾', zh: '大麦 🌾', ja: '大麦 🌾', ko: '보리 🌾', ar: 'شعير 🌾', he: 'שעורה 🌾', tr: 'Arpa 🌾', hu: 'Árpa 🌾', hi: 'जौ 🌾' },
  'mijo': { en: 'Millet 🌾', de: 'Hirse 🌾', es: 'Mijo 🌾', it: 'Miglio 🌾', fr: 'Millet 🌾', pt: 'Painço 🌾', nl: 'Gierst 🌾', sv: 'Hirs 🌾', da: 'Hirse 🌾', fi: 'Hirssi 🌾', no: 'Hirse 🌾', ru: 'Просо 🌾', zh: '小米 🌾', ja: '粟 🌾', ko: '기장 🌾', ar: 'دخن 🌾', he: 'דוחן 🌾', tr: 'Darı 🌾', hu: 'Köles 🌾', hi: 'बाजरा 🌾' },

  // Frutas adicionales
  'pomelos': { en: 'Grapefruits 🍊', de: 'Grapefruits 🍊', es: 'Pomelos 🍊', it: 'Pompelmi 🍊', fr: 'Pamplemousses 🍊', pt: 'Toranjas 🍊', nl: 'Grapefruits 🍊', sv: 'Grapefrukt 🍊', da: 'Grapefrugt 🍊', fi: 'Greippi 🍊', no: 'Grapefrukt 🍊', ru: 'Грейпфруты 🍊', zh: '柚子 🍊', ja: 'グレープフルーツ 🍊', ko: '자몽 🍊', ar: 'جريب فروت 🍊', he: 'אשכוליות 🍊', tr: 'Greyfurt 🍊', hu: 'Grépfrút 🍊', hi: 'चकोतरा 🍊' },
  'limas': { en: 'Limes 🍋', de: 'Limetten 🍋', es: 'Limas 🍋', it: 'Lime 🍋', fr: 'Citrons verts 🍋', pt: 'Limas 🍋', nl: 'Limoenen 🍋', sv: 'Lime 🍋', da: 'Lime 🍋', fi: 'Lime 🍋', no: 'Lime 🍋', ru: 'Лаймы 🍋', zh: '青柠 🍋', ja: 'ライム 🍋', ko: '라임 🍋', ar: 'ليم 🍋', he: 'ליים 🍋', tr: 'Limon 🍋', hu: 'Lime 🍋', hi: 'नींबू हरा 🍋' },

  // BEBIDAS Y LICORES MASIVOS
  'vino': { en: 'Wine 🍷', de: 'Wein 🍷', es: 'Vino 🍷', it: 'Vino 🍷', fr: 'Vin 🍷', pt: 'Vinho 🍷', nl: 'Wijn 🍷', sv: 'Vin 🍷', da: 'Vin 🍷', fi: 'Viini 🍷', no: 'Vin 🍷', ru: 'Вино 🍷', zh: '酒 🍷', ja: 'ワイン 🍷', ko: '와인 🍷', ar: 'نبيذ 🍷', he: 'יין 🍷', tr: 'Şarap 🍷', hu: 'Bor 🍷', hi: 'वाइन 🍷' },
  'sidra': { en: 'Cider 🍻', de: 'Apfelwein 🍻', es: 'Sidra 🍻', it: 'Sidro 🍻', fr: 'Cidre 🍻', pt: 'Sidra 🍻', nl: 'Cider 🍻', sv: 'Cider 🍻', da: 'Cider 🍻', fi: 'Siideri 🍻', no: 'Sider 🍻', ru: 'Сидр 🍻', zh: '苹果酒 🍻', ja: 'サイダー 🍻', ko: '사이다 🍻', ar: 'عصير التفاح المتخمر 🍻', he: 'סיידר 🍻', tr: 'Elma şarabı 🍻', hu: 'Almabor 🍻', hi: 'साइडर 🍻' },
  'brandy': { en: 'Brandy 🥃', de: 'Brandy 🥃', es: 'Brandy 🥃', it: 'Brandy 🥃', fr: 'Brandy 🥃', pt: 'Brandy 🥃', nl: 'Brandy 🥃', sv: 'Brandy 🥃', da: 'Brandy 🥃', fi: 'Brandy 🥃', no: 'Brandy 🥃', ru: 'Бренди 🥃', zh: '白兰地 🥃', ja: 'ブランデー 🥃', ko: '브랜디 🥃', ar: 'براندي 🥃', he: 'ברנדי 🥃', tr: 'Brandy 🥃', hu: 'Brandy 🥃', hi: 'ब्रांडी 🥃' },
  'orujo': { en: 'Orujo 🥃', de: 'Tresterbrand 🥃', es: 'Orujo 🥃', it: 'Grappa 🥃', fr: 'Eau-de-vie 🥃', pt: 'Bagaceira 🥃', nl: 'Druivenbrandewijn 🥃', sv: 'Grappa 🥃', da: 'Grappa 🥃', fi: 'Grappa 🥃', no: 'Grappa 🥃', ru: 'Граппа 🥃', zh: '渣酿白兰地 🥃', ja: 'グラッパ 🥃', ko: '그라파 🥃', ar: 'أوروخو 🥃', he: 'גראפה 🥃', tr: 'Grappa 🥃', hu: 'Törköly 🥃', hi: 'ओरुखो 🥃' },
  'pacharan': { en: 'Pacharán 🥃', de: 'Pacharán 🥃', es: 'Pacharán 🥃', it: 'Pacharán 🥃', fr: 'Pacharán 🥃', pt: 'Pacharán 🥃', nl: 'Pacharán 🥃', sv: 'Pacharán 🥃', da: 'Pacharán 🥃', fi: 'Pacharán 🥃', no: 'Pacharán 🥃', ru: 'Пачаран 🥃', zh: '帕查兰酒 🥃', ja: 'パチャラン 🥃', ko: '파차란 🥃', ar: 'باتشاران 🥃', he: 'פצ\'אראן 🥃', tr: 'Pacharán 🥃', hu: 'Pacharán 🥃', hi: 'पाचरान 🥃' },
  'anis': { en: 'Anise liqueur 🥃', de: 'Anislikör 🥃', es: 'Anís 🥃', it: 'Anice 🥃', fr: 'Anis 🥃', pt: 'Anis 🥃', nl: 'Anijs 🥃', sv: 'Anis 🥃', da: 'Anis 🥃', fi: 'Anis 🥃', no: 'Anis 🥃', ru: 'Анисовая настойка 🥃', zh: '茴香酒 🥃', ja: 'アニス酒 🥃', ko: '아니스 🥃', ar: 'عرق الينسون 🥃', he: 'אניס 🥃', tr: 'Anason likörü 🥃', hu: 'Ánizs 🥃', hi: 'सौंफ की शराब 🥃' },
  'ron': { en: 'Rum 🥃', de: 'Rum 🥃', es: 'Ron 🥃', it: 'Rum 🥃', fr: 'Rhum 🥃', pt: 'Rum 🥃', nl: 'Rum 🥃', sv: 'Rom 🥃', da: 'Rom 🥃', fi: 'Rommi 🥃', no: 'Rom 🥃', ru: 'Ром 🥃', zh: '朗姆酒 🥃', ja: 'ラム 🥃', ko: '럼 🥃', ar: 'روم 🥃', he: 'רום 🥃', tr: 'Rom 🥃', hu: 'Rum 🥃', hi: 'रम 🥃' },

  // PESCADOS Y MARISCOS MASIVOS
  'pescado': { en: 'Fish 🐟', de: 'Fisch 🐟', es: 'Pescado 🐟', it: 'Pesce 🐟', fr: 'Poisson 🐟', pt: 'Peixe 🐟', nl: 'Vis 🐟', sv: 'Fisk 🐟', da: 'Fisk 🐟', fi: 'Kala 🐟', no: 'Fisk 🐟', ru: 'Рыба 🐟', zh: '鱼 🐟', ja: '魚 🐟', ko: '생선 🐟', ar: 'سمك 🐟', he: 'דג 🐟', tr: 'Balık 🐟', hu: 'Hal 🐟', hi: 'मछली 🐟' },
  'azul': { en: 'Blue', de: 'Blau', es: 'Azul', it: 'Azzurro', fr: 'Bleu', pt: 'Azul', nl: 'Blauw', sv: 'Blå', da: 'Blå', fi: 'Sininen', no: 'Blå', ru: 'Синий', zh: '蓝色', ja: '青', ko: '파란', ar: 'أزرق', he: 'כחול', tr: 'Mavi', hu: 'Kék', hi: 'नीला' },
  'sardinas': { en: 'Sardines 🐟', de: 'Sardinen 🐟', es: 'Sardinas 🐟', it: 'Sardine 🐟', fr: 'Sardines 🐟', pt: 'Sardinhas 🐟', nl: 'Sardines 🐟', sv: 'Sardiner 🐟', da: 'Sardiner 🐟', fi: 'Sardiinit 🐟', no: 'Sardiner 🐟', ru: 'Сардины 🐟', zh: '沙丁鱼 🐟', ja: 'イワシ 🐟', ko: '정어리 🐟', ar: 'سردين 🐟', he: 'סרדינים 🐟', tr: 'Sardalya 🐟', hu: 'Szardínia 🐟', hi: 'सार्डिन मछली 🐟' },
  'bonito': { en: 'Bonito 🐟', de: 'Bonito 🐟', es: 'Bonito 🐟', it: 'Bonito 🐟', fr: 'Bonite 🐟', pt: 'Bonito 🐟', nl: 'Bonito 🐟', sv: 'Bonito 🐟', da: 'Bonito 🐟', fi: 'Bonito 🐟', no: 'Bonito 🐟', ru: 'Бонито 🐟', zh: '鲣鱼 🐟', ja: 'カツオ 🐟', ko: '가다랑어 🐟', ar: 'بونيتو 🐟', he: 'בוניטו 🐟', tr: 'Palamut 🐟', hu: 'Bonito 🐟', hi: 'बोनिटो मछली 🐟' },
  'anchoas': { en: 'Anchovies 🐟', de: 'Sardellen 🐟', es: 'Anchoas 🐟', it: 'Acciughe 🐟', fr: 'Anchois 🐟', pt: 'Anchovas 🐟', nl: 'Ansjovis 🐟', sv: 'Ansjovis 🐟', da: 'Ansjos 🐟', fi: 'Sardellit 🐟', no: 'Ansjos 🐟', ru: 'Анчоусы 🐟', zh: '鳀鱼 🐟', ja: 'アンチョビ 🐟', ko: '멸치 🐟', ar: 'أنشوجة 🐟', he: 'אנשובי 🐟', tr: 'Hamsi 🐟', hu: 'Szardella 🐟', hi: 'एंकोवी मछली 🐟' },
  'salmon': { en: 'Salmon 🐟', de: 'Lachs 🐟', es: 'Salmón 🐟', it: 'Salmone 🐟', fr: 'Saumon 🐟', pt: 'Salmão 🐟', nl: 'Zalm 🐟', sv: 'Lax 🐟', da: 'Laks 🐟', fi: 'Lohi 🐟', no: 'Laks 🐟', ru: 'Лосось 🐟', zh: '三文鱼 🐟', ja: 'サーモン 🐟', ko: '연어 🐟', ar: 'سلمون 🐟', he: 'סלמון 🐟', tr: 'Somon 🐟', hu: 'Lazac 🐟', hi: 'सैल्मन मछली 🐟' },
  'trucha': { en: 'Trout 🐟', de: 'Forelle 🐟', es: 'Trucha 🐟', it: 'Trota 🐟', fr: 'Truite 🐟', pt: 'Truta 🐟', nl: 'Forel 🐟', sv: 'Öring 🐟', da: 'Ørred 🐟', fi: 'Taimen 🐟', no: 'Ørret 🐟', ru: 'Форель 🐟', zh: '鳟鱼 🐟', ja: 'マス 🐟', ko: '송어 🐟', ar: 'تراوت 🐟', he: 'פורל 🐟', tr: 'Alabalık 🐟', hu: 'Pisztráng 🐟', hi: 'ट्राउट मछली 🐟' },
  'lubina': { en: 'Sea bass 🐟', de: 'Seebarsch 🐟', es: 'Lubina 🐟', it: 'Branzino 🐟', fr: 'Bar 🐟', pt: 'Robalo 🐟', nl: 'Zeebaars 🐟', sv: 'Havaborre 🐟', da: 'Havaborre 🐟', fi: 'Meriahven 🐟', no: 'Havabbor 🐟', ru: 'Морской окунь 🐟', zh: '鲈鱼 🐟', ja: 'スズキ 🐟', ko: '농어 🐟', ar: 'قاروص 🐟', he: 'לברק 🐟', tr: 'Levrek 🐟', hu: 'Tengeri sügér 🐟', hi: 'समुद्री बास मछली 🐟' },
  'dorada': { en: 'Sea bream 🐟', de: 'Goldbrasse 🐟', es: 'Dorada 🐟', it: 'Orata 🐟', fr: 'Daurade 🐟', pt: 'Dourada 🐟', nl: 'Zeebrasem 🐟', sv: 'Havsbraxen 🐟', da: 'Havbrasen 🐟', fi: 'Kultakala 🐟', no: 'Havbrasme 🐟', ru: 'Дорада 🐟', zh: '金头鲷 🐟', ja: 'ヨーロッパヘダイ 🐟', ko: '도미 🐟', ar: 'دنيس 🐟', he: 'דניס 🐟', tr: 'Çipura 🐟', hu: 'Tengeri keszeg 🐟', hi: 'डोरैडा मछली 🐟' },
  'langostinos': { en: 'Prawns 🦐', de: 'Garnelen 🦐', es: 'Langostinos 🦐', it: 'Gamberoni 🦐', fr: 'Langoustines 🦐', pt: 'Lagostins 🦐', nl: 'Langoustines 🦐', sv: 'Havskräftor 🦐', da: 'Jomfruhummer 🦐', fi: 'Taskurapuja 🦐', no: 'Sjøkreps 🦐', ru: 'Лангустины 🦐', zh: '挪威海螯虾 🦐', ja: 'ラングスティーヌ 🦐', ko: '바닷가재 🦐', ar: 'جمبري كبير 🦐', he: 'שרימפס גדול 🦐', tr: 'Kaplan karidesi 🦐', hu: 'Langusztin 🦐', hi: 'लैंगोस्टिनो 🦐' },
  'almejas': { en: 'Clams 🦪', de: 'Venusmuscheln 🦪', es: 'Almejas 🦪', it: 'Vongole 🦪', fr: 'Palourdes 🦪', pt: 'Amêijoas 🦪', nl: 'Venusschelpen 🦪', sv: 'Musslor 🦪', da: 'Muslinger 🦪', fi: 'Simpukat 🦪', no: 'Skjell 🦪', ru: 'Моллюски 🦪', zh: '蛤蜊 🦪', ja: 'ハマグリ 🦪', ko: '조개 🦪', ar: 'محار 🦪', he: 'צדפות 🦪', tr: 'Midye 🦪', hu: 'Kagyló 🦪', hi: 'सीप 🦪' },
  'vieiras': { en: 'Scallops 🦪', de: 'Jakobsmuscheln 🦪', es: 'Vieiras 🦪', it: 'Capesante 🦪', fr: 'Coquilles Saint-Jacques 🦪', pt: 'Vieiras 🦪', nl: 'Jakobsschelpen 🦪', sv: 'Pilgrimsmusslor 🦪', da: 'Kammuslinger 🦪', fi: 'Kampasimpukat 🦪', no: 'Kamskjell 🦪', ru: 'Гребешки 🦪', zh: '扇贝 🦪', ja: 'ホタテ 🦪', ko: '가리비 🦪', ar: 'أسقلوب 🦪', he: 'צדפות קדוש יעקב 🦪', tr: 'Tarak 🦪', hu: 'Fésűkagyló 🦪', hi: 'स्कैलप 🦪' },
  'piñas': { en: 'Pineapples 🍍', de: 'Ananas 🍍', es: 'Piñas 🍍', it: 'Ananas 🍍', fr: 'Ananas 🍍', pt: 'Abacaxis 🍍', nl: 'Ananassen 🍍', sv: 'Ananas 🍍', da: 'Ananas 🍍', fi: 'Ananas 🍍', no: 'Ananas 🍍', ru: 'Ананасы 🍍', zh: '菠萝 🍍', ja: 'パイナップル 🍍', ko: '파인애플 🍍', ar: 'أناناس 🍍', he: 'אננס 🍍', tr: 'Ananas 🍍', hu: 'Ananász 🍍', hi: 'अनानास 🍍' },
  'nísperos': { en: 'Loquats 🍑', de: 'Mispeln 🍑', es: 'Nísperos 🍑', it: 'Nespole 🍑', fr: 'Nèfles 🍑', pt: 'Nêsperas 🍑', nl: 'Loquats 🍑', sv: 'Japansk mispel 🍑', da: 'Japansk mispel 🍑', fi: 'Japanilukuja 🍑', no: 'Japansk mispel 🍑', ru: 'Мушмула 🍑', zh: '枇杷 🍑', ja: 'ビワ 🍑', ko: '비파 🍑', ar: 'إجاص ياباني 🍑', he: 'שסק יפני 🍑', tr: 'Malta eriği 🍑', hu: 'Japán naspolya 🍑', hi: 'लोकाट 🍑' },
  'albaricoques': { en: 'Apricots 🍑', de: 'Aprikosen 🍑', es: 'Albaricoques 🍑', it: 'Albicocche 🍑', fr: 'Abricots 🍑', pt: 'Damascos 🍑', nl: 'Abrikozen 🍑', sv: 'Aprikoser 🍑', da: 'Abrikoser 🍑', fi: 'Aprikoosit 🍑', no: 'Aprikoser 🍑', ru: 'Абрикосы 🍑', zh: '杏 🍑', ja: 'アプリコット 🍑', ko: '살구 🍑', ar: 'مشمش 🍑', he: 'משמשים 🍑', tr: 'Kayısı 🍑', hu: 'Sárgabarack 🍑', hi: 'खुबानी 🍑' },
  'nectarinas': { en: 'Nectarines 🍑', de: 'Nektarinen 🍑', es: 'Nectarinas 🍑', it: 'Nettarine 🍑', fr: 'Nectarines 🍑', pt: 'Nectarinas 🍑', nl: 'Nectarines 🍑', sv: 'Nektariner 🍑', da: 'Nektariner 🍑', fi: 'Nektariinit 🍑', no: 'Nektariner 🍑', ru: 'Нектарины 🍑', zh: '油桃 🍑', ja: 'ネクタリン 🍑', ko: '천도복숭아 🍑', ar: 'خوخ أملس 🍑', he: 'נקטרינות 🍑', tr: 'Nektarin 🍑', hu: 'Nektarin 🍑', hi: 'नेक्टेरिन 🍑' },

  // QUESOS Y LÁCTEOS MASIVOS
  'quesos': { en: 'Cheeses 🧀', de: 'Käse 🧀', es: 'Quesos 🧀', it: 'Formaggi 🧀', fr: 'Fromages 🧀', pt: 'Queijos 🧀', nl: 'Kazen 🧀', sv: 'Ostar 🧀', da: 'Oste 🧀', fi: 'Juustot 🧀', no: 'Oster 🧀', ru: 'Сыры 🧀', zh: '奶酪 🧀', ja: 'チーズ 🧀', ko: '치즈 🧀', ar: 'جبن 🧀', he: 'גבינות 🧀', tr: 'Peynir 🧀', hu: 'Sajtok 🧀', hi: 'पनीर 🧀' },
  'curados': { en: 'Aged', de: 'Gereift', es: 'Curados', it: 'Stagionati', fr: 'Affinés', pt: 'Curados', nl: 'Gerijpt', sv: 'Mogna', da: 'Modne', fi: 'Kypsytetyt', no: 'Modne', ru: 'Выдержанные', zh: '熟成', ja: '熟成', ko: '숙성', ar: 'معتق', he: 'מיושנים', tr: 'Olgunlaştırılmış', hu: 'Érlelt', hi: 'परिपक्व' },
  'manchego': { en: 'Manchego 🧀', de: 'Manchego 🧀', es: 'Manchego 🧀', it: 'Manchego 🧀', fr: 'Manchego 🧀', pt: 'Manchego 🧀', nl: 'Manchego 🧀', sv: 'Manchego 🧀', da: 'Manchego 🧀', fi: 'Manchego 🧀', no: 'Manchego 🧀', ru: 'Манчего 🧀', zh: '曼切戈奶酪 🧀', ja: 'マンチェゴ 🧀', ko: '만체고 🧀', ar: 'مانشيغو 🧀', he: 'מנצ\'גו 🧀', tr: 'Manchego 🧀', hu: 'Manchego 🧀', hi: 'मांचेगो 🧀' },
  'cabrales': { en: 'Cabrales 🧀', de: 'Cabrales 🧀', es: 'Cabrales 🧀', it: 'Cabrales 🧀', fr: 'Cabrales 🧀', pt: 'Cabrales 🧀', nl: 'Cabrales 🧀', sv: 'Cabrales 🧀', da: 'Cabrales 🧀', fi: 'Cabrales 🧀', no: 'Cabrales 🧀', ru: 'Кабралес 🧀', zh: '卡布拉雷斯奶酪 🧀', ja: 'カブラレス 🧀', ko: '카브랄레스 🧀', ar: 'كابراليس 🧀', he: 'קבראלס 🧀', tr: 'Cabrales 🧀', hu: 'Cabrales 🧀', hi: 'कैब्रेल्स 🧀' },
  'roquefort': { en: 'Roquefort 🧀', de: 'Roquefort 🧀', es: 'Roquefort 🧀', it: 'Roquefort 🧀', fr: 'Roquefort 🧀', pt: 'Roquefort 🧀', nl: 'Roquefort 🧀', sv: 'Roquefort 🧀', da: 'Roquefort 🧀', fi: 'Roquefort 🧀', no: 'Roquefort 🧀', ru: 'Рокфор 🧀', zh: '洛克福奶酪 🧀', ja: 'ロックフォール 🧀', ko: '로크포르 🧀', ar: 'روكفور 🧀', he: 'רוקפור 🧀', tr: 'Roquefort 🧀', hu: 'Roquefort 🧀', hi: 'रॉकफोर्ट 🧀' },
  'parmesano': { en: 'Parmesan 🧀', de: 'Parmesan 🧀', es: 'Parmesano 🧀', it: 'Parmigiano 🧀', fr: 'Parmesan 🧀', pt: 'Parmesão 🧀', nl: 'Parmezaan 🧀', sv: 'Parmesan 🧀', da: 'Parmesan 🧀', fi: 'Parmesan 🧀', no: 'Parmesan 🧀', ru: 'Пармезан 🧀', zh: '帕尔马干酪 🧀', ja: 'パルメザン 🧀', ko: '파르메산 🧀', ar: 'بارميزان 🧀', he: 'פרמזן 🧀', tr: 'Parmesan 🧀', hu: 'Parmezán 🧀', hi: 'परमेसन 🧀' },
  'yogures': { en: 'Yogurts 🥛', de: 'Joghurt 🥛', es: 'Yogures 🥛', it: 'Yogurt 🥛', fr: 'Yaourts 🥛', pt: 'Iogurtes 🥛', nl: 'Yoghurt 🥛', sv: 'Yoghurt 🥛', da: 'Yoghurt 🥛', fi: 'Jogurtti 🥛', no: 'Yoghurt 🥛', ru: 'Йогурт 🥛', zh: '酸奶 🥛', ja: 'ヨーグルト 🥛', ko: '요거트 🥛', ar: 'زبادي 🥛', he: 'יוגורט 🥛', tr: 'Yoğurt 🥛', hu: 'Joghurt 🥛', hi: 'दही 🥛' },
  'kefir': { en: 'Kefir 🥛', de: 'Kefir 🥛', es: 'Kéfir 🥛', it: 'Kefir 🥛', fr: 'Kéfir 🥛', pt: 'Kefir 🥛', nl: 'Kefir 🥛', sv: 'Kefir 🥛', da: 'Kefir 🥛', fi: 'Kefir 🥛', no: 'Kefir 🥛', ru: 'Кефир 🥛', zh: '克菲尔 🥛', ja: 'ケフィア 🥛', ko: '케피어 🥛', ar: 'كفير 🥛', he: 'קפיר 🥛', tr: 'Kefir 🥛', hu: 'Kefir 🥛', hi: 'केफिर 🥛' },
  'leche': { en: 'Milk 🥛', de: 'Milch 🥛', es: 'Leche 🥛', it: 'Latte 🥛', fr: 'Lait 🥛', pt: 'Leite 🥛', nl: 'Melk 🥛', sv: 'Mjölk 🥛', da: 'Mælk 🥛', fi: 'Maito 🥛', no: 'Melk 🥛', ru: 'Молоко 🥛', zh: '牛奶 🥛', ja: '牛乳 🥛', ko: '우유 🥛', ar: 'حليب 🥛', he: 'חלב 🥛', tr: 'Süt 🥛', hu: 'Tej 🥛', hi: 'दूध 🥛' },
  'mantequilla': { en: 'Butter 🧈', de: 'Butter 🧈', es: 'Mantequilla 🧈', it: 'Burro 🧈', fr: 'Beurre 🧈', pt: 'Manteiga 🧈', nl: 'Boter 🧈', sv: 'Smör 🧈', da: 'Smør 🧈', fi: 'Voi 🧈', no: 'Smør 🧈', ru: 'Масло 🧈', zh: '黄油 🧈', ja: 'バター 🧈', ko: '버터 🧈', ar: 'زبدة 🧈', he: 'חמאה 🧈', tr: 'Tereyağı 🧈', hu: 'Vaj 🧈', hi: 'मक्खन 🧈' },
  'jalea': { en: 'Royal jelly 🍯', de: 'Gelée Royale 🍯', es: 'Jalea real 🍯', it: 'Pappa reale 🍯', fr: 'Gelée royale 🍯', pt: 'Geleia real 🍯', nl: 'Koninginnengelei 🍯', sv: 'Drottninggelé 🍯', da: 'Bidronninggelé 🍯', fi: 'Kuningattarhyytelö 🍯', no: 'Dronninggelé 🍯', ru: 'Маточное молочко 🍯', zh: '蜂王浆 🍯', ja: 'ローヤルゼリー 🍯', ko: '로열젤리 🍯', ar: 'غذاء ملكات النحل 🍯', he: 'ג\'לי מלכות 🍯', tr: 'Arı sütü 🍯', hu: 'Méhpempő 🍯', hi: 'रॉयल जेली 🍯' },
  'real': { en: 'Royal', de: 'Königlich', es: 'Real', it: 'Reale', fr: 'Royal', pt: 'Real', nl: 'Koninklijk', sv: 'Kunglig', da: 'Kongelig', fi: 'Kuninkaallinen', no: 'Kongelig', ru: 'Королевский', zh: '皇家', ja: 'ロイヤル', ko: '로열', ar: 'ملكي', he: 'מלכותי', tr: 'Kraliyet', hu: 'Királyi', hi: 'शाही' },
  'polen': { en: 'Pollen 🌿', de: 'Pollen 🌿', es: 'Polen 🌿', it: 'Polline 🌿', fr: 'Pollen 🌿', pt: 'Pólen 🌿', nl: 'Stuifmeel 🌿', sv: 'Pollen 🌿', da: 'Pollen 🌿', fi: 'Siitepöly 🌿', no: 'Pollen 🌿', ru: 'Пыльца 🌿', zh: '花粉 🌿', ja: '花粉 🌿', ko: '꽃가루 🌿', ar: 'حبوب اللقاح 🌿', he: 'אבקה 🌿', tr: 'Polen 🌿', hu: 'Virágpor 🌿', hi: 'पराग 🌿' },
  'propoleo': { en: 'Propolis 🍯', de: 'Propolis 🍯', es: 'Propóleo 🍯', it: 'Propoli 🍯', fr: 'Propolis 🍯', pt: 'Própolis 🍯', nl: 'Propolis 🍯', sv: 'Propolis 🍯', da: 'Propolis 🍯', fi: 'Propolis 🍯', no: 'Propolis 🍯', ru: 'Прополис 🍯', zh: '蜂胶 🍯', ja: 'プロポリス 🍯', ko: '프로폴리스 🍯', ar: 'عكبر النحل 🍯', he: 'פרופוליס 🍯', tr: 'Propolis 🍯', hu: 'Propolisz 🍯', hi: 'प्रोपोलिस 🍯' },

  // ACEITES Y CONDIMENTOS MASIVOS
  'aceite': { en: 'Oil 🫒', de: 'Öl 🫒', es: 'Aceite 🫒', it: 'Olio 🫒', fr: 'Huile 🫒', pt: 'Azeite 🫒', nl: 'Olie 🫒', sv: 'Olja 🫒', da: 'Olie 🫒', fi: 'Öljy 🫒', no: 'Olje 🫒', ru: 'Масло 🫒', zh: '油 🫒', ja: 'オイル 🫒', ko: '오일 🫒', ar: 'زيت 🫒', he: 'שמן 🫒', tr: 'Yağ 🫒', hu: 'Olaj 🫒', hi: 'तेल 🫒' },
  'oliva': { en: 'Olive 🫒', de: 'Olive 🫒', es: 'Oliva 🫒', it: 'Oliva 🫒', fr: 'Olive 🫒', pt: 'Azeitona 🫒', nl: 'Olijf 🫒', sv: 'Oliv 🫒', da: 'Oliven 🫒', fi: 'Oliivi 🫒', no: 'Oliven 🫒', ru: 'Оливка 🫒', zh: '橄榄 🫒', ja: 'オリーブ 🫒', ko: '올리브 🫒', ar: 'زيتون 🫒', he: 'זית 🫒', tr: 'Zeytin 🫒', hu: 'Olíva 🫒', hi: 'जैतून 🫒' },
  'virgen': { en: 'Virgin', de: 'Nativ', es: 'Virgen', it: 'Vergine', fr: 'Vierge', pt: 'Virgem', nl: 'Maagd', sv: 'Jungfru', da: 'Jomfru', fi: 'Neitsyt', no: 'Jomfru', ru: 'Девственный', zh: '初榨', ja: 'バージン', ko: '버진', ar: 'بكر', he: 'בתול', tr: 'Sızma', hu: 'Szűz', hi: 'कुंवारी' },
  'extra': { en: 'Extra', de: 'Extra', es: 'Extra', it: 'Extra', fr: 'Extra', pt: 'Extra', nl: 'Extra', sv: 'Extra', da: 'Ekstra', fi: 'Ekstra', no: 'Ekstra', ru: 'Экстра', zh: '特级', ja: 'エクストラ', ko: '엑스트라', ar: 'ممتاز', he: 'אקסטרא', tr: 'Ekstra', hu: 'Extra', hi: 'अतिरिक्त' },
  'jerez': { en: 'Sherry 🌿', de: 'Sherry 🌿', es: 'Jerez 🌿', it: 'Sherry 🌿', fr: 'Xérès 🌿', pt: 'Xerez 🌿', nl: 'Sherry 🌿', sv: 'Sherry 🌿', da: 'Sherry 🌿', fi: 'Sherry 🌿', no: 'Sherry 🌿', ru: 'Херес 🌿', zh: '雪利酒 🌿', ja: 'シェリー 🌿', ko: '셰리 🌿', ar: 'شيري 🌿', he: 'שרי 🌿', tr: 'Sherry 🌿', hu: 'Sherry 🌿', hi: 'शेरी 🌿' },
  'paraguayos': { en: 'Paraguayos 🍑', de: 'Paraguayos 🍑', es: 'Paraguayos 🍑', it: 'Paraguayo 🍑', fr: 'Paraguayos 🍑', pt: 'Paraguayos 🍑', nl: 'Paraguayos 🍑', sv: 'Paraguayos 🍑', da: 'Paraguayos 🍑', fi: 'Paraguayos 🍑', no: 'Paraguayos 🍑', ru: 'Парагвайосы 🍑', zh: '扁桃 🍑', ja: 'パラグアヨス 🍑', ko: '파라과요스 🍑', ar: 'پاراگوایوس 🍑', he: 'פראגוויוס 🍑', tr: 'Paraguayos 🍑', hu: 'Paraguayos 🍑', hi: 'पराग्वायोस 🍑' },
  'frambuesas': { en: 'Raspberries 🍓', de: 'Himbeeren 🍓', es: 'Frambuesas 🍓', it: 'Lamponi 🍓', fr: 'Framboises 🍓', pt: 'Framboesas 🍓', nl: 'Frambozen 🍓', sv: 'Hallon 🍓', da: 'Hindbær 🍓', fi: 'Vadelmat 🍓', no: 'Bringebær 🍓', ru: 'Малина 🍓', zh: '覆盆子 🍓', ja: 'ラズベリー 🍓', ko: '산딸기 🍓', ar: 'توت العليق 🍓', he: 'פטל 🍓', tr: 'Ahududu 🍓', hu: 'Málna 🍓', hi: 'रसभरी 🍓' },
  'arándanos': { en: 'Blueberries 🫐', de: 'Heidelbeeren 🫐', es: 'Arándanos 🫐', it: 'Mirtilli 🫐', fr: 'Myrtilles 🫐', pt: 'Mirtilos 🫐', nl: 'Bosbessen 🫐', sv: 'Blåbär 🫐', da: 'Blåbær 🫐', fi: 'Mustikkat 🫐', no: 'Blåbær 🫐', ru: 'Черника 🫐', zh: '蓝莓 🫐', ja: 'ブルーベリー 🫐', ko: '블루베리 🫐', ar: 'توت أزرق 🫐', he: 'אוכמניות 🫐', tr: 'Yaban mersini 🫐', hu: 'Áfonya 🫐', hi: 'नीलबदरी 🫐' },
  'grosellas': { en: 'Currants 🍓', de: 'Johannisbeeren 🍓', es: 'Grosellas 🍓', it: 'Ribes 🍓', fr: 'Groseilles 🍓', pt: 'Groselhas 🍓', nl: 'Bessen 🍓', sv: 'Vinbär 🍓', da: 'Ribs 🍓', fi: 'Herukka 🍓', no: 'Rips 🍓', ru: 'Смородина 🍓', zh: '醋栗 🍓', ja: 'カーラント 🍓', ko: '건포도 🍓', ar: 'كشمش 🍓', he: 'דומדמניות 🍓', tr: 'Frenk üzümü 🍓', hu: 'Ribizli 🍓', hi: 'करौंदा 🍓' },
  'brevas': { en: 'Early figs 🫐', de: 'Frühe Feigen 🫐', es: 'Brevas 🫐', it: 'Fichi primaticci 🫐', fr: 'Figues fleurs 🫐', pt: 'Figos lampos 🫐', nl: 'Vroege vijgen 🫐', sv: 'Tidiga fikon 🫐', da: 'Tidlige figner 🫐', fi: 'Varhaiset viikunat 🫐', no: 'Tidlig fiken 🫐', ru: 'Ранний инжир 🫐', zh: '早无花果 🫐', ja: '早いイチジク 🫐', ko: '이른 무화과 🫐', ar: 'تين مبكر 🫐', he: 'תאנים מוקדמות 🫐', tr: 'Erken incir 🫐', hu: 'Korai füge 🫐', hi: 'जल्दी अंजीर 🫐' },
  'chirimoyas': { en: 'Custard apples 🍈', de: 'Cherimoya 🍈', es: 'Chirimoyas 🍈', it: 'Cherimoya 🍈', fr: 'Chérimoles 🍈', pt: 'Cherimólia 🍈', nl: 'Cherimoya 🍈', sv: 'Cherimoya 🍈', da: 'Cherimoya 🍈', fi: 'Cherimoya 🍈', no: 'Cherimoya 🍈', ru: 'Черимойя 🍈', zh: '释迦果 🍈', ja: 'チェリモヤ 🍈', ko: '체리모야 🍈', ar: 'شيريمويا 🍈', he: 'צ\'רימויה 🍈', tr: 'Cherimoya 🍈', hu: 'Cherimoya 🍈', hi: 'चेरिमोया 🍈' },

  // Verduras adicionales
  'remolacha': { en: 'Beetroot 🌿', de: 'Rote Bete 🌿', es: 'Remolacha 🌿', it: 'Barbabietola 🌿', fr: 'Betterave 🌿', pt: 'Beterraba 🌿', nl: 'Rode biet 🌿', sv: 'Rödbeta 🌿', da: 'Rødbede 🌿', fi: 'Punajuuri 🌿', no: 'Rødbete 🌿', ru: 'Свекла 🌿', zh: '甜菜根 🌿', ja: 'ビートルート 🌿', ko: '비트 🌿', ar: 'شمندر 🌿', he: 'סלק 🌿', tr: 'Kırmızı pancar 🌿', hu: 'Cékla 🌿', hi: 'चुकंदर 🌿' },
  'nabos': { en: 'Turnips 🌿', de: 'Rüben 🌿', es: 'Nabos 🌿', it: 'Rape 🌿', fr: 'Navets 🌿', pt: 'Nabos 🌿', nl: 'Rapen 🌿', sv: 'Rova 🌿', da: 'Turnips 🌿', fi: 'Nauris 🌿', no: 'Nepe 🌿', ru: 'Репа 🌿', zh: '萝卜 🌿', ja: 'カブ 🌿', ko: '순무 🌿', ar: 'لفت 🌿', he: 'לפת 🌿', tr: 'Şalgam 🌿', hu: 'Fehérrépa 🌿', hi: 'शलगम 🌿' },
  'puerros': { en: 'Leeks 🌿', de: 'Lauch 🌿', es: 'Puerros 🌿', it: 'Porri 🌿', fr: 'Poireaux 🌿', pt: 'Alho-poró 🌿', nl: 'Prei 🌿', sv: 'Purjolök 🌿', da: 'Porrer 🌿', fi: 'Purjo 🌿', no: 'Purre 🌿', ru: 'Лук-порей 🌿', zh: '韭葱 🌿', ja: 'リーキ 🌿', ko: '리크 🌿', ar: 'كراث 🌿', he: 'כרישה 🌿', tr: 'Pırasa 🌿', hu: 'Póréhagyma 🌿', hi: 'लीक 🌿' },
  'rúcula': { en: 'Arugula 🌿', de: 'Rucola 🌿', es: 'Rúcula 🌿', it: 'Rucola 🌿', fr: 'Roquette 🌿', pt: 'Rúcula 🌿', nl: 'Rucola 🌿', sv: 'Ruccola 🌿', da: 'Rucola 🌿', fi: 'Sinappikaali 🌿', no: 'Ruccola 🌿', ru: 'Руккола 🌿', zh: '芝麻菜 🌿', ja: 'ルッコラ 🌿', ko: '루꼴라 🌿', ar: 'جرجير 🌿', he: 'רוקט 🌿', tr: 'Roka 🌿', hu: 'Rukkola 🌿', hi: 'रुकोला 🌿' },
  'canónigos': { en: 'Corn salad 🌿', de: 'Feldsalat 🌿', es: 'Canónigos 🌿', it: 'Valerianella 🌿', fr: 'Mâche 🌿', pt: 'Canónigos 🌿', nl: 'Veldsla 🌿', sv: 'Vårskön 🌿', da: 'Vårsalat 🌿', fi: 'Kasvinsalaatti 🌿', no: 'Vårsalat 🌿', ru: 'Валерьянелла 🌿', zh: '羊腿生菜 🌿', ja: 'コーンサラダ 🌿', ko: '양상추 🌿', ar: 'خس ذرة 🌿', he: 'חסת תירס 🌿', tr: 'Kuzu salatası 🌿', hu: 'Bárányzsalát 🌿', hi: 'मकई सलाद 🌿' },
  'berros': { en: 'Watercress 🌿', de: 'Brunnenkresse 🌿', es: 'Berros 🌿', it: 'Crescione 🌿', fr: 'Cresson 🌿', pt: 'Agrião 🌿', nl: 'Waterkers 🌿', sv: 'Källkrasse 🌿', da: 'Brøndkarse 🌿', fi: 'Isokrassi 🌿', no: 'Vannkarse 🌿', ru: 'Кресс-салат 🌿', zh: '水芹 🌿', ja: 'クレソン 🌿', ko: '물냉이 🌿', ar: 'جرجير مائي 🌿', he: 'גרגיר מים 🌿', tr: 'Su teresi 🌿', hu: 'Vízitorma 🌿', hi: 'पानी का तेज़ 🌿' },
  'endivias': { en: 'Endives 🌿', de: 'Endivien 🌿', es: 'Endivias 🌿', it: 'Indivia 🌿', fr: 'Endives 🌿', pt: 'Endívias 🌿', nl: 'Andijvie 🌿', sv: 'Endiv 🌿', da: 'Endivie 🌿', fi: 'Endiivi 🌿', no: 'Endivie 🌿', ru: 'Эндивий 🌿', zh: '菊苣 🌿', ja: 'エンダイブ 🌿', ko: '엔다이브 🌿', ar: 'هندباء 🌿', he: 'עולש 🌿', tr: 'Andiv 🌿', hu: 'Endivia 🌿', hi: 'एंडाइव 🌿' },
  'escarola': { en: 'Escarole 🌿', de: 'Eskariol 🌿', es: 'Escarola 🌿', it: 'Scarola 🌿', fr: 'Scarole 🌿', pt: 'Escarola 🌿', nl: 'Scariole 🌿', sv: 'Eskarol 🌿', da: 'Escarole 🌿', fi: 'Eskaroli 🌿', no: 'Eskarol 🌿', ru: 'Эскариоль 🌿', zh: '苦菊 🌿', ja: 'エスカロール 🌿', ko: '에스카롤 🌿', ar: 'اسكارول 🌿', he: 'אסקרול 🌿', tr: 'Eskarol 🌿', hu: 'Eszkariól 🌿', hi: 'एस्कैरोल 🌿' },
  'achicoria': { en: 'Chicory 🌿', de: 'Chicorée 🌿', es: 'Achicoria 🌿', it: 'Cicoria 🌿', fr: 'Chicorée 🌿', pt: 'Chicória 🌿', nl: 'Cichorei 🌿', sv: 'Cikoria 🌿', da: 'Cikorie 🌿', fi: 'Sikuri 🌿', no: 'Sikori 🌿', ru: 'Цикорий 🌿', zh: '菊苣 🌿', ja: 'チコリー 🌿', ko: '치커리 🌿', ar: 'هندباء برية 🌿', he: 'עלש 🌿', tr: 'Hindiba 🌿', hu: 'Cikória 🌿', hi: 'चिकोरी 🌿' },
  'radichio': { en: 'Radicchio 🌿', de: 'Radicchio 🌿', es: 'Radichio 🌿', it: 'Radicchio 🌿', fr: 'Radicchio 🌿', pt: 'Radicchio 🌿', nl: 'Radicchio 🌿', sv: 'Radicchio 🌿', da: 'Radicchio 🌿', fi: 'Radicchio 🌿', no: 'Radicchio 🌿', ru: 'Радиккио 🌿', zh: '紫菊苣 🌿', ja: 'ラディッキオ 🌿', ko: '라디치오 🌿', ar: 'راديكيو 🌿', he: 'רדיקיו 🌿', tr: 'Radicchio 🌿', hu: 'Radicchio 🌿', hi: 'रैडिकियो 🌿' },
  'alcachofas': { en: 'Artichokes 🌿', de: 'Artischocken 🌿', es: 'Alcachofas 🌿', it: 'Carciofi 🌿', fr: 'Artichauts 🌿', pt: 'Alcachofras 🌿', nl: 'Artisjokken 🌿', sv: 'Kronärtskockor 🌿', da: 'Artiskokker 🌿', fi: 'Artisokkaa 🌿', no: 'Artisjokker 🌿', ru: 'Артишоки 🌿', zh: '朝鲜蓟 🌿', ja: 'アーティチョーク 🌿', ko: '아티초크 🌿', ar: 'خرشوف 🌿', he: 'ארטישוק 🌿', tr: 'Enginar 🌿', hu: 'Articsóka 🌿', hi: 'आर्टिचोक 🌿' },
  'cardos': { en: 'Cardoons 🌿', de: 'Kardonen 🌿', es: 'Cardos 🌿', it: 'Cardi 🌿', fr: 'Cardes 🌿', pt: 'Cardos 🌿', nl: 'Kardon 🌿', sv: 'Kardoner 🌿', da: 'Kardoner 🌿', fi: 'Kardoni 🌿', no: 'Kardoner 🌿', ru: 'Кардон 🌿', zh: '刺菜蓟 🌿', ja: 'カルドン 🌿', ko: '카르돈 🌿', ar: 'قردون 🌿', he: 'קרדון 🌿', tr: 'Kardon 🌿', hu: 'Kardon 🌿', hi: 'कार्डून 🌿' },
  'hinojo': { en: 'Fennel 🌿', de: 'Fenchel 🌿', es: 'Hinojo 🌿', it: 'Finocchio 🌿', fr: 'Fenouil 🌿', pt: 'Funcho 🌿', nl: 'Venkel 🌿', sv: 'Fänkål 🌿', da: 'Fennikel 🌿', fi: 'Fenkoli 🌿', no: 'Fennikel 🌿', ru: 'Фенхель 🌿', zh: '茴香 🌿', ja: 'フェンネル 🌿', ko: '회향 🌿', ar: 'شمر 🌿', he: 'שומר 🌿', tr: 'Rezene 🌿', hu: 'Édeskömény 🌿', hi: 'सौंफ 🌿' },
  'chirivías': { en: 'Parsnips 🌿', de: 'Pastinaken 🌿', es: 'Chirivías 🌿', it: 'Pastinache 🌿', fr: 'Panais 🌿', pt: 'Cherovia 🌿', nl: 'Pastinaak 🌿', sv: 'Palsternacka 🌿', da: 'Pastinak 🌿', fi: 'Palsternakka 🌿', no: 'Pastinakk 🌿', ru: 'Пастернак 🌿', zh: '欧防风 🌿', ja: 'パースニップ 🌿', ko: '파스닙 🌿', ar: 'جزر أبيض 🌿', he: 'גזר לבן 🌿', tr: 'Yaban havucu 🌿', hu: 'Pasztinák 🌿', hi: 'चीरविया 🌿' },
  'apionabos': { en: 'Celeriac 🌿', de: 'Knollensellerie 🌿', es: 'Apionabos 🌿', it: 'Sedano rapa 🌿', fr: 'Céleri-rave 🌿', pt: 'Aipo-rábano 🌿', nl: 'Knolselderij 🌿', sv: 'Rotselleri 🌿', da: 'Knoldselleri 🌿', fi: 'Juuriselleri 🌿', no: 'Rotselleri 🌿', ru: 'Сельдерей корневой 🌿', zh: '芹菜根 🌿', ja: 'セロリアック 🌿', ko: '셀러리악 🌿', ar: 'كرفس جذري 🌿', he: 'כרפס שורש 🌿', tr: 'Kereviz kökü 🌿', hu: 'Gumós zeller 🌿', hi: 'सेलेरिक 🌿' },
  'colinabos': { en: 'Kohlrabi 🌿', de: 'Kohlrabi 🌿', es: 'Colinabos 🌿', it: 'Cavolo rapa 🌿', fr: 'Chou-rave 🌿', pt: 'Couve-rábano 🌿', nl: 'Koolrabi 🌿', sv: 'Kålrabbi 🌿', da: 'Kålrabi 🌿', fi: 'Kyssäkaali 🌿', no: 'Kålrabi 🌿', ru: 'Кольраби 🌿', zh: '苤蓝 🌿', ja: 'コールラビ 🌿', ko: '콜라비 🌿', ar: 'كرنب لفتي 🌿', he: 'כרוב לפת 🌿', tr: 'Lahana şalgamı 🌿', hu: 'Karalábé 🌿', hi: 'कोलराबी 🌿' },

  // LEGUMBRES Y GRANOS
  'lentejas': { en: 'Lentils 🌿', de: 'Linsen 🌿', es: 'Lentejas 🌿', it: 'Lenticchie 🌿', fr: 'Lentilles 🌿', pt: 'Lentilhas 🌿', nl: 'Linzen 🌿', sv: 'Linser 🌿', da: 'Linser 🌿', fi: 'Linssit 🌿', no: 'Linser 🌿', ru: 'Чечевица 🌿', zh: '扁豆 🌿', ja: 'レンズ豆 🌿', ko: '렌틸콩 🌿', ar: 'عدس 🌿', he: 'עדשים 🌿', tr: 'Mercimek 🌿', hu: 'Lencse 🌿', hi: 'मसूर 🌿' },
  'garbanzos': { en: 'Chickpeas 🌿', de: 'Kichererbsen 🌿', es: 'Garbanzos 🌿', it: 'Ceci 🌿', fr: 'Pois chiches 🌿', pt: 'Grão-de-bico 🌿', nl: 'Kikkererwten 🌿', sv: 'Kikärtor 🌿', da: 'Kikærter 🌿', fi: 'Kikherneet 🌿', no: 'Kikerter 🌿', ru: 'Нут 🌿', zh: '鹰嘴豆 🌿', ja: 'ひよこ豆 🌿', ko: '병아리콩 🌿', ar: 'حمص 🌿', he: 'חומוס 🌿', tr: 'Nohut 🌿', hu: 'Csicseriborsó 🌿', hi: 'चना 🌿' },
  'judías': { en: 'Beans 🌿', de: 'Bohnen 🌿', es: 'Judías 🌿', it: 'Fagioli 🌿', fr: 'Haricots 🌿', pt: 'Feijão 🌿', nl: 'Bonen 🌿', sv: 'Bönor 🌿', da: 'Bønner 🌿', fi: 'Pavut 🌿', no: 'Bønner 🌿', ru: 'Фасоль 🌿', zh: '豆子 🌿', ja: '豆 🌿', ko: '콩 🌿', ar: 'فاصولياء 🌿', he: 'שעועית 🌿', tr: 'Fasulye 🌿', hu: 'Bab 🌿', hi: 'सेम 🌿' },
  'habas': { en: 'Broad beans 🌿', de: 'Dicke Bohnen 🌿', es: 'Habas 🌿', it: 'Fave 🌿', fr: 'Fèves 🌿', pt: 'Favas 🌿', nl: 'Tuinbonen 🌿', sv: 'Bondböner 🌿', da: 'Hestebønner 🌿', fi: 'Härkäpavut 🌿', no: 'Hestebønner 🌿', ru: 'Бобы 🌿', zh: '蚕豆 🌿', ja: 'そら豆 🌿', ko: '누에콩 🌿', ar: 'فول 🌿', he: 'פול 🌿', tr: 'Bakla 🌿', hu: 'Lóbab 🌿', hi: 'बकला 🌿' },
  'guisantes': { en: 'Peas 🟢', de: 'Erbsen 🟢', es: 'Guisantes 🟢', it: 'Piselli 🟢', fr: 'Petits pois 🟢', pt: 'Ervilhas 🟢', nl: 'Erwten 🟢', sv: 'Ärtor 🟢', da: 'Ærter 🟢', fi: 'Herneet 🟢', no: 'Erter 🟢', ru: 'Горох 🟢', zh: '豌豆 🟢', ja: 'えんどう豆 🟢', ko: '완두콩 🟢', ar: 'بازلاء 🟢', he: 'אפונה 🟢', tr: 'Bezelye 🟢', hu: 'Borsó 🟢', hi: 'मटर 🟢' },
  'soja': { en: 'Soybeans 🌿', de: 'Sojabohnen 🌿', es: 'Soja 🌿', it: 'Soia 🌿', fr: 'Soja 🌿', pt: 'Soja 🌿', nl: 'Sojabonen 🌿', sv: 'Sojabönor 🌿', da: 'Sojabønner 🌿', fi: 'Soijapavut 🌿', no: 'Soyabønner 🌿', ru: 'Соя 🌿', zh: '大豆 🌿', ja: '大豆 🌿', ko: '대두 🌿', ar: 'فول الصويا 🌿', he: 'סויה 🌿', tr: 'Soya fasulyesi 🌿', hu: 'Szójabab 🌿', hi: 'सोयाबीन 🌿' },
  'edamame': { en: 'Edamame 🌿', de: 'Edamame 🌿', es: 'Edamame 🌿', it: 'Edamame 🌿', fr: 'Edamame 🌿', pt: 'Edamame 🌿', nl: 'Edamame 🌿', sv: 'Edamame 🌿', da: 'Edamame 🌿', fi: 'Edamame 🌿', no: 'Edamame 🌿', ru: 'Эдамаме 🌿', zh: '毛豆 🌿', ja: '枝豆 🌿', ko: '에다마메 🌿', ar: 'إيداماميه 🌿', he: 'אדממה 🌿', tr: 'Edamame 🌿', hu: 'Edamame 🌿', hi: 'एडामामे 🌿' },

  // HIERBAS Y ESPECIAS
  'perejil': { en: 'Parsley 🌿', de: 'Petersilie 🌿', es: 'Perejil 🌿', it: 'Prezzemolo 🌿', fr: 'Persil 🌿', pt: 'Salsa 🌿', nl: 'Peterselie 🌿', sv: 'Persilja 🌿', da: 'Persille 🌿', fi: 'Persilja 🌿', no: 'Persille 🌿', ru: 'Петрушка 🌿', zh: '欧芹 🌿', ja: 'パセリ 🌿', ko: '파슬리 🌿', ar: 'بقدونس 🌿', he: 'פטרוזיליה 🌿', tr: 'Maydanoz 🌿', hu: 'Petrezselyem 🌿', hi: 'अजमोद 🌿' },
  'cilantro': { en: 'Cilantro 🌿', de: 'Koriander 🌿', es: 'Cilantro 🌿', it: 'Coriandolo 🌿', fr: 'Coriandre 🌿', pt: 'Coentro 🌿', nl: 'Koriander 🌿', sv: 'Koriander 🌿', da: 'Koriander 🌿', fi: 'Korianteri 🌿', no: 'Koriander 🌿', ru: 'Кинза 🌿', zh: '香菜 🌿', ja: 'コリアンダー 🌿', ko: '고수 🌿', ar: 'كزبرة 🌿', he: 'כוסברה 🌿', tr: 'Kişniş 🌿', hu: 'Koriander 🌿', hi: 'धनिया 🌿' },
  'albahaca': { en: 'Basil 🌿', de: 'Basilikum 🌿', es: 'Albahaca 🌿', it: 'Basilico 🌿', fr: 'Basilic 🌿', pt: 'Manjericão 🌿', nl: 'Basilicum 🌿', sv: 'Basilika 🌿', da: 'Basilikum 🌿', fi: 'Basilika 🌿', no: 'Basilikum 🌿', ru: 'Базилик 🌿', zh: '罗勒 🌿', ja: 'バジル 🌿', ko: '바질 🌿', ar: 'ريحان 🌿', he: 'בזיליקום 🌿', tr: 'Fesleğen 🌿', hu: 'Bazsalikom 🌿', hi: 'तुलसी 🌿' },
  'orégano': { en: 'Oregano 🌿', de: 'Oregano 🌿', es: 'Orégano 🌿', it: 'Origano 🌿', fr: 'Origan 🌿', pt: 'Orégãos 🌿', nl: 'Oregano 🌿', sv: 'Oregano 🌿', da: 'Oregano 🌿', fi: 'Oregano 🌿', no: 'Oregano 🌿', ru: 'Орегано 🌿', zh: '牛至 🌿', ja: 'オレガノ 🌿', ko: '오레가노 🌿', ar: 'أوريجانو 🌿', he: 'אורגנו 🌿', tr: 'Kekik 🌿', hu: 'Oregánó 🌿', hi: 'अजवायन की पत्ती 🌿' },
  'tomillo': { en: 'Thyme 🌿', de: 'Thymian 🌿', es: 'Tomillo 🌿', it: 'Timo 🌿', fr: 'Thym 🌿', pt: 'Tomilho 🌿', nl: 'Tijm 🌿', sv: 'Timjan 🌿', da: 'Timian 🌿', fi: 'Timjami 🌿', no: 'Timian 🌿', ru: 'Тимьян 🌿', zh: '百里香 🌿', ja: 'タイム 🌿', ko: '타임 🌿', ar: 'زعتر 🌿', he: 'קורנית 🌿', tr: 'Kekik otu 🌿', hu: 'Kakukkfű 🌿', hi: 'अजवायन 🌿' },
  'romero': { en: 'Rosemary 🌿', de: 'Rosmarin 🌿', es: 'Romero 🌿', it: 'Rosmarino 🌿', fr: 'Romarin 🌿', pt: 'Alecrim 🌿', nl: 'Rozemarijn 🌿', sv: 'Rosmarin 🌿', da: 'Rosmarin 🌿', fi: 'Rosmariini 🌿', no: 'Rosmarin 🌿', ru: 'Розмарин 🌿', zh: '迷迭香 🌿', ja: 'ローズマリー 🌿', ko: '로즈마리 🌿', ar: 'إكليل الجبل 🌿', he: 'רוזמרין 🌿', tr: 'Biberiye 🌿', hu: 'Rozmaring 🌿', hi: 'रोजमेरी 🌿' },
  'salvia': { en: 'Sage 🌿', de: 'Salbei 🌿', es: 'Salvia 🌿', it: 'Salvia 🌿', fr: 'Sauge 🌿', pt: 'Sálvia 🌿', nl: 'Salie 🌿', sv: 'Salvia 🌿', da: 'Salvie 🌿', fi: 'Salvia 🌿', no: 'Salvie 🌿', ru: 'Шалфей 🌿', zh: '鼠尾草 🌿', ja: 'セージ 🌿', ko: '세이지 🌿', ar: 'ميرمية 🌿', he: 'מרווה 🌿', tr: 'Adaçayı 🌿', hu: 'Zsálya 🌿', hi: 'सेज 🌿' },
  'eneldo': { en: 'Dill 🌿', de: 'Dill 🌿', es: 'Eneldo 🌿', it: 'Aneto 🌿', fr: 'Aneth 🌿', pt: 'Endro 🌿', nl: 'Dille 🌿', sv: 'Dill 🌿', da: 'Dild 🌿', fi: 'Tilli 🌿', no: 'Dill 🌿', ru: 'Укроп 🌿', zh: '莳萝 🌿', ja: 'ディル 🌿', ko: '딜 🌿', ar: 'شبت 🌿', he: 'שמיר 🌿', tr: 'Dereotu 🌿', hu: 'Kapor 🌿', hi: 'सोआ 🌿' },
  'menta': { en: 'Mint 🌿', de: 'Minze 🌿', es: 'Menta 🌿', it: 'Menta 🌿', fr: 'Menthe 🌿', pt: 'Hortelã 🌿', nl: 'Munt 🌿', sv: 'Mynta 🌿', da: 'Mynte 🌿', fi: 'Minttu 🌿', no: 'Mynte 🌿', ru: 'Мята 🌿', zh: '薄荷 🌿', ja: 'ミント 🌿', ko: '민트 🌿', ar: 'نعناع 🌿', he: 'נענע 🌿', tr: 'Nane 🌿', hu: 'Menta 🌿', hi: 'पुदीना 🌿' },
  'laurel': { en: 'Bay leaves 🌿', de: 'Lorbeerblätter 🌿', es: 'Laurel 🌿', it: 'Alloro 🌿', fr: 'Laurier 🌿', pt: 'Louro 🌿', nl: 'Laurier 🌿', sv: 'Lagerblad 🌿', da: 'Laurbærblad 🌿', fi: 'Laakerinlehti 🌿', no: 'Laurbærblad 🌿', ru: 'Лавровый лист 🌿', zh: '月桂叶 🌿', ja: 'ローリエ 🌿', ko: '월계수 잎 🌿', ar: 'ورق الغار 🌿', he: 'עלי דפנה 🌿', tr: 'Defne yaprağı 🌿', hu: 'Babérlevél 🌿', hi: 'तेज पत्ता 🌿' },
  'estragón': { en: 'Tarragon 🌿', de: 'Estragon 🌿', es: 'Estragón 🌿', it: 'Dragoncello 🌿', fr: 'Estragon 🌿', pt: 'Estragão 🌿', nl: 'Dragon 🌿', sv: 'Dragon 🌿', da: 'Estragon 🌿', fi: 'Rakuuna 🌿', no: 'Estragon 🌿', ru: 'Эстрагон 🌿', zh: '龙蒿 🌿', ja: 'タラゴン 🌿', ko: '타라곤 🌿', ar: 'طرخون 🌿', he: 'טרגון 🌿', tr: 'Tarhun 🌿', hu: 'Tárkony 🌿', hi: 'तारागोन 🌿' },

  // CARNES Y EMBUTIDOS
  'jamón': { en: 'Ham 🍖', de: 'Schinken 🍖', es: 'Jamón 🍖', it: 'Prosciutto 🍖', fr: 'Jambon 🍖', pt: 'Presunto 🍖', nl: 'Ham 🍖', sv: 'Skinka 🍖', da: 'Skinke 🍖', fi: 'Kinkku 🍖', no: 'Skinke 🍖', ru: 'Ветчина 🍖', zh: '火腿 🍖', ja: 'ハム 🍖', ko: '햄 🍖', ar: 'لحم خنزير 🍖', he: 'חזיר 🍖', tr: 'Jambon 🍖', hu: 'Sonka 🍖', hi: 'हैम 🍖' },
  'chorizo': { en: 'Chorizo 🌶️', de: 'Chorizo 🌶️', es: 'Chorizo 🌶️', it: 'Chorizo 🌶️', fr: 'Chorizo 🌶️', pt: 'Chouriço 🌶️', nl: 'Chorizo 🌶️', sv: 'Chorizo 🌶️', da: 'Chorizo 🌶️', fi: 'Chorizo 🌶️', no: 'Chorizo 🌶️', ru: 'Чоризо 🌶️', zh: '西班牙香肠 🌶️', ja: 'チョリソー 🌶️', ko: '초리조 🌶️', ar: 'تشوريزو 🌶️', he: 'צ\'וריזו 🌶️', tr: 'Chorizo 🌶️', hu: 'Chorizo 🌶️', hi: 'चोरिज़ो 🌶️' },
  'morcilla': { en: 'Blood sausage 🍖', de: 'Blutwurst 🍖', es: 'Morcilla 🍖', it: 'Sanguinaccio 🍖', fr: 'Boudin noir 🍖', pt: 'Morcela 🍖', nl: 'Bloedworst 🍖', sv: 'Blodkorv 🍖', da: 'Blodpølse 🍖', fi: 'Mustamakkara 🍖', no: 'Blodpølse 🍖', ru: 'Кровяная колбаса 🍖', zh: '血肠 🍖', ja: 'ブラッドソーセージ 🍖', ko: '순대 🍖', ar: 'نقانق الدم 🍖', he: 'נקניקיית דם 🍖', tr: 'Kan sucuğu 🍖', hu: 'Véres hurka 🍖', hi: 'खून सॉसेज 🍖' },
  'salchichón': { en: 'Salami 🍖', de: 'Salami 🍖', es: 'Salchichón 🍖', it: 'Salame 🍖', fr: 'Saucisson 🍖', pt: 'Salpicão 🍖', nl: 'Salami 🍖', sv: 'Salami 🍖', da: 'Salami 🍖', fi: 'Salami 🍖', no: 'Salami 🍖', ru: 'Салями 🍖', zh: '萨拉米 🍖', ja: 'サラミ 🍖', ko: '살라미 🍖', ar: 'سلامي 🍖', he: 'סלמי 🍖', tr: 'Salam 🍖', hu: 'Szalámi 🍖', hi: 'सलामी 🍖' },
  'lomo': { en: 'Loin 🍖', de: 'Lende 🍖', es: 'Lomo 🍖', it: 'Lonza 🍖', fr: 'Longe 🍖', pt: 'Lombo 🍖', nl: 'Lende 🍖', sv: 'Rygg 🍖', da: 'Ryg 🍖', fi: 'Selkä 🍖', no: 'Rygg 🍖', ru: 'Филей 🍖', zh: '里脊 🍖', ja: 'ロース 🍖', ko: '등심 🍖', ar: 'متن 🍖', he: 'חלציים 🍖', tr: 'Bel 🍖', hu: 'Karaj 🍖', hi: 'कमर 🍖' },
  'panceta': { en: 'Bacon 🥓', de: 'Speck 🥓', es: 'Panceta 🥓', it: 'Pancetta 🥓', fr: 'Lard 🥓', pt: 'Toucinho 🥓', nl: 'Spek 🥓', sv: 'Bacon 🥓', da: 'Bacon 🥓', fi: 'Pekoni 🥓', no: 'Bacon 🥓', ru: 'Бекон 🥓', zh: '培根 🥓', ja: 'ベーコン 🥓', ko: '베이컨 🥓', ar: 'لحم مقدد 🥓', he: 'בייקון 🥓', tr: 'Pastırma 🥓', hu: 'Szalonna 🥓', hi: 'बेकन 🥓' },
  'cecina': { en: 'Cured beef 🍖', de: 'Gepökeltes Rindfleisch 🍖', es: 'Cecina 🍖', it: 'Bresaola 🍖', fr: 'Viande séchée 🍖', pt: 'Carne seca 🍖', nl: 'Gedroogd vlees 🍖', sv: 'Torkat kött 🍖', da: 'Tørret kød 🍖', fi: 'Kuivattu liha 🍖', no: 'Tørket kjøtt 🍖', ru: 'Вяленая говядина 🍖', zh: '风干牛肉 🍖', ja: '干し肉 🍖', ko: '말린 고기 🍖', ar: 'لحم مجفف 🍖', he: 'בשר מיובש 🍖', tr: 'Kurutulmuş et 🍖', hu: 'Szárított hús 🍖', hi: 'सूखा मांस 🍖' },

  // PRODUCTOS LÁCTEOS ADICIONALES
  'requesón': { en: 'Cottage cheese 🧀', de: 'Hüttenkäse 🧀', es: 'Requesón 🧀', it: 'Ricotta 🧀', fr: 'Fromage blanc 🧀', pt: 'Requeijão 🧀', nl: 'Hüttenkäse 🧀', sv: 'Keso 🧀', da: 'Hytteost 🧀', fi: 'Raejuusto 🧀', no: 'Kesam 🧀', ru: 'Творог 🧀', zh: '白干酪 🧀', ja: 'カッテージチーズ 🧀', ko: '코티지 치즈 🧀', ar: 'جبن قريش 🧀', he: 'גבינת קוטג\' 🧀', tr: 'Lor peyniri 🧀', hu: 'Túró 🧀', hi: 'कॉटेज चीज़ 🧀' },
  'cuajada': { en: 'Curd 🧀', de: 'Quark 🧀', es: 'Cuajada 🧀', it: 'Cagliata 🧀', fr: 'Caillé 🧀', pt: 'Coalhada 🧀', nl: 'Wrongel 🧀', sv: 'Filmjölk 🧀', da: 'Kærnemælk 🧀', fi: 'Hyytelö 🧀', no: 'Rømme 🧀', ru: 'Творожная масса 🧀', zh: '凝乳 🧀', ja: 'カード 🧀', ko: '응유 🧀', ar: 'خثارة 🧀', he: 'גבינה רכה 🧀', tr: 'Keş 🧀', hu: 'Alvadék 🧀', hi: 'दही 🧀' },
  'natillas': { en: 'Custard 🍮', de: 'Pudding 🍮', es: 'Natillas 🍮', it: 'Crema pasticcera 🍮', fr: 'Crème anglaise 🍮', pt: 'Natinha 🍮', nl: 'Vla 🍮', sv: 'Gräddfil 🍮', da: 'Budding 🍮', fi: 'Vanukas 🍮', no: 'Fløtepudding 🍮', ru: 'Заварной крем 🍮', zh: '蛋奶糊 🍮', ja: 'カスタード 🍮', ko: '커스터드 🍮', ar: 'مهلبية 🍮', he: 'קרם 🍮', tr: 'Muhallebi 🍮', hu: 'Tejpuding 🍮', hi: 'कस्टर्ड 🍮' },
  'flan': { en: 'Flan 🍮', de: 'Karamellpudding 🍮', es: 'Flan 🍮', it: 'Crème caramel 🍮', fr: 'Crème caramel 🍮', pt: 'Pudim 🍮', nl: 'Flan 🍮', sv: 'Karamellpudding 🍮', da: 'Karamelpudding 🍮', fi: 'Karamellipuding 🍮', no: 'Karamellpudding 🍮', ru: 'Флан 🍮', zh: '焦糖布丁 🍮', ja: 'フラン 🍮', ko: '플란 🍮', ar: 'فلان 🍮', he: 'פלאן 🍮', tr: 'Karamel krema 🍮', hu: 'Flan 🍮', hi: 'फ्लान 🍮' },
  'alubias': { en: 'White beans 🌿', de: 'Weiße Bohnen 🌿', es: 'Alubias 🌿', it: 'Fagioli bianchi 🌿', fr: 'Haricots blancs 🌿', pt: 'Feijão branco 🌿', nl: 'Witte bonen 🌿', sv: 'Vita bönor 🌿', da: 'Hvide bønner 🌿', fi: 'Valkoiset pavut 🌿', no: 'Hvite bønner 🌿', ru: 'Белая фасоль 🌿', zh: '白豆 🌿', ja: '白インゲン豆 🌿', ko: '흰강낭콩 🌿', ar: 'فاصولياء بيضاء 🌿', he: 'שעועית לבנה 🌿', tr: 'Beyaz fasulye 🌿', hu: 'Fehér bab 🌿', hi: 'सफेद सेम 🌿' },
  'judías pintas': { en: 'Pinto beans 🌿', de: 'Pintobohnen 🌿', es: 'Judías pintas 🌿', it: 'Fagioli borlotti 🌿', fr: 'Haricots tachetés 🌿', pt: 'Feijão pintado 🌿', nl: 'Bonte bonen 🌿', sv: 'Spräckliga bönor 🌿', da: 'Plettede bønner 🌿', fi: 'Kirjopavut 🌿', no: 'Flekkete bønner 🌿', ru: 'Пятнистая фасоль 🌿', zh: '花豆 🌿', ja: 'うずら豆 🌿', ko: '얼룩콩 🌿', ar: 'فاصولياء منقطة 🌿', he: 'שעועית מנומרת 🌿', tr: 'Benekli fasulye 🌿', hu: 'Tarkabab 🌿', hi: 'चित्तीदार सेम 🌿' },
  'frijoles': { en: 'Beans 🌿', de: 'Bohnen 🌿', es: 'Frijoles 🌿', it: 'Fagioli 🌿', fr: 'Haricots 🌿', pt: 'Feijões 🌿', nl: 'Bonen 🌿', sv: 'Bönor 🌿', da: 'Bønner 🌿', fi: 'Pavut 🌿', no: 'Bønner 🌿', ru: 'Фасоль 🌿', zh: '豆子 🌿', ja: '豆 🌿', ko: '콩 🌿', ar: 'فاصولياء 🌿', he: 'שעועית 🌿', tr: 'Fasulye 🌿', hu: 'Bab 🌿', hi: 'सेम 🌿' },
  'azukis': { en: 'Adzuki beans 🌿', de: 'Adzukibohnen 🌿', es: 'Azukis 🌿', it: 'Fagioli azuki 🌿', fr: 'Haricots azuki 🌿', pt: 'Feijão azuki 🌿', nl: 'Azukibonen 🌿', sv: 'Azukibönor 🌿', da: 'Azukibønner 🌿', fi: 'Azukipavut 🌿', no: 'Azukibønner 🌿', ru: 'Фасоль адзуки 🌿', zh: '红豆 🌿', ja: '小豆 🌿', ko: '팥 🌿', ar: 'فاصولياء أدزوكي 🌿', he: 'שעועית אדזוקי 🌿', tr: 'Azuki fasulyesi 🌿', hu: 'Azuki bab 🌿', hi: 'अज़ुकी सेम 🌿' },

  // CEREALES Y GRANOS ADICIONALES
  'avena': { en: 'Oats 🌾', de: 'Hafer 🌾', es: 'Avena 🌾', it: 'Avena 🌾', fr: 'Avoine 🌾', pt: 'Aveia 🌾', nl: 'Haver 🌾', sv: 'Havre 🌾', da: 'Havre 🌾', fi: 'Kaura 🌾', no: 'Havre 🌾', ru: 'Овёс 🌾', zh: '燕麦 🌾', ja: 'オーツ麦 🌾', ko: '귀리 🌾', ar: 'الشوفان 🌾', he: 'שיבולת שועל 🌾', tr: 'Yulaf 🌾', hu: 'Zab 🌾', hi: 'जई 🌾' },
  'trigo': { en: 'Wheat 🌾', de: 'Weizen 🌾', es: 'Trigo 🌾', it: 'Grano 🌾', fr: 'Blé 🌾', pt: 'Trigo 🌾', nl: 'Tarwe 🌾', sv: 'Vete 🌾', da: 'Hvede 🌾', fi: 'Vehnä 🌾', no: 'Hvete 🌾', ru: 'Пшеница 🌾', zh: '小麦 🌾', ja: '小麦 🌾', ko: '밀 🌾', ar: 'قمح 🌾', he: 'חיטה 🌾', tr: 'Buğday 🌾', hu: 'Búza 🌾', hi: 'गेहूं 🌾' },
  'centeno': { en: 'Rye 🌾', de: 'Roggen 🌾', es: 'Centeno 🌾', it: 'Segale 🌾', fr: 'Seigle 🌾', pt: 'Centeio 🌾', nl: 'Rogge 🌾', sv: 'Råg 🌾', da: 'Rug 🌾', fi: 'Ruis 🌾', no: 'Rug 🌾', ru: 'Рожь 🌾', zh: '黑麦 🌾', ja: 'ライ麦 🌾', ko: '호밀 🌾', ar: 'الجاودار 🌾', he: 'שיפון 🌾', tr: 'Çavdar 🌾', hu: 'Rozs 🌾', hi: 'राई 🌾' },
  'espelta': { en: 'Spelt 🌾', de: 'Dinkel 🌾', es: 'Espelta 🌾', it: 'Farro 🌾', fr: 'Épeautre 🌾', pt: 'Espelta 🌾', nl: 'Spelt 🌾', sv: 'Spelt 🌾', da: 'Spelt 🌾', fi: 'Speltti 🌾', no: 'Spelt 🌾', ru: 'Полба 🌾', zh: '斯佩尔特小麦 🌾', ja: 'スペルト小麦 🌾', ko: '스펠트 🌾', ar: 'حنطة اسبلت 🌾', he: 'כוסמין 🌾', tr: 'Karabuğday 🌾', hu: 'Tönkölybúza 🌾', hi: 'स्पेल्ट 🌾' },
  'mijo': { en: 'Millet 🌾', de: 'Hirse 🌾', es: 'Mijo 🌾', it: 'Miglio 🌾', fr: 'Millet 🌾', pt: 'Painço 🌾', nl: 'Gierst 🌾', sv: 'Hirs 🌾', da: 'Hirse 🌾', fi: 'Hirssi 🌾', no: 'Hirse 🌾', ru: 'Просо 🌾', zh: '小米 🌾', ja: 'キビ 🌾', ko: '기장 🌾', ar: 'الدخن 🌾', he: 'דוחן 🌾', tr: 'Darı 🌾', hu: 'Köles 🌾', hi: 'बाजरा 🌾' },
  'alforfón': { en: 'Buckwheat 🌾', de: 'Buchweizen 🌾', es: 'Alforfón 🌾', it: 'Grano saraceno 🌾', fr: 'Sarrasin 🌾', pt: 'Trigo mourisco 🌾', nl: 'Boekweit 🌾', sv: 'Bovete 🌾', da: 'Boghvede 🌾', fi: 'Tattari 🌾', no: 'Bokhvete 🌾', ru: 'Гречиха 🌾', zh: '荞麦 🌾', ja: 'そば 🌾', ko: '메밀 🌾', ar: 'الحنطة السوداء 🌾', he: 'כוסמת 🌾', tr: 'Karabuğday 🌾', hu: 'Hajdina 🌾', hi: 'कुट्टू 🌾' },
  'amaranto': { en: 'Amaranth 🌾', de: 'Amarant 🌾', es: 'Amaranto 🌾', it: 'Amaranto 🌾', fr: 'Amarante 🌾', pt: 'Amaranto 🌾', nl: 'Amarant 🌾', sv: 'Amarant 🌾', da: 'Amarant 🌾', fi: 'Amarantti 🌾', no: 'Amarant 🌾', ru: 'Амарант 🌾', zh: '苋菜 🌾', ja: 'アマランサス 🌾', ko: '아마란스 🌾', ar: 'القطيفة 🌾', he: 'ירבוז 🌾', tr: 'Amarant 🌾', hu: 'Amaránt 🌾', hi: 'चौलाई 🌾' },
  'teff': { en: 'Teff 🌾', de: 'Teff 🌾', es: 'Teff 🌾', it: 'Teff 🌾', fr: 'Teff 🌾', pt: 'Teff 🌾', nl: 'Teff 🌾', sv: 'Teff 🌾', da: 'Teff 🌾', fi: 'Teff 🌾', no: 'Teff 🌾', ru: 'Тефф 🌾', zh: '苔麸 🌾', ja: 'テフ 🌾', ko: '테프 🌾', ar: 'التيف 🌾', he: 'טף 🌾', tr: 'Teff 🌾', hu: 'Teff 🌾', hi: 'तेफ 🌾' },

  // VERDURAS DE HOJA VERDE ADICIONALES
  'acelgas': { en: 'Swiss chard 🌿', de: 'Mangold 🌿', es: 'Acelgas 🌿', it: 'Bietole 🌿', fr: 'Blettes 🌿', pt: 'Acelgas 🌿', nl: 'Snijbiet 🌿', sv: 'Mangold 🌿', da: 'Bladbede 🌿', fi: 'Lehtijuurikas 🌿', no: 'Bladbete 🌿', ru: 'Мангольд 🌿', zh: '甜菜叶 🌿', ja: 'フダンソウ 🌿', ko: '근대 🌿', ar: 'السلق 🌿', he: 'תרד 🌿', tr: 'Pazı 🌿', hu: 'Mángold 🌿', hi: 'पालक चुकंदर 🌿' },
  'grelos': { en: 'Turnip greens 🌿', de: 'Steckrübenblätter 🌿', es: 'Grelos 🌿', it: 'Cime di rapa 🌿', fr: 'Fanes de navet 🌿', pt: 'Grelos 🌿', nl: 'Raapstelen 🌿', sv: 'Rovablad 🌿', da: 'Majroeblad 🌿', fi: 'Nauriinlehdet 🌿', no: 'Nepeblad 🌿', ru: 'Листья репы 🌿', zh: '萝卜叶 🌿', ja: 'カブの葉 🌿', ko: '순무잎 🌿', ar: 'أوراق اللفت 🌿', he: 'עלי לפת 🌿', tr: 'Şalgam yaprağı 🌿', hu: 'Fehérrépa levelek 🌿', hi: 'शलगम के पत्ते 🌿' },
  'berza': { en: 'Collard greens 🌿', de: 'Blätterkohl 🌿', es: 'Berza 🌿', it: 'Cavolo nero 🌿', fr: 'Chou cavalier 🌿', pt: 'Couve galega 🌿', nl: 'Palmkool 🌿', sv: 'Grönkål 🌿', da: 'Grønkål 🌿', fi: 'Lehtikaali 🌿', no: 'Grønnkål 🌿', ru: 'Листовая капуста 🌿', zh: '羽衣甘蓝 🌿', ja: 'コラードグリーン 🌿', ko: '콜라드 그린 🌿', ar: 'الكرنب الأخضر 🌿', he: 'כרוב עלים 🌿', tr: 'Yaprak lahana 🌿', hu: 'Leveles káposzta 🌿', hi: 'कोलार्ड ग्रीन्स 🌿' },
  'mostaza': { en: 'Mustard greens 🌿', de: 'Senfblätter 🌿', es: 'Mostaza 🌿', it: 'Senape 🌿', fr: 'Feuilles de moutarde 🌿', pt: 'Mostarda 🌿', nl: 'Mosterdbladeren 🌿', sv: 'Senapsblad 🌿', da: 'Sennepsblad 🌿', fi: 'Sinapinlehdet 🌿', no: 'Sennepsblad 🌿', ru: 'Листья горчицы 🌿', zh: '芥菜叶 🌿', ja: 'からし菜 🌿', ko: '겨자잎 🌿', ar: 'أوراق الخردل 🌿', he: 'עלי חרדל 🌿', tr: 'Hardal yaprağı 🌿', hu: 'Mustárlevél 🌿', hi: 'सरसों के पत्ते 🌿' },
  'diente de león': { en: 'Dandelion 🌿', de: 'Löwenzahn 🌿', es: 'Diente de león 🌿', it: 'Tarassaco 🌿', fr: 'Pissenlit 🌿', pt: 'Dente-de-leão 🌿', nl: 'Paardenbloem 🌿', sv: 'Maskros 🌿', da: 'Mælkebøtte 🌿', fi: 'Voikukka 🌿', no: 'Løvetann 🌿', ru: 'Одуванчик 🌿', zh: '蒲公英 🌿', ja: 'タンポポ 🌿', ko: '민들레 🌿', ar: 'الهندباء البرية 🌿', he: 'שן הארי 🌿', tr: 'Karahindiba 🌿', hu: 'Pitypang 🌿', hi: 'सिंहपर्णी 🌿' },

  // TUBÉRCULOS Y RAÍCES ADICIONALES
  'boniato': { en: 'Sweet potato 🍠', de: 'Süßkartoffel 🍠', es: 'Boniato 🍠', it: 'Patata dolce 🍠', fr: 'Patate douce 🍠', pt: 'Batata-doce 🍠', nl: 'Zoete aardappel 🍠', sv: 'Sötpotatis 🍠', da: 'Sød kartoffel 🍠', fi: 'Bataatti 🍠', no: 'Søtpotet 🍠', ru: 'Батат 🍠', zh: '红薯 🍠', ja: 'サツマイモ 🍠', ko: '고구마 🍠', ar: 'البطاطا الحلوة 🍠', he: 'בטטה 🍠', tr: 'Tatlı patates 🍠', hu: 'Édesburgonya 🍠', hi: 'शकरकंद 🍠' },
  'ñame': { en: 'Yam 🍠', de: 'Yamswurzel 🍠', es: 'Ñame 🍠', it: 'Igname 🍠', fr: 'Igname 🍠', pt: 'Inhame 🍠', nl: 'Yam 🍠', sv: 'Yam 🍠', da: 'Yam 🍠', fi: 'Jamssi 🍠', no: 'Yam 🍠', ru: 'Ямс 🍠', zh: '山药 🍠', ja: 'ヤム芋 🍠', ko: '참마 🍠', ar: 'القلقاس 🍠', he: 'ילקוט 🍠', tr: 'Yam 🍠', hu: 'Jamsgumó 🍠', hi: 'यम 🍠' },
  'mandioca': { en: 'Cassava 🌿', de: 'Maniok 🌿', es: 'Mandioca 🌿', it: 'Manioca 🌿', fr: 'Manioc 🌿', pt: 'Mandioca 🌿', nl: 'Cassave 🌿', sv: 'Kassava 🌿', da: 'Kassava 🌿', fi: 'Kassava 🌿', no: 'Kassava 🌿', ru: 'Маниока 🌿', zh: '木薯 🌿', ja: 'キャッサバ 🌿', ko: '카사바 🌿', ar: 'الكسافا 🌿', he: 'קסבה 🌿', tr: 'Kassava 🌿', hu: 'Maniók 🌿', hi: 'कसावा 🌿' },
  'taro': { en: 'Taro 🌿', de: 'Taro 🌿', es: 'Taro 🌿', it: 'Taro 🌿', fr: 'Taro 🌿', pt: 'Taro 🌿', nl: 'Taro 🌿', sv: 'Taro 🌿', da: 'Taro 🌿', fi: 'Taro 🌿', no: 'Taro 🌿', ru: 'Таро 🌿', zh: '芋头 🌿', ja: 'タロイモ 🌿', ko: '토란 🌿', ar: 'القلقاس 🌿', he: 'טארו 🌿', tr: 'Taro 🌿', hu: 'Taró 🌿', hi: 'अरबी 🌿' },
  'malanga': { en: 'Malanga 🌿', de: 'Malanga 🌿', es: 'Malanga 🌿', it: 'Malanga 🌿', fr: 'Malanga 🌿', pt: 'Malanga 🌿', nl: 'Malanga 🌿', sv: 'Malanga 🌿', da: 'Malanga 🌿', fi: 'Malanga 🌿', no: 'Malanga 🌿', ru: 'Маланга 🌿', zh: '马兰加 🌿', ja: 'マランガ 🌿', ko: '말랑가 🌿', ar: 'المالانجا 🌿', he: 'מלנגה 🌿', tr: 'Malanga 🌿', hu: 'Malanga 🌿', hi: 'मलंगा 🌿' },

  // FRUTAS EXÓTICAS Y TROPICALES
  'mango': { en: 'Mango 🥭', de: 'Mango 🥭', es: 'Mango 🥭', it: 'Mango 🥭', fr: 'Mangue 🥭', pt: 'Manga 🥭', nl: 'Mango 🥭', sv: 'Mango 🥭', da: 'Mango 🥭', fi: 'Mango 🥭', no: 'Mango 🥭', ru: 'Манго 🥭', zh: '芒果 🥭', ja: 'マンゴー 🥭', ko: '망고 🥭', ar: 'مانجو 🥭', he: 'מנגו 🥭', tr: 'Mango 🥭', hu: 'Mangó 🥭', hi: 'आम 🥭' },
  'papaya': { en: 'Papaya 🧡', de: 'Papaya 🧡', es: 'Papaya 🧡', it: 'Papaya 🧡', fr: 'Papaye 🧡', pt: 'Papaia 🧡', nl: 'Papaja 🧡', sv: 'Papaya 🧡', da: 'Papaya 🧡', fi: 'Papaija 🧡', no: 'Papaya 🧡', ru: 'Папайя 🧡', zh: '木瓜 🧡', ja: 'パパイヤ 🧡', ko: '파파야 🧡', ar: 'البابايا 🧡', he: 'פפאיה 🧡', tr: 'Papaya 🧡', hu: 'Papaja 🧡', hi: 'पपीता 🧡' },
  'maracuyá': { en: 'Passion fruit 💜', de: 'Passionsfrucht 💜', es: 'Maracuyá 💜', it: 'Frutto della passione 💜', fr: 'Fruit de la passion 💜', pt: 'Maracujá 💜', nl: 'Passievrucht 💜', sv: 'Passionsfrukt 💜', da: 'Passionsfrugt 💜', fi: 'Passiohedelmä 💜', no: 'Pasjonsfrukt 💜', ru: 'Маракуйя 💜', zh: '百香果 💜', ja: 'パッションフルーツ 💜', ko: '패션후르츠 💜', ar: 'فاكهة العاطفة 💜', he: 'פסיפלורה 💜', tr: 'Çarkıfelek meyvesi 💜', hu: 'Golgotavirág gyümölcse 💜', hi: 'पैशन फ्रूट 💜' },
  'guayaba': { en: 'Guava 🟢', de: 'Guave 🟢', es: 'Guayaba 🟢', it: 'Guava 🟢', fr: 'Goyave 🟢', pt: 'Goiaba 🟢', nl: 'Guave 🟢', sv: 'Guava 🟢', da: 'Guava 🟢', fi: 'Guaava 🟢', no: 'Guava 🟢', ru: 'Гуава 🟢', zh: '番石榴 🟢', ja: 'グアバ 🟢', ko: '구아바 🟢', ar: 'الجوافة 🟢', he: 'גויאבה 🟢', tr: 'Guava 🟢', hu: 'Guava 🟢', hi: 'अमरूद 🟢' },
  'pitaya': { en: 'Dragon fruit 🐉', de: 'Drachenfrucht 🐉', es: 'Pitaya 🐉', it: 'Pitaya 🐉', fr: 'Pitaya 🐉', pt: 'Pitaia 🐉', nl: 'Drakenvrucht 🐉', sv: 'Drakfrukt 🐉', da: 'Drage frugt 🐉', fi: 'Lohikäärmehedelmä 🐉', no: 'Drakefrukt 🐉', ru: 'Питайя 🐉', zh: '火龙果 🐉', ja: 'ドラゴンフルーツ 🐉', ko: '용과 🐉', ar: 'فاكهة التنين 🐉', he: 'פרי הדרקון 🐉', tr: 'Ejder meyvesi 🐉', hu: 'Sárkánygyümölcs 🐉', hi: 'ड्रैगन फ्रूट 🐉' },
  'rambután': { en: 'Rambutan 🔴', de: 'Rambutan 🔴', es: 'Rambután 🔴', it: 'Rambutan 🔴', fr: 'Ramboutan 🔴', pt: 'Rambutan 🔴', nl: 'Rambutan 🔴', sv: 'Rambutan 🔴', da: 'Rambutan 🔴', fi: 'Rambutan 🔴', no: 'Rambutan 🔴', ru: 'Рамбутан 🔴', zh: '红毛丹 🔴', ja: 'ランブータン 🔴', ko: '람부탄 🔴', ar: 'الرامبوتان 🔴', he: 'רמבוטן 🔴', tr: 'Rambutan 🔴', hu: 'Rambutan 🔴', hi: 'रैम्बूटन 🔴' },
  'lichi': { en: 'Lychee 🍇', de: 'Litschi 🍇', es: 'Lichi 🍇', it: 'Litchi 🍇', fr: 'Litchi 🍇', pt: 'Lichia 🍇', nl: 'Lychee 🍇', sv: 'Lychee 🍇', da: 'Lychee 🍇', fi: 'Lychee 🍇', no: 'Lychee 🍇', ru: 'Личи 🍇', zh: '荔枝 🍇', ja: 'ライチ 🍇', ko: '리치 🍇', ar: 'ليتشي 🍇', he: 'ליצ\'י 🍇', tr: 'Liçi 🍇', hu: 'Licsi 🍇', hi: 'लीची 🍇' },
  'longan': { en: 'Longan 🍇', de: 'Longan 🍇', es: 'Longan 🍇', it: 'Longan 🍇', fr: 'Longan 🍇', pt: 'Longan 🍇', nl: 'Longan 🍇', sv: 'Longan 🍇', da: 'Longan 🍇', fi: 'Longan 🍇', no: 'Longan 🍇', ru: 'Лонган 🍇', zh: '龙眼 🍇', ja: 'ロンガン 🍇', ko: '롱간 🍇', ar: 'لونجان 🍇', he: 'לונגן 🍇', tr: 'Longan 🍇', hu: 'Longan 🍇', hi: 'लोंगन 🍇' },
  'carambola': { en: 'Star fruit 🌟', de: 'Sternfrucht 🌟', es: 'Carambola 🌟', it: 'Carambola 🌟', fr: 'Carambole 🌟', pt: 'Carambola 🌟', nl: 'Stervrucht 🌟', sv: 'Stjärnfrukt 🌟', da: 'Stjernefrugt 🌟', fi: 'Tähtihedelmä 🌟', no: 'Stjernefrukt 🌟', ru: 'Карамбола 🌟', zh: '杨桃 🌟', ja: 'スターフルーツ 🌟', ko: '스타프루트 🌟', ar: 'فاكهة النجمة 🌟', he: 'פרי כוכב 🌟', tr: 'Yıldız meyvesi 🌟', hu: 'Csillaggyümölcs 🌟', hi: 'स्टार फ्रूट 🌟' },
  'feijoa': { en: 'Feijoa 🥝', de: 'Feijoa 🥝', es: 'Feijoa 🥝', it: 'Feijoa 🥝', fr: 'Feijoa 🥝', pt: 'Feijoa 🥝', nl: 'Feijoa 🥝', sv: 'Feijoa 🥝', da: 'Feijoa 🥝', fi: 'Feijoa 🥝', no: 'Feijoa 🥝', ru: 'Фейхоа 🥝', zh: '费约果 🥝', ja: 'フェイジョア 🥝', ko: '페이조아 🥝', ar: 'فيجوا 🥝', he: 'פיג\'ואה 🥝', tr: 'Feijoa 🥝', hu: 'Feijoa 🥝', hi: 'फेजोआ 🥝' },
  'cacao': { en: 'Cacao 🍫', de: 'Kakao 🍫', es: 'Cacao 🍫', it: 'Cacao 🍫', fr: 'Cacao 🍫', pt: 'Cacau 🍫', nl: 'Cacao 🍫', sv: 'Kakao 🍫', da: 'Kakao 🍫', fi: 'Kaakao 🍫', no: 'Kakao 🍫', ru: 'Какао 🍫', zh: '可可 🍫', ja: 'カカオ 🍫', ko: '카카오 🍫', ar: 'كاكاو 🍫', he: 'קקאו 🍫', tr: 'Kakao 🍫', hu: 'Kakaó 🍫', hi: 'कोको 🍫' },
  'café': { en: 'Coffee ☕', de: 'Kaffee ☕', es: 'Café ☕', it: 'Caffè ☕', fr: 'Café ☕', pt: 'Café ☕', nl: 'Koffie ☕', sv: 'Kaffe ☕', da: 'Kaffe ☕', fi: 'Kahvi ☕', no: 'Kaffe ☕', ru: 'Кофе ☕', zh: '咖啡 ☕', ja: 'コーヒー ☕', ko: '커피 ☕', ar: 'قهوة ☕', he: 'קפה ☕', tr: 'Kahve ☕', hu: 'Kávé ☕', hi: 'कॉफ़ी ☕' },

  // VERDURAS MEDITERRÁNEAS Y DE TEMPORADA
  'berenjenas': { en: 'Eggplants 🍆', de: 'Auberginen 🍆', es: 'Berenjenas 🍆', it: 'Melanzane 🍆', fr: 'Aubergines 🍆', pt: 'Berinjelas 🍆', nl: 'Aubergines 🍆', sv: 'Auberginer 🍆', da: 'Auberginer 🍆', fi: 'Munakoisot 🍆', no: 'Auberginer 🍆', ru: 'Баклажаны 🍆', zh: '茄子 🍆', ja: 'ナス 🍆', ko: '가지 🍆', ar: 'باذنجان 🍆', he: 'חצילים 🍆', tr: 'Patlıcan 🍆', hu: 'Padlizsán 🍆', hi: 'बैंगन 🍆' },
  'calabacines': { en: 'Zucchini 🥒', de: 'Zucchini 🥒', es: 'Calabacines 🥒', it: 'Zucchine 🥒', fr: 'Courgettes 🥒', pt: 'Abobrinhas 🥒', nl: 'Courgettes 🥒', sv: 'Zucchini 🥒', da: 'Squash 🥒', fi: 'Kesäkurpitsa 🥒', no: 'Squash 🥒', ru: 'Кабачки 🥒', zh: '西葫芦 🥒', ja: 'ズッキーニ 🥒', ko: '주키니 🥒', ar: 'كوسة 🥒', he: 'קישואים 🥒', tr: 'Kabak 🥒', hu: 'Cukkini 🥒', hi: 'तोरी 🥒' },
  'calabaza': { en: 'Pumpkin 🎃', de: 'Kürbis 🎃', es: 'Calabaza 🎃', it: 'Zucca 🎃', fr: 'Courge 🎃', pt: 'Abóbora 🎃', nl: 'Pompoen 🎃', sv: 'Pumpa 🎃', da: 'Græskar 🎃', fi: 'Kurpitsa 🎃', no: 'Gresskar 🎃', ru: 'Тыква 🎃', zh: '南瓜 🎃', ja: 'カボチャ 🎃', ko: '호박 🎃', ar: 'يقطين 🎃', he: 'דלעת 🎃', tr: 'Balkabağı 🎃', hu: 'Tök 🎃', hi: 'कद्दू 🎃' },
  'pimientos': { en: 'Peppers 🌶️', de: 'Paprika 🌶️', es: 'Pimientos 🌶️', it: 'Peperoni 🌶️', fr: 'Poivrons 🌶️', pt: 'Pimentões 🌶️', nl: 'Paprika 🌶️', sv: 'Paprika 🌶️', da: 'Peberfrugt 🌶️', fi: 'Paprika 🌶️', no: 'Paprika 🌶️', ru: 'Перцы 🌶️', zh: '辣椒 🌶️', ja: 'ピーマン 🌶️', ko: '피망 🌶️', ar: 'فلفل 🌶️', he: 'פלפלים 🌶️', tr: 'Biber 🌶️', hu: 'Paprika 🌶️', hi: 'शिमला मिर्च 🌶️' },
  'tomates': { en: 'Tomatoes 🍅', de: 'Tomaten 🍅', es: 'Tomates 🍅', it: 'Pomodori 🍅', fr: 'Tomates 🍅', pt: 'Tomates 🍅', nl: 'Tomaten 🍅', sv: 'Tomater 🍅', da: 'Tomater 🍅', fi: 'Tomaatit 🍅', no: 'Tomater 🍅', ru: 'Помидоры 🍅', zh: '番茄 🍅', ja: 'トマト 🍅', ko: '토마토 🍅', ar: 'طماطم 🍅', he: 'עגבניות 🍅', tr: 'Domates 🍅', hu: 'Paradicsom 🍅', hi: 'टमाटर 🍅' },
  'pepinos': { en: 'Cucumbers 🥒', de: 'Gurken 🥒', es: 'Pepinos 🥒', it: 'Cetrioli 🥒', fr: 'Concombres 🥒', pt: 'Pepinos 🥒', nl: 'Komkommers 🥒', sv: 'Gurkor 🥒', da: 'Agurker 🥒', fi: 'Kurkut 🥒', no: 'Agurker 🥒', ru: 'Огурцы 🥒', zh: '黄瓜 🥒', ja: 'キュウリ 🥒', ko: '오이 🥒', ar: 'خيار 🥒', he: 'מלפפונים 🥒', tr: 'Salatalık 🥒', hu: 'Uborka 🥒', hi: 'खीरा 🥒' },
  'soja': { en: 'Soybeans 🌿', de: 'Sojabohnen 🌿', es: 'Soja 🌿', it: 'Soia 🌿', fr: 'Soja 🌿', pt: 'Soja 🌿', nl: 'Sojabonen 🌿', sv: 'Sojabönor 🌿', da: 'Sojabønner 🌿', fi: 'Soijapavut 🌿', no: 'Soyabønner 🌿', ru: 'Соевые бобы 🌿', zh: '大豆 🌿', ja: '大豆 🌿', ko: '대두 🌿', ar: 'فول الصويا 🌿', he: 'סויה 🌿', tr: 'Soya fasulyesi 🌿', hu: 'Szójabab 🌿', hi: 'सोयाबीन 🌿' },
  'quinoa': { en: 'Quinoa 🌾', de: 'Quinoa 🌾', es: 'Quinoa 🌾', it: 'Quinoa 🌾', fr: 'Quinoa 🌾', pt: 'Quinoa 🌾', nl: 'Quinoa 🌾', sv: 'Quinoa 🌾', da: 'Quinoa 🌾', fi: 'Kvinoa 🌾', no: 'Quinoa 🌾', ru: 'Киноа 🌾', zh: '藜麦 🌾', ja: 'キヌア 🌾', ko: '퀴노아 🌾', ar: 'كينوا 🌾', he: 'קינואה 🌾', tr: 'Kinoa 🌾', hu: 'Quinoa 🌾', hi: 'क्विनोआ 🌾' },
  'guisantes': { en: 'Peas 🟢', de: 'Erbsen 🟢', es: 'Guisantes 🟢', it: 'Piselli 🟢', fr: 'Petits pois 🟢', pt: 'Ervilhas 🟢', nl: 'Erwten 🟢', sv: 'Ärtor 🟢', da: 'Ærter 🟢', fi: 'Herneet 🟢', no: 'Erter 🟢', ru: 'Горошек 🟢', zh: '豌豆 🟢', ja: 'グリーンピース 🟢', ko: '완두콩 🟢', ar: 'بازلاء 🟢', he: 'אפונה 🟢', tr: 'Bezelye 🟢', hu: 'Zöldborsó 🟢', hi: 'मटर 🟢' },
  'habas': { en: 'Broad beans 🌿', de: 'Dicke Bohnen 🌿', es: 'Habas 🌿', it: 'Fave 🌿', fr: 'Fèves 🌿', pt: 'Favas 🌿', nl: 'Tuinbonen 🌿', sv: 'Bondböna 🌿', da: 'Hestebønner 🌿', fi: 'Härkäpavut 🌿', no: 'Hestefava 🌿', ru: 'Бобы 🌿', zh: '蚕豆 🌿', ja: 'そら豆 🌿', ko: '누에콩 🌿', ar: 'فول 🌿', he: 'פול 🌿', tr: 'Bakla 🌿', hu: 'Lóbab 🌿', hi: 'सेम 🌿' },

  // VERDURAS ADICIONALES PARA DIETA
  'apio': { en: 'Celery 🌿', de: 'Sellerie 🌿', es: 'Apio 🌿', it: 'Sedano 🌿', fr: 'Céleri 🌿', pt: 'Aipo 🌿', nl: 'Selderij 🌿', sv: 'Selleri 🌿', da: 'Selleri 🌿', fi: 'Selleri 🌿', no: 'Selleri 🌿', ru: 'Сельдерей 🌿', zh: '芹菜 🌿', ja: 'セロリ 🌿', ko: '셀러리 🌿', ar: 'كرفس 🌿', he: 'כרפס 🌿', tr: 'Kereviz 🌿', hu: 'Zeller 🌿', hi: 'अजवाइन 🌿' },
  'rabanitos': { en: 'Radishes 🌿', de: 'Radieschen 🌿', es: 'Rabanitos 🌿', it: 'Ravanelli 🌿', fr: 'Radis 🌿', pt: 'Rabanetes 🌿', nl: 'Radijsjes 🌿', sv: 'Rädisor 🌿', da: 'Radiser 🌿', fi: 'Retiisit 🌿', no: 'Reddiker 🌿', ru: 'Редиска 🌿', zh: '小萝卜 🌿', ja: 'ラディッシュ 🌿', ko: '무 🌿', ar: 'فجل 🌿', he: 'צנונית 🌿', tr: 'Turp 🌿', hu: 'Retek 🌿', hi: 'मूली 🌿' },
  'lechugas': { en: 'Lettuce 🥬', de: 'Salat 🥬', es: 'Lechugas 🥬', it: 'Lattughe 🥬', fr: 'Laitues 🥬', pt: 'Alfaces 🥬', nl: 'Sla 🥬', sv: 'Sallad 🥬', da: 'Salat 🥬', fi: 'Salaatti 🥬', no: 'Salat 🥬', ru: 'Салат 🥬', zh: '生菜 🥬', ja: 'レタス 🥬', ko: '상추 🥬', ar: 'خس 🥬', he: 'חסה 🥬', tr: 'Marul 🥬', hu: 'Saláta 🥬', hi: 'सलाद पत्ता 🥬' },
  'coles': { en: 'Cabbage 🥬', de: 'Kohl 🥬', es: 'Coles 🥬', it: 'Cavoli 🥬', fr: 'Choux 🥬', pt: 'Couves 🥬', nl: 'Kool 🥬', sv: 'Kål 🥬', da: 'Kål 🥬', fi: 'Kaali 🥬', no: 'Kål 🥬', ru: 'Капуста 🥬', zh: '卷心菜 🥬', ja: 'キャベツ 🥬', ko: '양배추 🥬', ar: 'ملفوف 🥬', he: 'כרוב 🥬', tr: 'Lahana 🥬', hu: 'Káposzta 🥬', hi: 'पत्तागोभी 🥬' },
  'zanahorias': { en: 'Carrots 🥕', de: 'Karotten 🥕', es: 'Zanahorias 🥕', it: 'Carote 🥕', fr: 'Carottes 🥕', pt: 'Cenouras 🥕', nl: 'Wortels 🥕', sv: 'Morötter 🥕', da: 'Gulerødder 🥕', fi: 'Porkkanat 🥕', no: 'Gulrøtter 🥕', ru: 'Морковь 🥕', zh: '胡萝卜 🥕', ja: '人参 🥕', ko: '당근 🥕', ar: 'جزر 🥕', he: 'גזר 🥕', tr: 'Havuç 🥕', hu: 'Sárgarépa 🥕', hi: 'गाजर 🥕' },
  'patatas': { en: 'Potatoes 🥔', de: 'Kartoffeln 🥔', es: 'Patatas 🥔', it: 'Patate 🥔', fr: 'Pommes de terre 🥔', pt: 'Batatas 🥔', nl: 'Aardappels 🥔', sv: 'Potatis 🥔', da: 'Kartofler 🥔', fi: 'Perunat 🥔', no: 'Poteter 🥔', ru: 'Картофель 🥔', zh: '土豆 🥔', ja: 'ジャガイモ 🥔', ko: '감자 🥔', ar: 'بطاطس 🥔', he: 'תפוחי אדמה 🥔', tr: 'Patates 🥔', hu: 'Burgonya 🥔', hi: 'आलू 🥔' },
  'cebollas': { en: 'Onions 🧅', de: 'Zwiebeln 🧅', es: 'Cebollas 🧅', it: 'Cipolle 🧅', fr: 'Oignons 🧅', pt: 'Cebolas 🧅', nl: 'Uien 🧅', sv: 'Lökar 🧅', da: 'Løg 🧅', fi: 'Sipulit 🧅', no: 'Løk 🧅', ru: 'Лук 🧅', zh: '洋葱 🧅', ja: '玉ねぎ 🧅', ko: '양파 🧅', ar: 'بصل 🧅', he: 'בצל 🧅', tr: 'Soğan 🧅', hu: 'Hagyma 🧅', hi: 'प्याज 🧅' },
  'ajos': { en: 'Garlic 🧄', de: 'Knoblauch 🧄', es: 'Ajos 🧄', it: 'Aglio 🧄', fr: 'Ail 🧄', pt: 'Alhos 🧄', nl: 'Knoflook 🧄', sv: 'Vitlök 🧄', da: 'Hvidløg 🧄', fi: 'Valkosipuli 🧄', no: 'Hvitløk 🧄', ru: 'Чеснок 🧄', zh: '大蒜 🧄', ja: 'ニンニク 🧄', ko: '마늘 🧄', ar: 'ثوم 🧄', he: 'שום 🧄', tr: 'Sarımsak 🧄', hu: 'Fokhagyma 🧄', hi: 'लहसुन 🧄' },

  // FRUTAS PARA DIETA Y TEMPORADA
  'manzanas': { en: 'Apples 🍎', de: 'Äpfel 🍎', es: 'Manzanas 🍎', it: 'Mele 🍎', fr: 'Pommes 🍎', pt: 'Maçãs 🍎', nl: 'Appels 🍎', sv: 'Äpplen 🍎', da: 'Æbler 🍎', fi: 'Omenat 🍎', no: 'Epler 🍎', ru: 'Яблоки 🍎', zh: '苹果 🍎', ja: 'りんご 🍎', ko: '사과 🍎', ar: 'تفاح 🍎', he: 'תפוחים 🍎', tr: 'Elma 🍎', hu: 'Alma 🍎', hi: 'सेब 🍎' },
  'peras': { en: 'Pears 🍐', de: 'Birnen 🍐', es: 'Peras 🍐', it: 'Pere 🍐', fr: 'Poires 🍐', pt: 'Pêras 🍐', nl: 'Peren 🍐', sv: 'Päron 🍐', da: 'Pærer 🍐', fi: 'Päärynät 🍐', no: 'Pærer 🍐', ru: 'Груши 🍐', zh: '梨 🍐', ja: '洋梨 🍐', ko: '배 🍐', ar: 'كمثرى 🍐', he: 'אגסים 🍐', tr: 'Armut 🍐', hu: 'Körte 🍐', hi: 'नाशपाती 🍐' },
  'plátanos': { en: 'Bananas 🍌', de: 'Bananen 🍌', es: 'Plátanos 🍌', it: 'Banane 🍌', fr: 'Bananes 🍌', pt: 'Bananas 🍌', nl: 'Bananen 🍌', sv: 'Bananer 🍌', da: 'Bananer 🍌', fi: 'Banaanit 🍌', no: 'Bananer 🍌', ru: 'Бананы 🍌', zh: '香蕉 🍌', ja: 'バナナ 🍌', ko: '바나나 🍌', ar: 'موز 🍌', he: 'בננות 🍌', tr: 'Muz 🍌', hu: 'Banán 🍌', hi: 'केला 🍌' },
  'naranjás': { en: 'Oranges 🍊', de: 'Orangen 🍊', es: 'Naranjas 🍊', it: 'Arance 🍊', fr: 'Oranges 🍊', pt: 'Laranjas 🍊', nl: 'Sinaasappels 🍊', sv: 'Apelsiner 🍊', da: 'Appelsiner 🍊', fi: 'Appelsiinit 🍊', no: 'Appelsiner 🍊', ru: 'Апельсины 🍊', zh: '橙子 🍊', ja: 'オレンジ 🍊', ko: '오렌지 🍊', ar: 'برتقال 🍊', he: 'תפוזים 🍊', tr: 'Portakal 🍊', hu: 'Narancs 🍊', hi: 'संतरा 🍊' },
  'limones': { en: 'Lemons 🍋', de: 'Zitronen 🍋', es: 'Limones 🍋', it: 'Limoni 🍋', fr: 'Citrons 🍋', pt: 'Limões 🍋', nl: 'Citroenen 🍋', sv: 'Citroner 🍋', da: 'Citroner 🍋', fi: 'Sitruunat 🍋', no: 'Sitroner 🍋', ru: 'Лимоны 🍋', zh: '柠檬 🍋', ja: 'レモン 🍋', ko: '레몬 🍋', ar: 'ليمون 🍋', he: 'לימונים 🍋', tr: 'Limon 🍋', hu: 'Citrom 🍋', hi: 'नींबू 🍋' },
  'fresas': { en: 'Strawberries 🍓', de: 'Erdbeeren 🍓', es: 'Fresas 🍓', it: 'Fragole 🍓', fr: 'Fraises 🍓', pt: 'Morangos 🍓', nl: 'Aardbeien 🍓', sv: 'Jordgubbar 🍓', da: 'Jordbær 🍓', fi: 'Mansikat 🍓', no: 'Jordbær 🍓', ru: 'Клубника 🍓', zh: '草莓 🍓', ja: 'いちご 🍓', ko: '딸기 🍓', ar: 'فراولة 🍓', he: 'תותים 🍓', tr: 'Çilek 🍓', hu: 'Eper 🍓', hi: 'स्ट्रॉबेरी 🍓' },
  'uvas': { en: 'Grapes 🍇', de: 'Trauben 🍇', es: 'Uvas 🍇', it: 'Uva 🍇', fr: 'Raisins 🍇', pt: 'Uvas 🍇', nl: 'Druiven 🍇', sv: 'Druvor 🍇', da: 'Druer 🍇', fi: 'Viinirypäleet 🍇', no: 'Druer 🍇', ru: 'Виноград 🍇', zh: '葡萄 🍇', ja: 'ぶどう 🍇', ko: '포도 🍇', ar: 'عنب 🍇', he: 'ענבים 🍇', tr: 'Üzüm 🍇', hu: 'Szőlő 🍇', hi: 'अंगूर 🍇' },
  'kiwis': { en: 'Kiwis 🥝', de: 'Kiwis 🥝', es: 'Kiwis 🥝', it: 'Kiwi 🥝', fr: 'Kiwis 🥝', pt: 'Kiwis 🥝', nl: 'Kiwi 🥝', sv: 'Kiwi 🥝', da: 'Kiwi 🥝', fi: 'Kiivit 🥝', no: 'Kiwi 🥝', ru: 'Киви 🥝', zh: '猕猴桃 🥝', ja: 'キウイ 🥝', ko: '키위 🥝', ar: 'كيوي 🥝', he: 'קיווי 🥝', tr: 'Kivi 🥝', hu: 'Kivi 🥝', hi: 'कीवी 🥝' },
  'edamame': { en: 'Edamame 🌿', de: 'Edamame 🌿', es: 'Edamame 🌿', it: 'Edamame 🌿', fr: 'Edamame 🌿', pt: 'Edamame 🌿', nl: 'Edamame 🌿', sv: 'Edamame 🌿', da: 'Edamame 🌿', fi: 'Edamame 🌿', no: 'Edamame 🌿', ru: 'Эдамаме 🌿', zh: '毛豆 🌿', ja: '枝豆 🌿', ko: '에다마메 🌿', ar: 'إيداماميه 🌿', he: 'אדמאמה 🌿', tr: 'Edamame 🌿', hu: 'Edamame 🌿', hi: 'एडामेम 🌿' },
  'tirabeques': { en: 'Sugar snap peas 🌿', de: 'Zuckerschoten 🌿', es: 'Tirabeques 🌿', it: 'Piselli mangiatutto 🌿', fr: 'Pois mange-tout 🌿', pt: 'Ervilhas tortas 🌿', nl: 'Sugarsnaps 🌿', sv: 'Sockerärtor 🌿', da: 'Sukkerærter 🌿', fi: 'Sokeriherneet 🌿', no: 'Sukkerter 🌿', ru: 'Сахарный горошек 🌿', zh: '荷兰豆 🌿', ja: 'スナップエンドウ 🌿', ko: '스냅완두 🌿', ar: 'بازلاء حلوة 🌿', he: 'אפונה מתוקה 🌿', tr: 'Şeker bezelyesi 🌿', hu: 'Cukorborsó 🌿', hi: 'चीनी मटर 🌿' },

  // PRODUCTOS FINALES ESENCIALES
  'melón': { en: 'Melon 🍈', de: 'Melone 🍈', es: 'Melón 🍈', it: 'Melone 🍈', fr: 'Melon 🍈', pt: 'Melão 🍈', nl: 'Meloen 🍈', sv: 'Melon 🍈', da: 'Melon 🍈', fi: 'Meloni 🍈', no: 'Melon 🍈', ru: 'Дыня 🍈', zh: '甜瓜 🍈', ja: 'メロン 🍈', ko: '멜론 🍈', ar: 'شمام 🍈', he: 'מלון 🍈', tr: 'Kavun 🍈', hu: 'Dinnye 🍈', hi: 'खरबूजा 🍈' },
  'sandía': { en: 'Watermelon 🍉', de: 'Wassermelone 🍉', es: 'Sandía 🍉', it: 'Anguria 🍉', fr: 'Pastèque 🍉', pt: 'Melancia 🍉', nl: 'Watermeloen 🍉', sv: 'Vattenmelon 🍉', da: 'Vandmelon 🍉', fi: 'Vesimeloni 🍉', no: 'Vannmelon 🍉', ru: 'Арбуз 🍉', zh: '西瓜 🍉', ja: 'スイカ 🍉', ko: '수박 🍉', ar: 'بطيخ 🍉', he: 'אבטיח 🍉', tr: 'Karpuz 🍉', hu: 'Görögdinnye 🍉', hi: 'तरबूज 🍉' },
  'jengibre': { en: 'Ginger 🫚', de: 'Ingwer 🫚', es: 'Jengibre 🫚', it: 'Zenzero 🫚', fr: 'Gingembre 🫚', pt: 'Gengibre 🫚', nl: 'Gember 🫚', sv: 'Ingefära 🫚', da: 'Ingefær 🫚', fi: 'Inkivääri 🫚', no: 'Ingefær 🫚', ru: 'Имбирь 🫚', zh: '生姜 🫚', ja: '生姜 🫚', ko: '생강 🫚', ar: 'زنجبيل 🫚', he: 'זנגביל 🫚', tr: 'Zencefil 🫚', hu: 'Gyömbér 🫚', hi: 'अदरक 🫚' },
  'cúrcuma': { en: 'Turmeric 🟡', de: 'Kurkuma 🟡', es: 'Cúrcuma 🟡', it: 'Curcuma 🟡', fr: 'Curcuma 🟡', pt: 'Açafrão 🟡', nl: 'Kurkuma 🟡', sv: 'Gurkmeja 🟡', da: 'Gurkemeje 🟡', fi: 'Kurkuma 🟡', no: 'Gurkemeie 🟡', ru: 'Куркума 🟡', zh: '姜黄 🟡', ja: 'ターメリック 🟡', ko: '강황 🟡', ar: 'كركم 🟡', he: 'כורכום 🟡', tr: 'Zerdeçal 🟡', hu: 'Kurkuma 🟡', hi: 'हल्दी 🟡' },
  'aguacates': { en: 'Avocados 🥑', de: 'Avocados 🥑', es: 'Aguacates 🥑', it: 'Avocado 🥑', fr: 'Avocats 🥑', pt: 'Abacates 🥑', nl: 'Avocado 🥑', sv: 'Avokado 🥑', da: 'Avocado 🥑', fi: 'Avokado 🥑', no: 'Avokado 🥑', ru: 'Авокадо 🥑', zh: '牛油果 🥑', ja: 'アボカド 🥑', ko: '아보카도 🥑', ar: 'أفوكادو 🥑', he: 'אבוקדו 🥑', tr: 'Avokado 🥑', hu: 'Avokádó 🥑', hi: 'एवोकाडो 🥑' },
  'nueces': { en: 'Walnuts 🌰', de: 'Walnüsse 🌰', es: 'Nueces 🌰', it: 'Noci 🌰', fr: 'Noix 🌰', pt: 'Nozes 🌰', nl: 'Walnoten 🌰', sv: 'Valnötter 🌰', da: 'Valnødder 🌰', fi: 'Saksanpähkinät 🌰', no: 'Valnøtter 🌰', ru: 'Грецкие орехи 🌰', zh: '核桃 🌰', ja: 'クルミ 🌰', ko: '호두 🌰', ar: 'جوز 🌰', he: 'אגוזי מלך 🌰', tr: 'Ceviz 🌰', hu: 'Dió 🌰', hi: 'अखरोट 🌰' },
  'almendras': { en: 'Almonds 🌰', de: 'Mandeln 🌰', es: 'Almendras 🌰', it: 'Mandorle 🌰', fr: 'Amandes 🌰', pt: 'Amêndoas 🌰', nl: 'Amandelen 🌰', sv: 'Mandlar 🌰', da: 'Mandler 🌰', fi: 'Mantelit 🌰', no: 'Mandler 🌰', ru: 'Миндаль 🌰', zh: '杏仁 🌰', ja: 'アーモンド 🌰', ko: '아몬드 🌰', ar: 'لوز 🌰', he: 'שקדים 🌰', tr: 'Badem 🌰', hu: 'Mandula 🌰', hi: 'बादाम 🌰' },
  'mijo': { en: 'Millet 🌾', de: 'Hirse 🌾', es: 'Mijo 🌾', it: 'Miglio 🌾', fr: 'Millet 🌾', pt: 'Painço 🌾', nl: 'Gierst 🌾', sv: 'Hirs 🌾', da: 'Hirse 🌾', fi: 'Hirssi 🌾', no: 'Hirse 🌾', ru: 'Просо 🌾', zh: '小米 🌾', ja: 'キビ 🌾', ko: '기장 🌾', ar: 'دخن 🌾', he: 'דוחן 🌾', tr: 'Darı 🌾', hu: 'Köles 🌾', hi: 'बाजरा 🌾' },

  // PESCADOS Y MARISCOS
  'sardinas': { en: 'Sardines 🐟', de: 'Sardinen 🐟', es: 'Sardinas 🐟', it: 'Sardine 🐟', fr: 'Sardines 🐟', pt: 'Sardinhas 🐟', nl: 'Sardines 🐟', sv: 'Sardiner 🐟', da: 'Sardiner 🐟', fi: 'Sardiinit 🐟', no: 'Sardiner 🐟', ru: 'Сардины 🐟', zh: '沙丁鱼 🐟', ja: 'サーディン 🐟', ko: '정어리 🐟', ar: 'سردين 🐟', he: 'סרדינים 🐟', tr: 'Sardalya 🐟', hu: 'Szardínia 🐟', hi: 'सार्डिन 🐟' },
  'bonito': { en: 'Bonito 🐟', de: 'Bonito 🐟', es: 'Bonito 🐟', it: 'Bonito 🐟', fr: 'Bonite 🐟', pt: 'Bonito 🐟', nl: 'Bonito 🐟', sv: 'Bonito 🐟', da: 'Bonito 🐟', fi: 'Bonito 🐟', no: 'Bonito 🐟', ru: 'Бонито 🐟', zh: '鲣鱼 🐟', ja: 'カツオ 🐟', ko: '가다랑어 🐟', ar: 'بونيتو 🐟', he: 'בוניטו 🐟', tr: 'Palamut 🐟', hu: 'Bonito 🐟', hi: 'बोनिटो 🐟' },
  'atún': { en: 'Tuna 🐟', de: 'Thunfisch 🐟', es: 'Atún 🐟', it: 'Tonno 🐟', fr: 'Thon 🐟', pt: 'Atum 🐟', nl: 'Tonijn 🐟', sv: 'Tonfisk 🐟', da: 'Tunfisk 🐟', fi: 'Tonnikala 🐟', no: 'Tunfisk 🐟', ru: 'Тунец 🐟', zh: '金枪鱼 🐟', ja: 'マグロ 🐟', ko: '참치 🐟', ar: 'تونة 🐟', he: 'טונה 🐟', tr: 'Ton balığı 🐟', hu: 'Tonhal 🐟', hi: 'टूना 🐟' },
  'trucha': { en: 'Trout 🐟', de: 'Forelle 🐟', es: 'Trucha 🐟', it: 'Trota 🐟', fr: 'Truite 🐟', pt: 'Truta 🐟', nl: 'Forel 🐟', sv: 'Forell 🐟', da: 'Ørred 🐟', fi: 'Taimen 🐟', no: 'Ørret 🐟', ru: 'Форель 🐟', zh: '鳟鱼 🐟', ja: 'マス 🐟', ko: '송어 🐟', ar: 'سلمون مرقط 🐟', he: 'פורל 🐟', tr: 'Alabalık 🐟', hu: 'Pisztráng 🐟', hi: 'ट्राउट 🐟' },
  'rape': { en: 'Monkfish 🐟', de: 'Seeteufel 🐟', es: 'Rape 🐟', it: 'Rana pescatrice 🐟', fr: 'Lotte 🐟', pt: 'Tamboril 🐟', nl: 'Zeeduivel 🐟', sv: 'Marulk 🐟', da: 'Havtaske 🐟', fi: 'Merikrotti 🐟', no: 'Breiflabb 🐟', ru: 'Морской черт 🐟', zh: '鮟鱇鱼 🐟', ja: 'アンコウ 🐟', ko: '아귀 🐟', ar: 'سمك الصياد 🐟', he: 'דייג ים 🐟', tr: 'Fener balığı 🐟', hu: 'Ördöghal 🐟', hi: 'मंकफिश 🐟' },
  'rodaballo': { en: 'Turbot 🐟', de: 'Steinbutt 🐟', es: 'Rodaballo 🐟', it: 'Rombo chiodato 🐟', fr: 'Turbot 🐟', pt: 'Rodovalho 🐟', nl: 'Tarbot 🐟', sv: 'Piggvar 🐟', da: 'Pighvar 🐟', fi: 'Piikkikampela 🐟', no: 'Piggvar 🐟', ru: 'Тюрбо 🐟', zh: '大菱鲆 🐟', ja: 'ヒラメ 🐟', ko: '넙치 🐟', ar: 'تربوت 🐟', he: 'טורבוט 🐟', tr: 'Kalkan 🐟', hu: 'Rombuszhal 🐟', hi: 'टर्बोट 🐟' },
  'lenguado': { en: 'Sole 🐟', de: 'Seezunge 🐟', es: 'Lenguado 🐟', it: 'Sogliola 🐟', fr: 'Sole 🐟', pt: 'Linguado 🐟', nl: 'Tong 🐟', sv: 'Tunga 🐟', da: 'Tunge 🐟', fi: 'Kieli 🐟', no: 'Tunge 🐟', ru: 'Морской язык 🐟', zh: '比目鱼 🐟', ja: 'シタビラメ 🐟', ko: '서대 🐟', ar: 'سمك موسى 🐟', he: 'סול 🐟', tr: 'Dil balığı 🐟', hu: 'Nyelvhal 🐟', hi: 'सोल फिश 🐟' },
  'merluza': { en: 'Hake 🐟', de: 'Seehecht 🐟', es: 'Merluza 🐟', it: 'Nasello 🐟', fr: 'Merlu 🐟', pt: 'Pescada 🐟', nl: 'Heek 🐟', sv: 'Kummel 🐟', da: 'Kulmule 🐟', fi: 'Kummeliturska 🐟', no: 'Lysing 🐟', ru: 'Хек 🐟', zh: '无须鳕 🐟', ja: 'メルルーサ 🐟', ko: '헤이크 🐟', ar: 'الهاك 🐟', he: 'הייק 🐟', tr: 'Berlam 🐟', hu: 'Tengeri csuka 🐟', hi: 'हेक 🐟' },
  'bacalao': { en: 'Cod 🐟', de: 'Kabeljau 🐟', es: 'Bacalao 🐟', it: 'Merluzzo 🐟', fr: 'Cabillaud 🐟', pt: 'Bacalhau 🐟', nl: 'Kabeljauw 🐟', sv: 'Torsk 🐟', da: 'Torsk 🐟', fi: 'Turska 🐟', no: 'Torsk 🐟', ru: 'Треска 🐟', zh: '鳕鱼 🐟', ja: 'タラ 🐟', ko: '대구 🐟', ar: 'قد 🐟', he: 'קוד 🐟', tr: 'Morina 🐟', hu: 'Tőkehal 🐟', hi: 'कॉड 🐟' },
  'boquerones': { en: 'Anchovies 🐟', de: 'Sardellen 🐟', es: 'Boquerones 🐟', it: 'Alici 🐟', fr: 'Anchois 🐟', pt: 'Anchovas 🐟', nl: 'Ansjovis 🐟', sv: 'Ansjovis 🐟', da: 'Ansjos 🐟', fi: 'Sardellit 🐟', no: 'Ansjos 🐟', ru: 'Анчоусы 🐟', zh: '凤尾鱼 🐟', ja: 'アンチョビ 🐟', ko: '멸치 🐟', ar: 'أنشوجة 🐟', he: 'אנשובי 🐟', tr: 'Hamsi 🐟', hu: 'Szardella 🐟', hi: 'एंकोवी 🐟' },
  'anchoas': { en: 'Anchovies 🐟', de: 'Sardellen 🐟', es: 'Anchoas 🐟', it: 'Acciughe 🐟', fr: 'Anchois 🐟', pt: 'Anchovas 🐟', nl: 'Ansjovis 🐟', sv: 'Ansjovis 🐟', da: 'Ansjos 🐟', fi: 'Sardellit 🐟', no: 'Ansjos 🐟', ru: 'Анчоусы 🐟', zh: '鳀鱼 🐟', ja: 'カタクチイワシ 🐟', ko: '멸치 🐟', ar: 'أنشوجة 🐟', he: 'אנשובי 🐟', tr: 'Hamsi 🐟', hu: 'Szardella 🐟', hi: 'एंकोवी 🐟' },
  'lubina': { en: 'Sea bass 🐟', de: 'Wolfsbarsch 🐟', es: 'Lubina 🐟', it: 'Branzino 🐟', fr: 'Bar 🐟', pt: 'Robalo 🐟', nl: 'Zeebaars 🐟', sv: 'Havsabborre 🐟', da: 'Havaborre 🐟', fi: 'Meriahven 🐟', no: 'Havabbor 🐟', ru: 'Морской окунь 🐟', zh: '鲈鱼 🐟', ja: 'スズキ 🐟', ko: '농어 🐟', ar: 'قاروص 🐟', he: 'לברק 🐟', tr: 'Levrek 🐟', hu: 'Tengeri sügér 🐟', hi: 'सी बास 🐟' },
  'dorada': { en: 'Sea bream 🐟', de: 'Goldbrasse 🐟', es: 'Dorada 🐟', it: 'Orata 🐟', fr: 'Daurade 🐟', pt: 'Dourada 🐟', nl: 'Zeebrasem 🐟', sv: 'Havsbraxen 🐟', da: 'Havbrasen 🐟', fi: 'Kultalaatti 🐟', no: 'Havbrasse 🐟', ru: 'Дорадо 🐟', zh: '鲷鱼 🐟', ja: 'タイ 🐟', ko: '돔 🐟', ar: 'دنيس 🐟', he: 'דניס 🐟', tr: 'Çipura 🐟', hu: 'Aranyhal 🐟', hi: 'डोराडा 🐟' },
  'besugo': { en: 'Red sea bream 🐟', de: 'Rotbrasse 🐟', es: 'Besugo 🐟', it: 'Pagello 🐟', fr: 'Pageot 🐟', pt: 'Besugo 🐟', nl: 'Zeebrasem 🐟', sv: 'Rödbraxen 🐟', da: 'Rødbrasen 🐟', fi: 'Punainen laatti 🐟', no: 'Rødbrasse 🐟', ru: 'Красный морской лещ 🐟', zh: '红鲷 🐟', ja: 'アカダイ 🐟', ko: '붉은돔 🐟', ar: 'دنيس أحمر 🐟', he: 'דניס אדום 🐟', tr: 'Kırmızı çipura 🐟', hu: 'Vörös tengeri keszeg 🐟', hi: 'लाल समुद्री ब्रीम 🐟' },
  'salmonetes': { en: 'Red mullet 🐟', de: 'Rotbarbe 🐟', es: 'Salmonetes 🐟', it: 'Triglie 🐟', fr: 'Rougets 🐟', pt: 'Salmonetes 🐟', nl: 'Rode mul 🐟', sv: 'Mullar 🐟', da: 'Mulle 🐟', fi: 'Simpukka 🐟', no: 'Mulle 🐟', ru: 'Барабулька 🐟', zh: '鲻鱼 🐟', ja: 'ヒメジ 🐟', ko: '비늘치 🐟', ar: 'بربوني 🐟', he: 'ברבוני 🐟', tr: 'Barbunya 🐟', hu: 'Vörhenye 🐟', hi: 'रेड मुलेट 🐟' },

  // MARISCOS
  'langostinos': { en: 'Prawns 🦐', de: 'Garnelen 🦐', es: 'Langostinos 🦐', it: 'Gamberi 🦐', fr: 'Crevettes 🦐', pt: 'Camarões 🦐', nl: 'Garnalen 🦐', sv: 'Räkor 🦐', da: 'Rejer 🦐', fi: 'Katkaravut 🦐', no: 'Reker 🦐', ru: 'Креветки 🦐', zh: '明虾 🦐', ja: 'エビ 🦐', ko: '새우 🦐', ar: 'جمبري 🦐', he: 'שרימפס 🦐', tr: 'Karides 🦐', hu: 'Garnéla 🦐', hi: 'झींगा 🦐' },
  'gambas': { en: 'Shrimp 🦐', de: 'Garnelen 🦐', es: 'Gambas 🦐', it: 'Gamberetti 🦐', fr: 'Crevettes 🦐', pt: 'Gambas 🦐', nl: 'Garnalen 🦐', sv: 'Räkor 🦐', da: 'Rejer 🦐', fi: 'Katkaravut 🦐', no: 'Reker 🦐', ru: 'Креветки 🦐', zh: '虾 🦐', ja: 'エビ 🦐', ko: '새우 🦐', ar: 'جمبري 🦐', he: 'שרימפס 🦐', tr: 'Karides 🦐', hu: 'Rák 🦐', hi: 'झींगा 🦐' },
  'mejillones': { en: 'Mussels 🦪', de: 'Miesmuscheln 🦪', es: 'Mejillones 🦪', it: 'Cozze 🦪', fr: 'Moules 🦪', pt: 'Mexilhões 🦪', nl: 'Mosselen 🦪', sv: 'Musslor 🦪', da: 'Muslinger 🦪', fi: 'Simpukat 🦪', no: 'Blåskjell 🦪', ru: 'Мидии 🦪', zh: '贻贝 🦪', ja: 'ムール貝 🦪', ko: '홍합 🦪', ar: 'بلح البحر 🦪', he: 'צדפות 🦪', tr: 'Midye 🦪', hu: 'Kagyló 🦪', hi: 'मसल्स 🦪' },
  'almejas': { en: 'Clams 🦪', de: 'Venusmuscheln 🦪', es: 'Almejas 🦪', it: 'Vongole 🦪', fr: 'Palourdes 🦪', pt: 'Amêijoas 🦪', nl: 'Venusschelpen 🦪', sv: 'Musslor 🦪', da: 'Muslinger 🦪', fi: 'Simpukat 🦪', no: 'Skjell 🦪', ru: 'Моллюски 🦪', zh: '蛤蜊 🦪', ja: 'アサリ 🦪', ko: '조개 🦪', ar: 'محار 🦪', he: 'צדפות 🦪', tr: 'Deniz tarağı 🦪', hu: 'Kagyló 🦪', hi: 'क्लैम 🦪' },
  'vieiras': { en: 'Scallops 🦪', de: 'Jakobsmuscheln 🦪', es: 'Vieiras 🦪', it: 'Capesante 🦪', fr: 'Coquilles Saint-Jacques 🦪', pt: 'Vieiras 🦪', nl: 'Sint-jakobsschelpen 🦪', sv: 'Kammusslor 🦪', da: 'Kammuslinger 🦪', fi: 'Kampasimpukat 🦪', no: 'Kamskjell 🦪', ru: 'Гребешки 🦪', zh: '扇贝 🦪', ja: 'ホタテ 🦪', ko: '가리비 🦪', ar: 'محار الأسقلوب 🦪', he: 'צדפות סנט ז\'אק 🦪', tr: 'Tarak 🦪', hu: 'Fésűkagyló 🦪', hi: 'स्कैलप्स 🦪' },
  'navajas': { en: 'Razor clams 🦪', de: 'Schwertmuscheln 🦪', es: 'Navajas 🦪', it: 'Cannolicchi 🦪', fr: 'Couteaux 🦪', pt: 'Lingueirões 🦪', nl: 'Scheermessen 🦪', sv: 'Rakknivar 🦪', da: 'Knivsnegle 🦪', fi: 'Veitsisimpukat 🦪', no: 'Knivskjell 🦪', ru: 'Морские ножи 🦪', zh: '竹蛏 🦪', ja: 'マテガイ 🦪', ko: '맛조개 🦪', ar: 'بلح البحر السكين 🦪', he: 'צדפות סכין 🦪', tr: 'Bıçak midyesi 🦪', hu: 'Késkagyló 🦪', hi: 'रेज़र क्लैम 🦪' },
  'percebes': { en: 'Gooseneck barnacles 🦐', de: 'Entenmuscheln 🦐', es: 'Percebes 🦐', it: 'Lepas 🦐', fr: 'Pousse-pieds 🦐', pt: 'Percebes 🦐', nl: 'Eendenmosselen 🦐', sv: 'Gåshalsmusslan 🦐', da: 'Gåsehalsmusling 🦐', fi: 'Hanhenkaulaäyriäinen 🦐', no: 'Gåsehalsrur 🦐', ru: 'Морские уточки 🦐', zh: '茗荷 🦐', ja: 'エボシガイ 🦐', ko: '거위목따개비 🦐', ar: 'برنقيل أوزي 🦐', he: 'צפרדע ים 🦐', tr: 'Kaz boynu midyesi 🦐', hu: 'Libanyakkagyló 🦐', hi: 'गूसनेक बार्नाकल 🦐' },
  'centollos': { en: 'Spider crab 🦀', de: 'Seespinne 🦀', es: 'Centollos 🦀', it: 'Granseola 🦀', fr: 'Araignée de mer 🦀', pt: 'Santola 🦀', nl: 'Zeespin 🦀', sv: 'Havsspindel 🦀', da: 'Havedderkop 🦀', fi: 'Merihämähäkki 🦀', no: 'Trollkrabbe 🦀', ru: 'Краб-паук 🦀', zh: '蜘蛛蟹 🦀', ja: 'タカアシガニ 🦀', ko: '대게 🦀', ar: 'سرطان العنكبوت 🦀', he: 'סרטן עכביש 🦀', tr: 'Örümcek yengeci 🦀', hu: 'Pókkrab 🦀', hi: 'स्पाइडर क्रैब 🦀' },
  'bogavantes': { en: 'Lobster 🦞', de: 'Hummer 🦞', es: 'Bogavantes 🦞', it: 'Astice 🦞', fr: 'Homard 🦞', pt: 'Lavagante 🦞', nl: 'Kreeft 🦞', sv: 'Hummer 🦞', da: 'Hummer 🦞', fi: 'Hummeri 🦞', no: 'Hummer 🦞', ru: 'Омар 🦞', zh: '龙虾 🦞', ja: 'ロブスター 🦞', ko: '바닷가재 🦞', ar: 'كركند 🦞', he: 'לובסטר 🦞', tr: 'Istakoz 🦞', hu: 'Homár 🦞', hi: 'लॉब्स्टर 🦞' },
  'pulpo': { en: 'Octopus 🐙', de: 'Oktopus 🐙', es: 'Pulpo 🐙', it: 'Polpo 🐙', fr: 'Poulpe 🐙', pt: 'Polvo 🐙', nl: 'Octopus 🐙', sv: 'Bläckfisk 🐙', da: 'Blæksprutte 🐙', fi: 'Mustekala 🐙', no: 'Blekksprut 🐙', ru: 'Осьминог 🐙', zh: '章鱼 🐙', ja: 'タコ 🐙', ko: '문어 🐙', ar: 'أخطبوط 🐙', he: 'תמנון 🐙', tr: 'Ahtapot 🐙', hu: 'Polip 🐙', hi: 'ऑक्टोपस 🐙' },
  'sepia': { en: 'Cuttlefish 🦑', de: 'Sepia 🦑', es: 'Sepia 🦑', it: 'Seppia 🦑', fr: 'Seiche 🦑', pt: 'Choco 🦑', nl: 'Zeekat 🦑', sv: 'Bläckfisk 🦑', da: 'Blæksprutte 🦑', fi: 'Mustekala 🦑', no: 'Blekksprut 🦑', ru: 'Каракатица 🦑', zh: '墨鱼 🦑', ja: 'コウイカ 🦑', ko: '갑오징어 🦑', ar: 'حبار 🦑', he: 'דיונון 🦑', tr: 'Mürekkep balığı 🦑', hu: 'Tintahal 🦑', hi: 'कटलफिश 🦑' },
  'calamares': { en: 'Squid 🦑', de: 'Tintenfisch 🦑', es: 'Calamares 🦑', it: 'Calamari 🦑', fr: 'Calmars 🦑', pt: 'Lulas 🦑', nl: 'Inktvis 🦑', sv: 'Bläckfisk 🦑', da: 'Blæksprutte 🦑', fi: 'Kalmari 🦑', no: 'Akkar 🦑', ru: 'Кальмары 🦑', zh: '鱿鱼 🦑', ja: 'イカ 🦑', ko: '오징어 🦑', ar: 'حبار 🦑', he: 'דיונון 🦑', tr: 'Kalamar 🦑', hu: 'Tintahal 🦑', hi: 'स्क्विड 🦑' },
  'chipirones': { en: 'Baby squid 🦑', de: 'Baby Tintenfisch 🦑', es: 'Chipirones 🦑', it: 'Calamaretti 🦑', fr: 'Encornets 🦑', pt: 'Lulas pequenas 🦑', nl: 'Baby inktvis 🦑', sv: 'Baby bläckfisk 🦑', da: 'Baby blæksprutte 🦑', fi: 'Pieni kalmari 🦑', no: 'Baby akkar 🦑', ru: 'Маленькие кальмары 🦑', zh: '小鱿鱼 🦑', ja: '小さなイカ 🦑', ko: '작은 오징어 🦑', ar: 'حبار صغير 🦑', he: 'דיונון קטן 🦑', tr: 'Küçük kalamar 🦑', hu: 'Kis tintahal 🦑', hi: 'छोटा स्क्विड 🦑' },
  'berberechos': { en: 'Cockles 🦪', de: 'Herzmuscheln 🦪', es: 'Berberechos 🦪', it: 'Cuori 🦪', fr: 'Coques 🦪', pt: 'Berbigões 🦪', nl: 'Kokkels 🦪', sv: 'Hjärtmusslor 🦪', da: 'Hjertemuslinger 🦪', fi: 'Sydänsimpukat 🦪', no: 'Hjerteskjell 🦪', ru: 'Сердцевидки 🦪', zh: '鸟蛤 🦪', ja: 'ザルガイ 🦪', ko: '새꼬막 🦪', ar: 'قوقع القلب 🦪', he: 'צדפות לב 🦪', tr: 'Kalp midyesi 🦪', hu: 'Szívkagyló 🦪', hi: 'कॉकल्स 🦪' },

  // Traducciones para información nutricional de dieta
  'grasas': { en: 'Fat', de: 'Fett', es: 'Grasas', it: 'Grassi', fr: 'Graisses', pt: 'Gorduras', nl: 'Vetten', sv: 'Fett', da: 'Fedt', fi: 'Rasva', no: 'Fett', ru: 'Жиры', zh: '脂肪', ja: '脂肪', ko: '지방', ar: 'دهون', he: 'שומנים', tr: 'Yağ', hu: 'Zsír', hi: 'वसा' },
  'azúcares': { en: 'Sugar', de: 'Zucker', es: 'Azúcares', it: 'Zuccheri', fr: 'Sucres', pt: 'Açúcares', nl: 'Suikers', sv: 'Socker', da: 'Sukker', fi: 'Sokeri', no: 'Sukker', ru: 'Сахара', zh: '糖', ja: '糖', ko: '당', ar: 'سكريات', he: 'סוכרים', tr: 'Şeker', hu: 'Cukrok', hi: 'चीनी' }
}

/**
 * Función para traducir un producto individual
 */
const translateProduct = (productName, language = 'es') => {
  // Si ya está en español y el idioma solicitado es español, devolver como está
  if (language === 'es') {
    return productName
  }

  // Extraer emoji del producto original
  const emoji = productName.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu)
  const emojiStr = emoji ? ` ${emoji.join('')}` : ''

  // Limpiar el nombre del producto de emojis para buscar
  const cleanName = productName.replace(/[^\w\s-]/g, '').trim().toLowerCase()

  // 1. Buscar traducción exacta completa
  if (productTranslations[cleanName]) {
    const translation = productTranslations[cleanName][language]
    if (translation) {
      // Extraer solo el texto de la traducción (sin emoji) y agregar emoji original
      const translatedText = translation.replace(/[^\w\s-]/g, '').trim()
      return `${translatedText}${emojiStr}`
    }
  }

  // 2. Buscar traducciones especiales para productos compuestos conocidos
  const specialTranslations = {
    'clara huevo': { en: 'Egg white 🥚', de: 'Eiweiß 🥚', es: 'Clara de huevo 🥚' },
    'clara de huevo': { en: 'Egg white 🥚', de: 'Eiweiß 🥚', es: 'Clara de huevo 🥚' },
    'apio con hummus': { en: 'Celery with hummus 🌿', de: 'Sellerie mit Hummus 🌿', es: 'Apio con hummus 🌿' },
    'vinagre balsamico': { en: 'Balsamic vinegar 🌿', de: 'Balsamico-Essig 🌿', es: 'Vinagre balsámico 🌿' },
    'vinagre balsámico': { en: 'Balsamic vinegar 🌿', de: 'Balsamico-Essig 🌿', es: 'Vinagre balsámico 🌿' },
    'infusion natural': { en: 'Natural herbal tea 🍵', de: 'Natürlicher Kräutertee 🍵', es: 'Infusión natural 🍵' },
    'infusión natural': { en: 'Natural herbal tea 🍵', de: 'Natürlicher Kräutertee 🍵', es: 'Infusión natural 🍵' },
    'mostaza sin azucar': { en: 'Sugar-free mustard 🌿', de: 'Zuckerfreier Senf 🌿', es: 'Mostaza sin azúcar 🌿' },
    'mostaza sin azúcar': { en: 'Sugar-free mustard 🌿', de: 'Zuckerfreier Senf 🌿', es: 'Mostaza sin azúcar 🌿' },
    'ciruelas claudias': { en: 'Greengage plums 🍇', de: 'Renekloden 🍇', es: 'Ciruelas claudias 🍇' }
  }

  if (specialTranslations[cleanName]) {
    const translation = specialTranslations[cleanName][language]
    if (translation) {
      return translation
    }
  }

  // 3. Buscar por coincidencia de palabras clave más específica
  const words = cleanName.split(' ')
  let bestMatch = null
  let bestScore = 0

  for (const [key, translations] of Object.entries(productTranslations)) {
    const keyWords = key.split(' ')
    let score = 0

    // Calcular puntuación de coincidencia
    for (const keyWord of keyWords) {
      if (words.includes(keyWord)) {
        score += keyWord.length // Palabras más largas tienen más peso
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = { key, translations }
    }
  }

  if (bestMatch && bestMatch.translations[language]) {
    const translation = bestMatch.translations[language]
    const translatedText = translation.replace(/[^\w\s-]/g, '').trim()

    // Para productos compuestos como "ciruelas claudias", mantener palabras no traducidas
    const keyWords = bestMatch.key.split(' ')
    const untranslatedWords = words.filter(word => !keyWords.includes(word))

    if (untranslatedWords.length > 0) {
      return `${translatedText} ${untranslatedWords.join(' ')}${emojiStr}`
    } else {
      return `${translatedText}${emojiStr}`
    }
  }

  // 3. Buscar palabra por palabra (fallback)
  for (const word of words) {
    if (productTranslations[word]) {
      const translatedWord = productTranslations[word][language]
      if (translatedWord) {
        const translatedText = translatedWord.replace(/[^\w\s-]/g, '').trim()
        const otherWords = words.filter(w => w !== word).join(' ')

        if (otherWords) {
          return `${translatedText} ${otherWords}${emojiStr}`
        } else {
          return `${translatedText}${emojiStr}`
        }
      }
    }
  }

  // Si no encuentra traducción, devolver el original
  return productName
}


/**
 * Obtiene productos para dieta/bajos en calorías traducidos
 */
export const getDietProducts = (language = null) => {
  const userLanguage = language || detectUserLanguage()

  // Obtener traducciones para "Grasas" y "Azúcares"
  const fatTranslation = productTranslations['grasas'][userLanguage] || 'Grasas'
  const sugarTranslation = productTranslations['azúcares'][userLanguage] || 'Azúcares'

  return dietProducts.map(product => ({
    item: translateProduct(product.item, userLanguage),
    reason: `${product.reason} - ${product.calories}, ${fatTranslation}: ${product.fat}, ${sugarTranslation}: ${product.sugar}`,
    confidence: 0.95,
    type: 'diet_low_calorie',
    priority: 'high',
    nutritionalInfo: {
      calories: product.calories,
      fat: product.fat,
      sugar: product.sugar
    }
  }))
}

/**
 * Obtiene todos los productos disponibles para una región
 */
export const getAllProductsForRegion = (region = 'europa') => {
  const regionData = seasonalDatabase[region] || seasonalDatabase.europa
  const allProducts = []

  Object.keys(regionData).forEach(month => {
    allProducts.push(...regionData[month])
  })

  return [...new Set(allProducts)] // Eliminar duplicados
}

export default {
  getSeasonalProducts,
  getMonthName,
  getUserRegion,
  getAllProductsForRegion,
  getDietProducts
}