import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { authorization } = req.headers;
  // Signed in
  if (authorization) {
    const token = jwt.verify(authorization, process.env.JWT_SECRET!);
    if (token) {
      switch (req.method) {
        case "GET":
          const page = Number(req.query.page) || 1;
          const pageSize = Number(req.query.size) || 10;
          const { search } = req.query || "";
          const totalData = await prisma.passenger.count({});
          const totalPage = Math.ceil(totalData / pageSize);
          const request = await prisma.passenger.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { User: true, Route: true },
            orderBy: { id: "desc" },
          });
          res
            .status(200)
            .json({ data: request, meta: { totalData, totalPage } });

          break;
        case "POST":
          const { routeId, passengerId } = req.body;
          const route = await prisma.route.findUnique({
            where: { id: routeId },
          });
          const currentPassengerCount = await prisma.passenger.count({
            where: { routeId },
          });
          const passengerAlreadyExist = await prisma.passenger.findFirst({
            where: { routeId, passengerId },
          });

          if (passengerAlreadyExist) {
            return res
              .status(400)
              .json({ meta: "Passenger is already on the route" });
          }
          console.log(currentPassengerCount, route?.capacity);
          if (currentPassengerCount < route!.capacity) {
            const driver = await prisma.passenger.create({
              data: { routeId, passengerId },
            });
            if (driver) {
              res.status(201).json({ data: driver });
            } else {
              res.status(400).json({ data: driver });
            }
          } else {
            return res.status(400).json({ error: "Route is full" });
          }
          break;
      }
    } else {
      res.status(400).json({ message: "Invalid JWT" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Please input token in authorization header" });
  }
}
