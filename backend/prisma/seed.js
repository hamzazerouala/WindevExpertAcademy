const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    const course = await prisma.course.create({
      data: {
        title: { fr: 'Cours de démonstration', en: 'Demo Course', ar: 'دورة تجريبية' },
        description: { fr: 'Description de test', en: 'Test description', ar: 'وصف تجريبي' },
        accessType: 'PREMIUM',
        thumbnail: 'https://windevexpert.online/favicon.svg',
        published: true,
        sections: {
          create: [{
            title: { fr: 'Section 1', en: 'Section 1', ar: 'القسم 1' },
            order: 1,
            lessons: {
              create: [{
                title: { fr: 'Leçon vidéo', en: 'Video Lesson', ar: 'درس فيديو' },
                type: 'VIDEO',
                duration: 120,
                isFree: true
              }]
            }
          }]
        }
      }
    })
    console.log('Seeded course id:', course.id)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
