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
        case "PATCH":
          let requestData;
          const { requestId, action } = req.body;
          if (action === "approve") {
            requestData = await prisma.passenger.update({
              where: { id: Number(requestId) },
              data: { approved: 1 },
            });
          } else {
            requestData = await prisma.passenger.update({
              where: { id: Number(requestId) },
              data: { approved: 2 },
            });
          }
          res.status(200).json({ data: requestData });
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
