import { prisma } from "../db";
import { NotFoundError } from "../errors";

function slugify(value: string): string {
  return value.
  normalize("NFD").
  replace(/[̀-ͯ]/g, "").
  toLowerCase().
  replace(/[^a-z0-9]+/g, "-").
  replace(/^-+|-+$/g, "");
}

export function listProducts(opts: {includeUnpublished?: boolean;} = {}) {
  return prisma.product.findMany({
    where: opts.includeUnpublished ? undefined : { published: true },
    orderBy: { name: "asc" }
  });
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError("Product");
  return product;
}

interface ProductPatch {
  name?: string;
  brand?: string;
  category?: string;
  subtype?: string | null;
  abv?: number;
  volume?: string;
  origin?: string;
  description?: string;
  casePrice?: number;
  unitPrice?: number;
  unitsPerCase?: number;
  stockUnits?: number;
  lowStockThreshold?: number;
  image?: string;
  published?: boolean;
}

export async function patchProduct(id: string, patch: ProductPatch) {
  await getProduct(id);
  return prisma.product.update({ where: { id }, data: patch });
}

export async function restockProduct(id: string, units: number) {
  await getProduct(id);
  return prisma.product.update({ where: { id }, data: { stockUnits: { increment: units } } });
}

interface ProductCreate {
  name: string;
  brand: string;
  category: string;
  subtype?: string;
  abv: number;
  volume: string;
  origin: string;
  description: string;
  casePrice: number;
  unitPrice: number;
  unitsPerCase: number;
  stockUnits: number;
  lowStockThreshold: number;
  image: string;
}

export async function createProduct(data: ProductCreate) {
  const base = `p-${slugify(`${data.brand} ${data.name}`)}`;
  let id = base;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { id } })) {
    id = `${base}-${suffix++}`;
  }
  return prisma.product.create({ data: { id, ...data } });
}
