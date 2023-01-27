import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { deleteRoute } from "@/controller/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { authorization } = req.headers;
  const { id } = req.query;
  // Signed in
  if (authorization) {
    const token = jwt.verify(authorization, process.env.JWT_SECRET!);
    if (token) {
      switch (req.method) {
        case "GET":
          let route;
          const user = await prisma.user.findUnique({
            // @ts-ignore: Unreachable code error
            where: { id: token.userId },
          });
          const page = Number(req.query.page) || 1;
          const pageSize = Number(req.query.size) || 10;
          const { search } = req.query || "";
          const totalData = await prisma.route.count({
            where: {
              passenger: {
                some: { passengerId: Number(id), approved: 1 },
              },
              destination: { contains: search?.toString() },
            },
          });
          const totalPage = Math.ceil(totalData / pageSize);
          if (user?.role === "employee") {
            route = await prisma.route.findMany({
              skip: (page - 1) * pageSize,
              take: pageSize,
              where: {
                passenger: {
                  some: { passengerId: Number(id), approved: 1 },
                },
                destination: { contains: search?.toString() },
              },
              include: {
                User: { select: { id: true, name: true } },
                passenger: { select: { approved: true } },
              },
            });
          } else if (user?.role === "driver") {
            route = await prisma.route.findMany({
              where: { driverId: Number(id) },
            });
          }
          if (route) {
            res
              .status(200)
              .json({ data: route, meta: { totalData, totalPage } });
          }
          break;
        case "DELETE":
          const driver = await deleteRoute(Number(id));
          if (driver) {
            res.status(204);
          }
          break;
        case "PATCH":
          const { capacity, destination, estimation, departureTime, driverId } =
            req.body;
          const editedRoute = await prisma.route.update({
            where: { id: Number(id) },
            data: {
              capacity: Number(capacity),
              destination,
              estimation,
              departureTime,
              User: { connect: { id: Number(driverId) } },
            },
          });
          res.status(200).json({ data: editedRoute });
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
