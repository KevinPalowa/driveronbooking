import { faker } from "@faker-js/faker";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  faker.locale = "id_ID";

  for (let i = 0; i < 100; i++) {
    const email = faker.internet.email();
    const name = faker.name.fullName();
    const password = faker.internet.password();
    const role: Role = faker.helpers.arrayElement([
      "admin",
      "employee",
      "driver",
    ]);
    await prisma.user.create({
      data: {
        email,
        name,
        password,
        role,
      },
    });
  }
  const driversId = await prisma.user.findMany({
    where: { role: "driver" },
    select: { id: true },
  });
  for (let i = 0; i < 100; i++) {
    const destination = faker.address.cityName();
    const capacity = faker.helpers.arrayElement([8, 9, 10, 11, 12, 13, 14]);
    const estimation = faker.helpers.arrayElement(["1 jam", "2 jam", "3 jam"]);
    const departureTime = faker.helpers.arrayElement([
      "08:00",
      "09:00",
      "09:00",
    ]);
    const driverId = faker.helpers.arrayElement(driversId);

    await prisma.route.create({
      data: {
        destination,
        capacity,
        estimation,
        departureTime,
        driverId: driverId.id,
      },
    });
  }
  console.log("Seeding complete!");
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
