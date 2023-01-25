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
        case "PATCH":
          const { email, name } = req.body;
          const user = await prisma.user.findUnique({
            where: { id: Number(id) },
          });
          if (user) {
            const changedUser = await prisma.user.update({
              where: { id: Number(id) },
              data: { email, name },
            });
            res
              .status(200)
              .json({ data: changedUser, meta: { message: "Delete success" } });
          }
          break;
        case "DELETE":
          const driver = await prisma.user.delete({
            where: { id: Number(id) },
          });
          if (driver) {
            res.status(200).json({ meta: { message: "Delete success" } });
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