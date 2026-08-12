import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/requireAdmin";
import * as productService from "../services/productService";
import { ProductPatchSchema, RestockSchema } from "../validation/schemas";

export const productsRouter = Router();

productsRouter.get("/products", asyncHandler(async (_req, res) => {
  res.json(await productService.listProducts());
}));

productsRouter.get("/products/:id", asyncHandler(async (req, res) => {
  res.json(await productService.getProduct(req.params.id));
}));

productsRouter.patch("/products/:id", requireAdmin, asyncHandler(async (req, res) => {
  const patch = ProductPatchSchema.parse(req.body);
  res.json(await productService.patchProduct(req.params.id, patch));
}));

productsRouter.post("/products/:id/restock", requireAdmin, asyncHandler(async (req, res) => {
  const { cases } = RestockSchema.parse(req.body);
  res.json(await productService.restockProduct(req.params.id, cases));
}));
