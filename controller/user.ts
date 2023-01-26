import { AddUserBody } from "@/api/user";
import prisma from "@/lib/prisma";
import { Role } from "@/types/global";
export async function getUsers(
  search: string,
  page: number,
  size: number,
  role: Role
) {
  return await prisma.user.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      role: role as Role,
      OR: [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
      ],
    },
    select: { id: true, email: true, name: true, role: true },
  });
}

export async function addUser({ name, email, password, role }: AddUserBody) {
  return await prisma.user.create({
    data: { name, email, password, role },
  });
}
