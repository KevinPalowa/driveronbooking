import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaInit } from "@/lib/prisma";

/* type User = { id: number; email: string; password: string; name?: string }; */
type ResponseData = {
  meta: { status: number; message?: string };
  data?: { id: number; email: string; name: string | null; token: string };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const prisma = PrismaInit();
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { email, password },
      select: { id: true, email: true, name: true },
    });
    if (user) {
      const token = jwt.sign({ userId: user.id }, "secretkey", {
        expiresIn: 10,
      });
      res.status(200).json({
        meta: { status: 200, message: "berhasil login" },
        data: { ...user, token },
      });
    } else {
      res.status(404).json({
        meta: { status: 404, message: "Your email is not registered" },
      });
    }
  }
}
