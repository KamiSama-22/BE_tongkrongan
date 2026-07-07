import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt";
import { Role } from "@prisma/client";

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  role: Role;
}

interface LoginDTO {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterDTO) {
    const exist = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });

    if (exist) {
      throw new Error("Email atau Username sudah digunakan");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
  data: {
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: data.role
  }
});

return {
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
};
  }

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user) {
      throw new Error("Email tidak ditemukan");
    }

    const match = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!match) {
      throw new Error("Password salah");
    }

    const token = generateToken({
      id: user.id,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }
}

export default new AuthService();