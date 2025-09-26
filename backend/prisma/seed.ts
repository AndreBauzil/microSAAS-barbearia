// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.appointment.deleteMany();
  console.log('Agendamentos antigos deletados.');

  await prisma.service.deleteMany();
  console.log('Serviços antigos deletados.');

  await prisma.service.createMany({
    data: [
      { name: 'Corte de Cabelo', price: 50.00, duration: 30 },
      { name: 'Barba Terapia', price: 45.00, duration: 30 },
      { name: 'Corte e Barba', price: 90.00, duration: 60 },
      { name: 'Acabamento (Pezinho)', price: 20.00, duration: 15 },
      { name: 'Hidratação Capilar', price: 60.00, duration: 45 },
      { name: 'Luzes / Platinado', price: 150.00, duration: 90 },
    ],
  });
  console.log('Novos serviços criados com sucesso.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })