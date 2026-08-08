import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lingora.test" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@lingora.test",
      passwordHash,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@lingora.test" },
    update: {},
    create: {
      name: "Sara Student",
      email: "student@lingora.test",
      passwordHash,
      role: "USER",
    },
  });

  const english = await prisma.course.upsert({
    where: { slug: "english-foundations" },
    update: { category: "Skills" },
    create: {
      title: "English Foundations",
      slug: "english-foundations",
      description:
        "Build everyday English with short text lessons and voice narration. Perfect for beginners who want clear explanations and a certificate at the end.",
      language: "English",
      level: "A1",
      category: "Skills",
      priceCents: 4900,
      thumbnail: "https://images.unsplash.com/photo-1456513080880-7d93aaa172bb?w=800&q=80",
      featured: true,
      published: true,
      lessons: {
        create: [
          {
            title: "Greetings and Introductions",
            order: 1,
            durationMin: 8,
            body: `Welcome to English Foundations.

In this lesson you will learn how to greet people and introduce yourself.

Hello. My name is Alex. Nice to meet you.
Hi. I am Jordan. Nice to meet you too.

Useful phrases:
- Good morning.
- Good afternoon.
- How are you?
- I am fine, thank you.

Practice saying your name clearly. Confidence grows with repetition.`,
          },
          {
            title: "Numbers and Time",
            order: 2,
            durationMin: 10,
            body: `Numbers help you talk about time, prices, and plans.

One, two, three, four, five.
Six, seven, eight, nine, ten.

What time is it? It is three o'clock.
The class starts at nine in the morning.

Remember: practice reading numbers aloud with the voice player.`,
          },
          {
            title: "Daily Routines",
            order: 3,
            durationMin: 12,
            body: `A daily routine is what you do every day.

I wake up at seven.
I eat breakfast.
I go to work or school.
In the evening I relax and study English.

Describe your routine in simple sentences. Keep your verbs in the present tense.`,
          },
        ],
      },
    },
  });

  const spanish = await prisma.course.upsert({
    where: { slug: "spanish-essentials" },
    update: { category: "Business" },
    create: {
      title: "Spanish Essentials",
      slug: "spanish-essentials",
      description:
        "Learn core Spanish phrases through readable lessons with generated voice. Finish the course to earn your Lingora certificate.",
      language: "Spanish",
      level: "A1",
      category: "Business",
      priceCents: 5900,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      featured: true,
      published: true,
      lessons: {
        create: [
          {
            title: "Hola and Basics",
            order: 1,
            durationMin: 9,
            body: `Bienvenido a Spanish Essentials.

Hola means hello.
Gracias means thank you.
Por favor means please.
Adiós means goodbye.

Start every practice session by saying: Hola, me llamo... and add your name.`,
          },
          {
            title: "Ordering Food",
            order: 2,
            durationMin: 11,
            body: `In a café you can say:

Quiero un café, por favor.
Quiero agua.
La cuenta, por favor.

Listen to the narration, then pause and repeat each line slowly.`,
          },
        ],
      },
    },
  });

  const french = await prisma.course.upsert({
    where: { slug: "french-starter" },
    update: { category: "Strategy" },
    create: {
      title: "French Starter",
      slug: "french-starter",
      description:
        "A gentle introduction to French vocabulary and sentence patterns, read aloud for pronunciation support.",
      language: "French",
      level: "A2",
      category: "Strategy",
      priceCents: 5500,
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      featured: false,
      published: true,
      lessons: {
        create: [
          {
            title: "Bonjour",
            order: 1,
            durationMin: 8,
            body: `Bonjour! Welcome to French Starter.

Bonjour means hello or good morning.
Merci means thank you.
Oui means yes. Non means no.

Repeat after the voice: Bonjour, je m'appelle...`,
          },
        ],
      },
    },
  });

  const extras = [
    {
      slug: "project-delivery-basics",
      title: "Project Delivery Basics",
      category: "Projects",
      language: "English",
      level: "B1",
      priceCents: 6900,
      featured: true,
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      description:
        "Plan, track, and communicate project work with clear text lessons and voice narration.",
    },
    {
      slug: "innovation-mindset",
      title: "Innovation Mindset",
      category: "Innovation",
      language: "English",
      level: "B1",
      priceCents: 6400,
      featured: false,
      thumbnail:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      description:
        "Learn how to frame ideas, test assumptions, and communicate innovation clearly.",
    },
    {
      slug: "finance-fundamentals",
      title: "Finance Fundamentals",
      category: "Finance",
      language: "English",
      level: "A2",
      priceCents: 7200,
      featured: false,
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      description:
        "Core money concepts explained in plain language with narrated lessons.",
    },
    {
      slug: "governance-essentials",
      title: "Governance Essentials",
      category: "Governance",
      language: "English",
      level: "B2",
      priceCents: 7800,
      featured: false,
      thumbnail:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      description:
        "Understand roles, accountability, and decision frameworks in organizations.",
    },
    {
      slug: "sustainable-practices",
      title: "Sustainable Practices",
      category: "Sustain.",
      language: "English",
      level: "B1",
      priceCents: 6100,
      featured: false,
      thumbnail:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      description:
        "Practical sustainability concepts for teams, written simply and read aloud.",
    },
  ] as const;

  for (const course of extras) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: { category: course.category, published: true },
      create: {
        ...course,
        published: true,
        lessons: {
          create: [
            {
              title: "Introduction",
              order: 1,
              durationMin: 10,
              body: `Welcome to ${course.title}.

This course uses clear text lessons with voice narration so you can read and listen at your own pace.

Complete every lesson to earn your Lingora certificate.`,
            },
          ],
        },
      },
    });
  }

  await prisma.languageTest.upsert({
    where: { slug: "english-placement" },
    update: {},
    create: {
      title: "English Placement Test",
      slug: "english-placement",
      description:
        "A short multiple-choice test to estimate your English level and recommend a course.",
      language: "English",
      published: true,
      priceCents: 0,
      questions: {
        create: [
          {
            order: 1,
            prompt: 'Choose the correct greeting for the morning:',
            optionsJson: JSON.stringify([
              "Good night",
              "Good morning",
              "See you later",
              "Goodbye",
            ]),
            correctIndex: 1,
          },
          {
            order: 2,
            prompt: '“I ___ a student.”',
            optionsJson: JSON.stringify(["is", "are", "am", "be"]),
            correctIndex: 2,
          },
          {
            order: 3,
            prompt: "Which word means the opposite of 'hot'?",
            optionsJson: JSON.stringify(["warm", "cold", "big", "fast"]),
            correctIndex: 1,
          },
          {
            order: 4,
            prompt: "Select the correct sentence:",
            optionsJson: JSON.stringify([
              "She go to school.",
              "She goes to school.",
              "She going to school.",
              "She goed to school.",
            ]),
            correctIndex: 1,
          },
          {
            order: 5,
            prompt: "What does 'thank you' express?",
            optionsJson: JSON.stringify([
              "Anger",
              "Gratitude",
              "Confusion",
              "Hunger",
            ]),
            correctIndex: 1,
          },
        ],
      },
    },
  });

  await prisma.languageTest.upsert({
    where: { slug: "spanish-placement" },
    update: {},
    create: {
      title: "Spanish Placement Test",
      slug: "spanish-placement",
      description: "Quick Spanish check to place you in the right starting course.",
      language: "Spanish",
      published: true,
      priceCents: 0,
      questions: {
        create: [
          {
            order: 1,
            prompt: "What does 'Hola' mean?",
            optionsJson: JSON.stringify(["Goodbye", "Please", "Hello", "Thanks"]),
            correctIndex: 2,
          },
          {
            order: 2,
            prompt: "How do you say 'thank you' in Spanish?",
            optionsJson: JSON.stringify(["Por favor", "Gracias", "Adiós", "Sí"]),
            correctIndex: 1,
          },
          {
            order: 3,
            prompt: "'Agua' means:",
            optionsJson: JSON.stringify(["Bread", "Water", "Milk", "Coffee"]),
            correctIndex: 1,
          },
        ],
      },
    },
  });

  console.log("Seeded users:", { admin: admin.email, student: student.email });
  console.log("Seeded courses:", english.slug, spanish.slug, french.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
