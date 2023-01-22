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
          const { role } = req.query || "";
          let drivers;
          const page = Number(req.query.page) || 1;
          const pageSize = Number(req.query.size) || 10;
          const totalData = await prisma.user.count({
            where: {
              role: role,
              OR: [
                { name: { contains: search as string } },
                { email: { contains: search as string } },
              ],
            },
          });
          const totalPage = Math.ceil(totalData / pageSize);
          drivers = await prisma.user.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
              role: role,
              OR: [
                { name: { contains: search as string } },
                { email: { contains: search as string } },
              ],
            },
            select: { id: true, email: true, name: true, role: true },
          });

          res
            .status(200)
            .json({ data: drivers, meta: { totalData, totalPage } });
          break;

        case "POST":
          const { name, email, password, role: roleBody } = req.body;
          const driver = await prisma.user.create({
            data: { name, email, password, role: roleBody },
          });
          if (driver) {
            res.status(201).json({ data: driver });
          } else {
            res.status(400).json({ data: driver });
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
