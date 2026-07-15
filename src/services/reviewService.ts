import prisma from "../config/prisma";
import { Kebersihan } from "@prisma/client";

// Interface sudah benar
interface CreateReviewDTO {
  tenantId: number;
  userId: number;
  rating: number;
  kebersihan: Kebersihan;
  komentar?: string;
}

class ReviewService {
  getByUserId(id: any) {
    throw new Error("Method not implemented.");
  }
  async getAll() {
    return prisma.review.findMany({
      include: {
        tenant: { select: { id: true, nama: true } },
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getByTenantId(tenantId: number) {
    return prisma.review.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async checkUserReviewExists(userId: number, tenantId: number) {
    return await prisma.review.findFirst({
        where: { userId, tenantId }
    });
}
  async getById(id: number) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { tenant: true, user: true },
    });

    if (!review) throw new Error("Review tidak ditemukan");
    return review;
  }

  // PENTING: Gunakan interface CreateReviewDTO, jangan 'any'
  async create(data: CreateReviewDTO) {
    return await prisma.review.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        rating: data.rating,
        kebersihan: data.kebersihan,
        komentar: data.komentar,
      },
    });
  }

  async update(id: number, data: Partial<CreateReviewDTO>) {
    return prisma.review.update({
      where: { id },
      data,
    });
  }

  async updateBalasan(id: number, balasan: string) {
    return prisma.review.update({
      where: { id },
      data: { balasan },
    });
  }

  async delete(id: number) {
    return prisma.review.delete({
      where: { id },
    });
  }
}

export default new ReviewService();