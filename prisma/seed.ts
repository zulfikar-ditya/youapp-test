import { PrismaClient } from '@prisma/client';
import { HashUtils } from '@utils/utils';

const prisma = new PrismaClient();

// Western horoscopes
const horoscopes = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

// Chinese zodiacs
const zodiacs = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

// Example interests (adjust as needed)
const interests = [
  'Music',
  'Movies',
  'Sports',
  'Travel',
  'Gaming',
  'Reading',
  'Cooking',
  'Photography',
  'Fitness',
  'Art',
  'Technology',
  'Fashion',
];

async function seedHoroscopes() {
  for (const name of horoscopes) {
    await prisma.horoscope.updateMany({ where: { name }, data: { name } });
    await prisma.horoscope.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function seedZodiacs() {
  for (const name of zodiacs) {
    await prisma.zodiac.updateMany({ where: { name }, data: { name } });
    await prisma.zodiac.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function seedInterests() {
  for (const name of interests) {
    await prisma.interest.updateMany({ where: { name }, data: { name } });
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function seedAdmin() {
  const adminEmail = 'admin@mail.com';
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'admin',
      password: await HashUtils.generateHash('Saf3P@ssw0rd102391!'),
    },
  });
}

async function main() {
  console.log('Seeding start');
  await seedHoroscopes();
  await seedZodiacs();
  await seedInterests();
  await seedAdmin();
  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
