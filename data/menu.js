/*
 * COCHI — menú público.
 * Edita nombres, descripciones, precios, disponibilidad e imágenes aquí.
 * Todos estos datos se sirven como archivos estáticos; no se guardan datos de visitantes.
 */
window.COCHI_MENU = {
  restaurant: {
    id: "cochi",
    name: "Cochi",
    tagline: "Tu próximo sabor favorito",
    intro: "Shawarmas, costillas a la BBQ, bandejas, arroz chino y mucho más.",
    currencySymbol: "$",
    logo: "assets/branding/logo-cochi-rojo.png",
    logoCream: "assets/branding/logo-cochi-crema.png",
    isotipo: "assets/branding/isotipo-cochi-rojo.png",
    isotipoCream: "assets/branding/isotipo-cochi-crema.png"
  },
  categories: [
    { id: "shawarmas", name: "Shawarmas", shortName: "Shawarmas", description: "Envuelto, cargado y listo para antojarte.", icon: "wrap" },
    { id: "costillas", name: "Costillas a la BBQ", shortName: "Costillas", description: "Costillas de cerdo con ese toque BBQ.", icon: "flame" },
    { id: "bandejas", name: "Bandejas", shortName: "Bandejas", description: "Combos para comer bien y compartir.", icon: "tray" },
    { id: "arroz-chino", name: "Arroz chino", shortName: "Arroz chino", description: "Clásicos y especiales para elegir.", icon: "bowl" },
    { id: "churrasco", name: "Churrasco", shortName: "Churrasco", description: "Una ración para venir con hambre.", icon: "steak" },
    { id: "tenders-alitas", name: "Tenders y alitas", shortName: "Tenders y alitas", description: "Crujientes, con papas y ensalada César.", icon: "chicken" },
    { id: "pollo-asado", name: "Pollo asado", shortName: "Pollo asado", description: "Con yuca, guasacaca y refresco. Solo los domingos.", icon: "roast" },
    { id: "adicionales", name: "Adicionales", shortName: "Adicionales", description: "Ese extra que completa el antojo.", icon: "plus" }
  ],
  products: [
    { id: "shawarma-pollo", name: "Shawarma de pollo", categoryId: "shawarmas", price: 7, description: "Pan árabe, lechuga, cebolla, tomate, pepinillos, perejil, papas hilachas, pollo y salsas árabes.", image: "assets/images/products/shawarma-pareja.webp", imageAlt: "Shawarmas Cochi envueltos en papel ajedrezado, foto tomada de una pieza promocional de la marca", imageNote: "", available: true, featured: true },
    { id: "shawarma-pollo-crispy", name: "Shawarma de pollo crispy", categoryId: "shawarmas", price: 8, description: "Pan árabe, lechuga, cebolla, tomate, pepinillos, perejil, papas hilachas, pollo crispy y salsas árabes.", image: "assets/images/products/shawarma-cesar.webp", imageAlt: "Shawarma Cochi con pollo crujiente, foto tomada de una pieza promocional de la marca", imageNote: "", available: true },
    { id: "shawarma-carne", name: "Shawarma de carne", categoryId: "shawarmas", price: 9, description: "Pan árabe, lechuga, cebolla, tomate, pepinillos, perejil, papas hilachas, carne y salsas árabes.", image: "assets/images/products/shawarma-carne-papas.webp", imageAlt: "Shawarma Cochi acompañado de papas fritas, foto tomada de una pieza promocional de la marca", imageNote: "", available: true },
    { id: "shawarma-mixto", name: "Shawarma de mixto", categoryId: "shawarmas", price: 8, description: "Pan árabe, lechuga, cebolla, tomate, pepinillos, perejil, papas hilachas, carne, pollo y salsas árabes.", image: "assets/images/products/shawarma-pareja.webp", imageAlt: "Dos shawarmas Cochi con vegetales y papel ajedrezado, foto tomada de una pieza promocional de la marca", imageNote: "", available: true },
    { id: "shawarma-cesar", name: "Shawarma Cesar", categoryId: "shawarmas", price: 8, description: "Pan árabe, lechuga, cebolla, tomate, croutones, queso pecorino, papas hilachas, pepinillos, pollo crispy y salsa César de la casa.", image: "assets/images/products/shawarma-cesar.webp", imageAlt: "Shawarma Cesar Cochi, imagen de una publicación de la marca", imageNote: "", available: true, featured: true },

    { id: "costillas-racion", name: "Ración individual", categoryId: "costillas", price: 9, description: "250 g de costillas de cerdo a la BBQ, papas fritas y ensalada César.", image: "assets/images/products/costillas.svg", imageAlt: "Ilustración temporal de costillas BBQ con papas fritas", imageNote: "Ilustración temporal", available: true },
    { id: "costilla-cuarto", name: "¼ de costilla sola", categoryId: "costillas", price: 7, description: "250 g de costillas a la BBQ.", image: "assets/images/products/costillas.svg", imageAlt: "Ilustración temporal de costillas BBQ", imageNote: "Ilustración temporal", available: true },
    { id: "costilla-medio-kilo", name: "½ kilo de costilla sola", categoryId: "costillas", price: 14, description: "500 g de costillas a la BBQ.", image: "assets/images/products/costillas.svg", imageAlt: "Ilustración temporal de costillas BBQ", imageNote: "Ilustración temporal", available: true },
    { id: "costilla-kilo", name: "1 kilo de costilla sola", categoryId: "costillas", price: 28, description: "1000 g de costillas a la BBQ.", image: "assets/images/products/costillas.svg", imageAlt: "Ilustración temporal de costillas BBQ", imageNote: "Ilustración temporal", available: true },

    { id: "bandeja-tres-carnes", name: "Bandeja 3 carnes", categoryId: "bandejas", price: 17, description: "200 g de lomito, 200 g de costillas a la BBQ, 250 g de tenders (o de alitas) y papas fritas.", image: "assets/images/products/bandejas.svg", imageAlt: "Ilustración temporal de una bandeja con varias carnes y papas", imageNote: "Ilustración temporal", available: true, featured: true },
    { id: "bandeja-costilla-lomito", name: "Bandeja costilla y lomito", categoryId: "bandejas", price: 14, description: "200 g de lomito, 200 g de costillas a la BBQ, papas fritas y ensalada César.", image: "assets/images/products/bandejas.svg", imageAlt: "Ilustración temporal de una bandeja con carnes y acompañantes", imageNote: "Ilustración temporal", available: true },
    { id: "bandeja-costilla-pollo", name: "Bandeja costilla y pollo", categoryId: "bandejas", price: 11, description: "200 g de tenders o alitas, 200 g de costillas a la BBQ, papas fritas y ensalada César.", image: "assets/images/products/bandejas.svg", imageAlt: "Ilustración temporal de una bandeja con pollo, costillas y acompañantes", imageNote: "Ilustración temporal", available: true },

    { id: "arroz-classic-box", name: "Classic Box", categoryId: "arroz-chino", price: 4, description: "23 onzas de arroz chino.", image: "assets/images/products/arroz-chino.svg", imageAlt: "Ilustración temporal de un bowl de arroz chino", imageNote: "Ilustración temporal", available: true },
    { id: "arroz-mega-box", name: "Mega Box", categoryId: "arroz-chino", price: 6, description: "32 onzas de arroz chino.", image: "assets/images/products/arroz-chino.svg", imageAlt: "Ilustración temporal de un bowl de arroz chino", imageNote: "Ilustración temporal", available: true },
    { id: "arroz-alitas", name: "Arroz especial con alitas", categoryId: "arroz-chino", price: 10, description: "Arroz chino, papas fritas o ensalada y alitas de pollo.", image: "assets/images/products/arroz-chino.svg", imageAlt: "Ilustración temporal de arroz chino con acompañantes", imageNote: "Ilustración temporal", available: true },
    { id: "arroz-costillas", name: "Arroz especial con costillas", categoryId: "arroz-chino", price: 12, description: "Arroz chino, papas fritas o ensalada y costillas a la BBQ.", image: "assets/images/products/arroz-chino.svg", imageAlt: "Ilustración temporal de arroz chino con acompañantes", imageNote: "Ilustración temporal", available: true },

    { id: "churrasco-racion", name: "Ración de churrasco", categoryId: "churrasco", price: 12, description: "300 g de carne, papas fritas y ensalada César.", image: "assets/images/products/churrasco.svg", imageAlt: "Ilustración temporal de churrasco con papas", imageNote: "Ilustración temporal", available: true },

    { id: "tenders-racion", name: "Ración individual de tenders", categoryId: "tenders-alitas", price: 7, description: "250 g de tenders de pollo, papas fritas y ensalada César.", image: "assets/images/products/snacks.svg", imageAlt: "Ilustración temporal de tenders de pollo", imageNote: "Ilustración temporal", available: true },
    { id: "alitas-racion", name: "Ración individual de alitas", categoryId: "tenders-alitas", price: 6, description: "250 g de alitas de pollo, papas fritas y ensalada César. Puedes elegir las alitas agridulces, al ajillo, a la BBQ o clásicas.", image: "assets/images/products/snacks.svg", imageAlt: "Ilustración temporal de tenders y alitas", imageNote: "Ilustración temporal", available: true },

    { id: "pollo-medio", name: "½ pollo asado", categoryId: "pollo-asado", price: 10, description: "½ pollo asado, ración de yuca, guasacaca y refresco de 1 litro.", image: "assets/images/products/pollo-asado.webp", imageAlt: "Pollo asado promocionado por Cochi, con acompañantes", imageNote: "", available: true, availabilityNote: "Solo domingos", featured: true },
    { id: "pollo-entero", name: "Pollo entero", categoryId: "pollo-asado", price: 18, description: "Pollo entero, ración de yuca, guasacaca y refresco de 2 litros.", image: "assets/images/products/pollo-asado.webp", imageAlt: "Pollo asado promocionado por Cochi, con acompañantes", imageNote: "", available: true, availabilityNote: "Solo domingos" },

    { id: "ensalada-cesar", name: "Ensalada César", categoryId: "adicionales", price: 5, description: "Ensalada César como acompañante.", image: "assets/images/products/ensalada.svg", imageAlt: "Ilustración temporal de ensalada César", imageNote: "Ilustración temporal", available: true },
    { id: "ensalada-cesar-pollo", name: "Ensalada César con pollo", categoryId: "adicionales", price: 7, description: "Ensalada César con pollo.", image: "assets/images/products/ensalada.svg", imageAlt: "Ilustración temporal de ensalada César con pollo", imageNote: "Ilustración temporal", available: true },
    { id: "papas-pequenas", name: "Ración de papas pequeña", categoryId: "adicionales", price: 1.5, description: "Ración pequeña de papas fritas.", image: "assets/images/products/extras.svg", imageAlt: "Ilustración temporal de papas fritas", imageNote: "Ilustración temporal", available: true },
    { id: "papas-grandes", name: "Ración de papas grande", categoryId: "adicionales", price: 3.5, description: "Ración grande de papas fritas.", image: "assets/images/products/extras.svg", imageAlt: "Ilustración temporal de papas fritas", imageNote: "Ilustración temporal", available: true },
    { id: "refresco-litro", name: "Refresco 1 litro", categoryId: "adicionales", price: 1.5, description: "Refresco de 1 litro.", image: "assets/images/products/bebidas.svg", imageAlt: "Ilustración temporal de un refresco", imageNote: "Ilustración temporal", available: true },
    { id: "refresco-dos-litros", name: "Refresco 2 litros", categoryId: "adicionales", price: 2.5, description: "Refresco de 2 litros.", image: "assets/images/products/bebidas.svg", imageAlt: "Ilustración temporal de un refresco", imageNote: "Ilustración temporal", available: true },
    { id: "marquesa-chocolate", name: "Marquesa de chocolate", categoryId: "adicionales", price: 2.5, description: "Marquesa de chocolate.", image: "assets/images/products/dessert.svg", imageAlt: "Ilustración temporal de una marquesa de chocolate", imageNote: "Ilustración temporal", available: true }
  ]
};
