import { Prisma, PrismaClient } from "@prisma/client";

export function PrismaInit(): PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
> {
  return new PrismaClient();
}
