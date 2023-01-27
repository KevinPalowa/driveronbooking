import { AddUserBody } from "@/api/user";
import prisma from "@/lib/prisma";
import { Role } from "@/types/global";
import { UserEditParams } from "@/types/user";
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
  const isExist = await prisma.user.findUnique({ where: { email } });
  if (isExist) {
    throw "Email already registered";
  }
  return await prisma.user.create({
    data: { name, email, password, role },
  });
}

export async function editUser(data: UserEditParams) {
  const userIsExist = await prisma.user.findUnique({
    where: { id: data.id },
  });
  const emailIsExist = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!userIsExist) {
    throw "User not found";
  } else if (emailIsExist && userIsExist.email !== data.email) {
    throw "Email already registered";
  }

  return await prisma.user.update({
    where: { id: Number(data.id) },
    data: { email: data.email, name: data.name },
  });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      RouteRequested: { include: { Route: { include: { User: true } } } },
      routes: true,
    },
  });
}
