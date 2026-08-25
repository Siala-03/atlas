import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireRole } from "../middleware/requireAdmin";
import { verifyToken } from "../lib/adminAuth";
import * as productService from "../services/productService";
import { ProductCreateSchema, ProductPatchSchema, RestockSchema } from "../validation/schemas";

export const productsRouter = Router();

// Unpublished products are only included for authenticated staff/admin
// sessions (the portal), so the public storefront never sees them.
productsRouter.get("/products", asyncHandler(async (req, res) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  const isStaff = !!verifyToken(token);
  res.json(await productService.listProducts({ includeUnpublished: isStaff }));
}));

productsRouter.get("/products/:id", asyncHandler(async (req, res) => {
  res.json(await productService.getProduct(req.params.id));
}));

productsRouter.post("/products", requireRole("admin"), asyncHandler(async (req, res) => {
  const data = ProductCreateSchema.parse(req.body);
  res.status(201).json(await productService.createProduct(data));
}));

productsRouter.patch("/products/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const patch = ProductPatchSchema.parse(req.body);
  res.json(await productService.patchProduct(req.params.id, patch));
}));

productsRouter.post("/products/:id/restock", requireRole("admin"), asyncHandler(async (req, res) => {
  const { units } = RestockSchema.parse(req.body);
  res.json(await productService.restockProduct(req.params.id, units));
}));
