import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'ht';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.podcast': 'Podcast',
    'nav.news': 'News',
    'nav.social': 'Social',
    'nav.store': 'Store',
    'nav.signIn': 'Sign In',
    
    // Hero Section
    'hero.tagline': 'Your Soccer Companion',
    'hero.title1': 'The Beautiful',
    'hero.title2': 'Game',
    'hero.title3': 'Reimagined',
    'hero.description': 'Your ultimate destination for soccer content, analysis, and community. Join thousands of fans worldwide.',
    'hero.cta': 'Explore Now',
    'hero.watchPodcast': 'Watch Podcast',
    
    // News Section
    'news.liveUpdates': 'Live Updates',
    'news.title': 'Latest',
    'news.titleHighlight': 'News',
    'news.description': 'Stay updated with the latest soccer news from around the world',
    'news.worldCup': 'World Cup 2026',
    'news.roadTo2026': 'The Road to 2026',
    'news.wcDescription': 'Everything you need to know about the upcoming FIFA World Cup hosted across USA, Mexico, and Canada.',
    'news.exploreCoverage': 'Explore Coverage',
    'news.latestQualifier': 'Latest Qualifier Results',
    'news.latestUpdates': 'Latest Updates',
    'news.viewAll': 'View All News',
    'news.backToNews': 'Back to News',
    'news.backToHome': 'Back to Home',
    'news.footballNews': 'Football',
    'news.newsTitle': 'News',
    'news.newsDescription': 'Your source for the latest football news, transfers, and match updates',
    'news.allNews': 'All News',
    'news.transfers': 'Transfers',
    'news.championsLeague': 'Champions League',
    'news.matches': 'Matches',
    'news.injuries': 'Injuries',
    'news.noNews': 'No news available',
    'news.checkBack': 'Check back later for updates',
    'news.source': 'Source',
    'news.by': 'By',
    'news.readFull': 'Read Full Article',
    
    // Merch Section
    'merch.exclusive': 'Exclusive Drops',
    'merch.title': 'Official',
    'merch.titleHighlight': 'Merch',
    'merch.description': 'Rep your passion with premium Menlifoot gear. Limited edition drops you won\'t find anywhere else.',
    'merch.shopNow': 'Shop Now',
    'merch.addToCart': 'Add to Cart',
    'merch.added': 'Added to cart',
    
    // Social Section
    'social.community': 'Join the Community',
    'social.title': 'Connect',
    'social.titleHighlight': 'With Us',
    'social.description': 'Follow our journey across platforms and become part of the Menlifoot family.',
    'social.followers': 'followers',
    'social.subscribers': 'subscribers',
    
    // AI Agent
    'ai.title': 'Soccer AI',
    'ai.placeholder': 'Ask me anything about soccer...',
    'ai.greeting': 'Hey! I\'m your soccer companion. Ask me anything about the beautiful game!',
    
    // Footer
    'footer.tagline': 'Your ultimate soccer companion for news, analysis, and community.',
    'footer.quickLinks': 'Quick Links',
    'footer.connect': 'Connect',
    'footer.rights': 'All rights reserved.',
    
    // Splash
    'splash.companion': 'Your Soccer Companion',
  },
  fr: {
    // Navbar
    'nav.home': 'Accueil',
    'nav.podcast': 'Podcast',
    'nav.news': 'Actualités',
    'nav.social': 'Social',
    'nav.store': 'Boutique',
    'nav.signIn': 'Connexion',
    
    // Hero Section
    'hero.tagline': 'Votre Compagnon Football',
    'hero.title1': 'Le Beau',
    'hero.title2': 'Jeu',
    'hero.title3': 'Réinventé',
    'hero.description': 'Votre destination ultime pour le contenu, l\'analyse et la communauté du football. Rejoignez des milliers de fans à travers le monde.',
    'hero.cta': 'Explorer',
    'hero.watchPodcast': 'Voir le Podcast',
    
    // News Section
    'news.liveUpdates': 'Mises à Jour en Direct',
    'news.title': 'Dernières',
    'news.titleHighlight': 'Actualités',
    'news.description': 'Restez informé des dernières actualités du football mondial',
    'news.worldCup': 'Coupe du Monde 2026',
    'news.roadTo2026': 'La Route vers 2026',
    'news.wcDescription': 'Tout ce que vous devez savoir sur la prochaine Coupe du Monde FIFA organisée aux États-Unis, au Mexique et au Canada.',
    'news.exploreCoverage': 'Explorer la Couverture',
    'news.latestQualifier': 'Derniers Résultats des Qualifications',
    'news.latestUpdates': 'Dernières Mises à Jour',
    'news.viewAll': 'Voir Toutes les Actualités',
    'news.backToNews': 'Retour aux Actualités',
    'news.backToHome': 'Retour à l\'Accueil',
    'news.footballNews': 'Football',
    'news.newsTitle': 'Actualités',
    'news.newsDescription': 'Votre source pour les dernières actualités, transferts et résultats de football',
    'news.allNews': 'Toutes les Actualités',
    'news.transfers': 'Transferts',
    'news.championsLeague': 'Ligue des Champions',
    'news.matches': 'Matchs',
    'news.injuries': 'Blessures',
    'news.noNews': 'Aucune actualité disponible',
    'news.checkBack': 'Revenez plus tard pour les mises à jour',
    'news.source': 'Source',
    'news.by': 'Par',
    'news.readFull': 'Lire l\'Article Complet',
    
    // Merch Section
    'merch.exclusive': 'Collections Exclusives',
    'merch.title': 'Boutique',
    'merch.titleHighlight': 'Officielle',
    'merch.description': 'Montrez votre passion avec des articles Menlifoot premium. Éditions limitées introuvables ailleurs.',
    'merch.shopNow': 'Acheter',
    'merch.addToCart': 'Ajouter au Panier',
    'merch.added': 'Ajouté au panier',
    
    // Social Section
    'social.community': 'Rejoignez la Communauté',
    'social.title': 'Connectez',
    'social.titleHighlight': '-vous',
    'social.description': 'Suivez notre parcours sur toutes les plateformes et faites partie de la famille Menlifoot.',
    'social.followers': 'abonnés',
    'social.subscribers': 'abonnés',
    
    // AI Agent
    'ai.title': 'IA Football',
    'ai.placeholder': 'Posez-moi une question sur le football...',
    'ai.greeting': 'Salut! Je suis votre compagnon football. Demandez-moi n\'importe quoi sur le beau jeu!',
    
    // Footer
    'footer.tagline': 'Votre compagnon football ultime pour les actualités, analyses et communauté.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.connect': 'Connecter',
    'footer.rights': 'Tous droits réservés.',
    
    // Splash
    'splash.companion': 'Votre Compagnon Football',
  },
  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.podcast': 'Podcast',
    'nav.news': 'Noticias',
    'nav.social': 'Social',
    'nav.store': 'Tienda',
    'nav.signIn': 'Iniciar Sesión',
    
    // Hero Section
    'hero.tagline': 'Tu Compañero de Fútbol',
    'hero.title1': 'El Hermoso',
    'hero.title2': 'Juego',
    'hero.title3': 'Reinventado',
    'hero.description': 'Tu destino definitivo para contenido, análisis y comunidad de fútbol. Únete a miles de aficionados en todo el mundo.',
    'hero.cta': 'Explorar',
    'hero.watchPodcast': 'Ver Podcast',
    
    // News Section
    'news.liveUpdates': 'Actualizaciones en Vivo',
    'news.title': 'Últimas',
    'news.titleHighlight': 'Noticias',
    'news.description': 'Mantente actualizado con las últimas noticias del fútbol mundial',
    'news.worldCup': 'Copa del Mundo 2026',
    'news.roadTo2026': 'El Camino a 2026',
    'news.wcDescription': 'Todo lo que necesitas saber sobre la próxima Copa del Mundo FIFA en Estados Unidos, México y Canadá.',
    'news.exploreCoverage': 'Explorar Cobertura',
    'news.latestQualifier': 'Últimos Resultados de Clasificación',
    'news.latestUpdates': 'Últimas Actualizaciones',
    'news.viewAll': 'Ver Todas las Noticias',
    'news.backToNews': 'Volver a Noticias',
    'news.backToHome': 'Volver al Inicio',
    'news.footballNews': 'Fútbol',
    'news.newsTitle': 'Noticias',
    'news.newsDescription': 'Tu fuente de las últimas noticias, fichajes y resultados de fútbol',
    'news.allNews': 'Todas las Noticias',
    'news.transfers': 'Fichajes',
    'news.championsLeague': 'Champions League',
    'news.matches': 'Partidos',
    'news.injuries': 'Lesiones',
    'news.noNews': 'No hay noticias disponibles',
    'news.checkBack': 'Vuelve más tarde para actualizaciones',
    'news.source': 'Fuente',
    'news.by': 'Por',
    'news.readFull': 'Leer Artículo Completo',
    
    // Merch Section
    'merch.exclusive': 'Colecciones Exclusivas',
    'merch.title': 'Tienda',
    'merch.titleHighlight': 'Oficial',
    'merch.description': 'Muestra tu pasión con productos Menlifoot premium. Ediciones limitadas que no encontrarás en otro lugar.',
    'merch.shopNow': 'Comprar',
    'merch.addToCart': 'Añadir al Carrito',
    'merch.added': 'Añadido al carrito',
    
    // Social Section
    'social.community': 'Únete a la Comunidad',
    'social.title': 'Conéctate',
    'social.titleHighlight': 'Con Nosotros',
    'social.description': 'Sigue nuestro viaje en todas las plataformas y forma parte de la familia Menlifoot.',
    'social.followers': 'seguidores',
    'social.subscribers': 'suscriptores',
    
    // AI Agent
    'ai.title': 'IA de Fútbol',
    'ai.placeholder': 'Pregúntame cualquier cosa sobre fútbol...',
    'ai.greeting': '¡Hola! Soy tu compañero de fútbol. ¡Pregúntame lo que quieras sobre el hermoso juego!',
    
    // Footer
    'footer.tagline': 'Tu compañero definitivo de fútbol para noticias, análisis y comunidad.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.connect': 'Conectar',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Splash
    'splash.companion': 'Tu Compañero de Fútbol',
  },
  ht: {
    // Navbar
    'nav.home': 'Lakay',
    'nav.podcast': 'Podcast',
    'nav.news': 'Nouvèl',
    'nav.social': 'Sosyal',
    'nav.store': 'Boutik',
    'nav.signIn': 'Konekte',
    
    // Hero Section
    'hero.tagline': 'Patnè Foutbòl Ou',
    'hero.title1': 'Bèl',
    'hero.title2': 'Jwèt',
    'hero.title3': 'La',
    'hero.description': 'Destinasyon final ou pou kontni, analiz ak kominote foutbòl. Rejwenn dè milye fanatik nan mond lan.',
    'hero.cta': 'Eksplore',
    'hero.watchPodcast': 'Gade Podcast',
    
    // News Section
    'news.liveUpdates': 'Mizajou an Dirèk',
    'news.title': 'Dènye',
    'news.titleHighlight': 'Nouvèl',
    'news.description': 'Rete enfòme ak dènye nouvèl foutbòl nan mond lan',
    'news.worldCup': 'Koup di Mond 2026',
    'news.roadTo2026': 'Wout pou 2026',
    'news.wcDescription': 'Tout sa ou bezwen konnen sou pwochen Koup di Mond FIFA nan Etazini, Meksik ak Kanada.',
    'news.exploreCoverage': 'Eksplore Kouvèti',
    'news.latestQualifier': 'Dènye Rezilta Kalifikasyon',
    'news.latestUpdates': 'Dènye Mizajou',
    'news.viewAll': 'Wè Tout Nouvèl',
    'news.backToNews': 'Retounen nan Nouvèl',
    'news.backToHome': 'Retounen Lakay',
    'news.footballNews': 'Foutbòl',
    'news.newsTitle': 'Nouvèl',
    'news.newsDescription': 'Sous ou pou dènye nouvèl foutbòl, transfè ak rezilta match',
    'news.allNews': 'Tout Nouvèl',
    'news.transfers': 'Transfè',
    'news.championsLeague': 'Lig Chanpyon',
    'news.matches': 'Match',
    'news.injuries': 'Blesi',
    'news.noNews': 'Pa gen nouvèl disponib',
    'news.checkBack': 'Retounen pita pou mizajou',
    'news.source': 'Sous',
    'news.by': 'Pa',
    'news.readFull': 'Li Atik Konplè',
    
    // Merch Section
    'merch.exclusive': 'Koleksyon Eksklizif',
    'merch.title': 'Boutik',
    'merch.titleHighlight': 'Ofisyèl',
    'merch.description': 'Montre pasyon ou ak pwodui Menlifoot premyòm. Edisyon limite ou pap jwenn okenn lòt kote.',
    'merch.shopNow': 'Achte',
    'merch.addToCart': 'Mete nan Panye',
    'merch.added': 'Ajoute nan panye',
    
    // Social Section
    'social.community': 'Rejwenn Kominote a',
    'social.title': 'Konekte',
    'social.titleHighlight': 'Avèk Nou',
    'social.description': 'Swiv vwayaj nou sou tout platfòm yo epi vin fè pati fanmi Menlifoot la.',
    'social.followers': 'moun kap swiv',
    'social.subscribers': 'abòne',
    
    // AI Agent
    'ai.title': 'IA Foutbòl',
    'ai.placeholder': 'Mande m nenpòt bagay sou foutbòl...',
    'ai.greeting': 'Sak pase! Mwen se patnè foutbòl ou. Mande m nenpòt bagay sou bèl jwèt la!',
    
    // Footer
    'footer.tagline': 'Patnè foutbòl final ou pou nouvèl, analiz ak kominote.',
    'footer.quickLinks': 'Lyen Rapid',
    'footer.connect': 'Konekte',
    'footer.rights': 'Tout dwa rezève.',
    
    // Splash
    'splash.companion': 'Patnè Foutbòl Ou',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('menlifoot-language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('menlifoot-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ht: 'Kreyòl',
};
