import { prisma } from "../../config/prisma.js";
import type { CreateUserMetaDTO } from "../../types/auth.types.js";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (meta: CreateUserMetaDTO) => {
  return await prisma.user.create({
    data: {
      email: meta.email,
      firstName: meta.firstName,
      lastName: meta.lastName,
      password: meta.hashedPassword,
      emailVerified: true,
    },
  });
};
