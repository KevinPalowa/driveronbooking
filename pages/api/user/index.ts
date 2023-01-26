import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { Role } from "@/types/global";
import { addUser, getUsers } from "@/controller/user";
import Joi from "joi";
import { AddUserBody } from "@/api/user";

const userBodySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
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
          let users;
          const page = Number(req.query.page) || 1;
          const pageSize = Number(req.query.size) || 10;
          const totalData = await prisma.user.count({
            where: {
              role: role as Role,
              OR: [
                { name: { contains: search as string } },
                { email: { contains: search as string } },
              ],
            },
          });
          const totalPage = Math.ceil(totalData / pageSize);
          users = await getUsers(
            search as string,
            page,
            pageSize,
            role as Role
          );
          res.status(200).json({ data: users, meta: { totalData, totalPage } });
          break;

        case "POST":
          const { error, value } = userBodySchema.validate(req.body);
          if (error) {
            res.status(400).json({ message: error });
          } else {
            const driver = await addUser(value);
            res.status(201).json({ data: driver });
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
