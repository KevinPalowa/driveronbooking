import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { addRoute, getRouteByPassengerId, getRoutes } from "@/controller/route";
import Joi from "joi";

const routeBodySchema = Joi.object({
  capacity: Joi.number().required(),
  destination: Joi.string().required(),
  estimation: Joi.string().required(),
  departureTime: Joi.string().required(),
  driverId: Joi.number().required(),
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
          let routes;
          const user = await prisma.user.findUnique({
            // @ts-ignore: Unreachable code error
            where: { id: token.userId },
          });
          const page = Number(req.query.page) || 1;
          const pageSize = Number(req.query.size) || 10;
          const totalData = await prisma.route.count({
            where: {
              destination: { contains: search as string },
            },
          });
          const totalPage = Math.ceil(totalData / pageSize);
          if (user?.role === "employee") {
            routes = await getRouteByPassengerId(
              search as string,
              page,
              pageSize,
              user.id
            );
          } else {
            routes = await getRoutes(search as string, page, pageSize);
          }
          res
            .status(200)
            .json({ data: routes, meta: { totalData, totalPage } });
          break;

        case "POST":
          const { error, value } = routeBodySchema.validate(req.body);

          if (error) {
            res.status(400).json({ message: error });
          } else {
            const route = addRoute(value);
            res.status(201).json({ data: route });
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
