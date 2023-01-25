import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

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
          if (user?.role === "employee") {
            route = await prisma.route.findMany({
              where: {
                passenger: {
                  some: { passengerId: Number(id) },
                },
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
            res.status(200).json({ data: route });
          }
          break;
        case "DELETE":
          const driver = await prisma.route.delete({
            where: { id: Number(id) },
          });
          if (driver) {
            res.status(200).json({ meta: { message: "Delete success" } });
            break;
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
