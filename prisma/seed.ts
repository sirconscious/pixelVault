import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean slate (safe for dev). Order matters due to relations.
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // --- Categories ---
  const steam = await prisma.category.create({
    data: {
      name: "Steam Cards",
      slug: "steam-cards",
      description: "Top up your Steam Wallet instantly with digital codes.",
      imageUrl:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
      sortOrder: 1,
    },
  });

  const xbox = await prisma.category.create({
    data: {
      name: "Xbox Cards",
      slug: "xbox-cards",
      description: "Xbox Gift Cards for games, add-ons and subscriptions.",
      imageUrl:
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80",
      sortOrder: 2,
    },
  });

  const games = await prisma.category.create({
    data: {
      name: "Games",
      slug: "games",
      description: "Digital game keys for PC and Xbox — instant delivery.",
      imageUrl:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
      sortOrder: 3,
    },
  });

  // --- Products with variants ---
  await prisma.product.create({
    data: {
      name: "Steam Wallet Card",
      slug: "steam-wallet-card",
      description:
        "Add funds to your Steam Wallet to buy games, DLC, and in-game items. Delivered as a digital code.",
      imageUrl:
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
      platform: "Steam",
      categoryId: steam.id,
      isFeatured: true,
      sortOrder: 1,
      variants: {
        create: [
          { label: "$10", price: 10, sortOrder: 1 },
          { label: "$25", price: 25, sortOrder: 2 },
          { label: "$50", price: 50, sortOrder: 3 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Xbox Gift Card",
      slug: "xbox-gift-card",
      description:
        "Spend on games, apps, movies and more across Xbox and the Microsoft Store. Digital code delivery.",
      imageUrl:
        "https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=800&q=80",
      platform: "Xbox",
      categoryId: xbox.id,
      isFeatured: true,
      sortOrder: 1,
      variants: {
        create: [
          { label: "$10", price: 10, sortOrder: 1 },
          { label: "$25", price: 25, sortOrder: 2 },
          { label: "$50", price: 50, sortOrder: 3, inStock: false },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Cyber Adventure",
      slug: "cyber-adventure",
      description:
        "A neon-soaked open-world RPG. Choose your edition below — Deluxe includes the season pass.",
      imageUrl:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      platform: "PC",
      categoryId: games.id,
      isFeatured: true,
      sortOrder: 1,
      variants: {
        create: [
          { label: "Standard Edition", price: 29.99, sortOrder: 1 },
          { label: "Deluxe Edition", price: 49.99, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Galactic Racers",
      slug: "galactic-racers",
      description:
        "High-speed anti-gravity racing across the galaxy. Cross-play on PC and Xbox.",
      imageUrl:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      platform: "Xbox",
      categoryId: games.id,
      sortOrder: 2,
      variants: {
        create: [
          { label: "Standard Edition", price: 19.99, sortOrder: 1 },
          { label: "Deluxe Edition", price: 34.99, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Shadow Legends",
      slug: "shadow-legends",
      description:
        "A dark fantasy action-RPG. Includes base game and the Ascension expansion in Deluxe.",
      imageUrl:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      platform: "PC",
      categoryId: games.id,
      sortOrder: 3,
      variants: {
        create: [
          { label: "Standard Edition", price: 24.99, sortOrder: 1 },
          { label: "Deluxe Edition", price: 44.99, sortOrder: 2 },
        ],
      },
    },
  });

  // --- Store settings (singleton) ---
  const existingSettings = await prisma.storeSettings.findFirst();
  if (!existingSettings) {
    await prisma.storeSettings.create({
      data: {
        storeName: "PixelVault",
        whatsappNumber: "212600000000",
        whatsappGreeting: "Hello! I'd like to order:",
        currency: "MAD",
      },
    });
  }

  // --- Admin user ---
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error("SEED_ADMIN_PASSWORD env var is required for seeding");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`✅ Seed complete. Admin login: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
