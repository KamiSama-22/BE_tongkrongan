import prisma from "../config/prisma";
import { Kebersihan } from "@prisma/client";

interface CreateReviewDTO {
  tenantId: number;
  userId: number;
  rating: number;
  kebersihan: Kebersihan;
  komentar?: string;
}

class ReviewService {
  async getAll() {
    return prisma.review.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            nama: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: number) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        tenant: true,
        user: true,
      },
    });

    if (!review) {
      throw new Error("Review tidak ditemukan");
    }

    return review;
  }

  async create(data: CreateReviewDTO) {
    return prisma.review.create({
      data,
    });
  }

  async updateBalasan(id: number, balasan: string) {
    return prisma.review.update({
      where: { id },
      data: {
        balasan,
      },
    });
  }

  async delete(id: number) {
    return prisma.review.delete({
      where: { id },
    });
  }
}

export default new ReviewService();