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
          const { search } = req.query || "";
          let drivers;
          const page = Number(req.query.page) || 1;
          const pageSize = Number(req.query.size) || 10;
          const totalData = await prisma.route.count({
            where: {
              destination: { contains: search as string },
            },
          });
          const totalPage = Math.ceil(totalData / pageSize);
          drivers = await prisma.route.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
              destination: { contains: search as string },
            },
          });
          console.log("dipanggin", drivers);

          res
            .status(200)
            .json({ data: drivers, meta: { totalData, totalPage } });
          break;

        case "POST":
          const { destination, estimation, capacity, departureTime } = req.body;
          const driver = await prisma.route.create({
            data: { destination, estimation, capacity, departureTime },
          });
          if (driver) {
            res.status(201).json({ data: driver });
          } else {
            res.status(400).json({ data: driver });
          }
          break;

        case "DELETE":
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
