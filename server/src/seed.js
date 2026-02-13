import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Movie } from './models/Movie.js';
import bcrypt from 'bcryptjs';

const samples = [
  { title: 'סרט דוגמה 1', description: 'תיאור סרט', year: 2023, genres: ['דרמה'], availabilityPlans: ['basic', 'platinum', 'diamond'] },
  { title: 'סרט דוגמה 2', description: 'קומדיה קלילה', year: 2022, genres: ['קומדיה'], availabilityPlans: ['platinum', 'diamond'] },
  { title: 'סרט דוגמה 3', description: 'מדע בדיוני', year: 2024, genres: ['מדע בדיוני'], availabilityPlans: ['diamond'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mp-movies');
  const hash = await bcrypt.hash('admin123', 12);
  await User.findOneAndUpdate(
    { email: 'admin@mp.com' },
    { email: 'admin@mp.com', passwordHash: hash, name: 'מנהל', role: 'admin', plan: 'diamond', status: 'active' },
    { upsert: true }
  );
  for (const m of samples) {
    await Movie.findOneAndUpdate({ title: m.title }, m, { upsert: true });
  }
  console.log('Seed done');
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
