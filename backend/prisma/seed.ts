import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear data
  await prisma.order_items.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.books.deleteMany();
  await prisma.genres.deleteMany();
  await prisma.users.deleteMany();

  // Create sample data
  const user = await prisma.users.create({
    data: {
      username: 'Test User',
      email: 'test@example.com',
      password: '$2b$12$hashedpassword123' // password123
    }
  });

  const genre = await prisma.genres.create({
    data: { name: 'Programming' }
  });

  await prisma.books.create({
    data: {
      title: 'Learn TypeScript',
      writer: 'John Doe',
      publisher: 'Tech Press',
      publication_year: 2024,
      description: 'Learn TypeScript from scratch',
      price: 99000,
      stock_quantity: 100,
      genre_id: genre.id
    }
  });

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());