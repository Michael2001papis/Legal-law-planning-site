// סרטי דמו – מוצגים כשאין שרת
const POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
  'https://images.unsplash.com/photo-1478720568477-152e9d29e8c9?w=400',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
];

export const DEMO_MOVIES = [
  { _id: 'demo1', title: 'החלום הגדול', year: 2024, genres: ['דרמה'], description: 'סיפור מרגש על הגשמת חלומות', posterUrl: POSTERS[0], availabilityPlans: ['basic', 'platinum', 'diamond'] },
  { _id: 'demo2', title: 'צחוקים בטוחים', year: 2023, genres: ['קומדיה'], description: 'קומדיה קלילה שתצחיק עד דמעות', posterUrl: POSTERS[1], availabilityPlans: ['platinum', 'diamond'] },
  { _id: 'demo3', title: 'מרדף הלילה', year: 2024, genres: ['אקשן'], description: 'אקשן מטורף מראשית ועד סוף', posterUrl: POSTERS[2], availabilityPlans: ['diamond'] },
  { _id: 'demo4', title: 'מסע לכוכבים', year: 2022, genres: ['מדע בדיוני'], description: 'מסע אפי אל העתיד', posterUrl: POSTERS[3], availabilityPlans: ['basic', 'platinum', 'diamond'] },
  { _id: 'demo5', title: 'אהבה בירושלים', year: 2023, genres: ['רומנטי', 'דרמה'], description: 'סיפור אהבה שלא תשכח', posterUrl: POSTERS[4], availabilityPlans: ['platinum', 'diamond'] },
  { _id: 'demo6', title: 'התעלומה', year: 2024, genres: ['מתח', 'אקשן'], description: 'מותח עד הרגע האחרון', posterUrl: POSTERS[5], availabilityPlans: ['diamond'] },
];

export function getDemoMovies(plan = 'diamond') {
  return DEMO_MOVIES.filter((m) =>
    !m.availabilityPlans?.length || m.availabilityPlans.includes(plan)
  );
}

export function getDemoMovie(id) {
  return DEMO_MOVIES.find((m) => m._id === id);
}
