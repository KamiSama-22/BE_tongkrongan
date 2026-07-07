import prisma from "../config/prisma";

class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    return user;
  }

  async deleteUser(id: number) {
    await prisma.user.delete({
      where: { id },
    });

    return {
      message: "User berhasil dihapus",
    };
  }
}

export default new UserService();