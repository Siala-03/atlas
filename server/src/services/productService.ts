import { prisma } from "../db";
import { NotFoundError } from "../errors";

export function listProducts() {
  return prisma.product.findMany({ orderBy: { name: "asc" } });
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError("Product");
  return product;
}

export async function patchProduct(id: string, patch: { casePrice?: number; stockUnits?: number; lowStockThreshold?: number }) {
  await getProduct(id);
  return prisma.product.update({ where: { id }, data: patch });
}

export async function restockProduct(id: string, cases: number) {
  const product = await getProduct(id);
  return prisma.product.update({ where: { id }, data: { stockUnits: { increment: cases * product.unitsPerCase } } });
}
