import prisma from "@/lib/prisma";
import { AddRouteBody } from "@/types/route";

export async function getRouteByPassengerId(
  search: string,
  page: number,
  size: number,
  id: number
) {
  const routes = await prisma.route.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      destination: { contains: search as string },
    },
    include: {
      User: { select: { id: true, name: true } },
    },
  });
  const routesWithPassengerStatus = await Promise.all(
    routes.map(async (route) => {
      const passenger = await prisma.passenger.findFirst({
        where: {
          routeId: route.id,
          passengerId: id,
        },
        select: { approved: true },
      });
      return {
        ...route,
        status: passenger ? passenger.approved : null,
      };
    })
  );
  return routesWithPassengerStatus;
}

export async function getRoutes(search: string, page: number, size: number) {
  return await prisma.route.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      destination: { contains: search as string },
    },
    include: {
      User: { select: { id: true, name: true } },
    },
  });
}

export async function addRoute({
  destination,
  driverId,
  departureTime,
  capacity,
  estimation,
}: AddRouteBody) {
  return await prisma.route.create({
    data: {
      destination,
      estimation,
      capacity,
      departureTime,
      User: { connect: { id: Number(driverId) } },
    },
  });
}

export async function deleteRoute(id: number) {
  return await prisma.route.delete({
    where: { id: Number(id) },
  });
}
