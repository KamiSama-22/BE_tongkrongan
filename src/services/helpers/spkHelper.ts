import prisma from "../../config/prisma";
import { getTenantScores } from "../spkTransformer";

export const getRawData = async () => {
  const tenants = await prisma.tenant.findMany({ where: { status: 'APPROVED' } });
  return await Promise.all(tenants.map(async (t) => {
    const s = await getTenantScores(t.id);
    return { nama: t.nama, ...s };
  }));
};