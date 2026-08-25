import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireCustomer } from "../middleware/requireCustomer";
import * as customerService from "../services/customerService";
import * as orderService from "../services/orderService";
import { issueCustomerToken } from "../lib/customerAuth";
import { CustomerLoginSchema, CustomerSignupSchema } from "../validation/schemas";

export const customersRouter = Router();

customersRouter.post("/customers/signup", asyncHandler(async (req, res) => {
  const { name, email, password, phone } = CustomerSignupSchema.parse(req.body);
  const customer = await customerService.signup(name, email, password, phone);
  res.status(201).json({ token: issueCustomerToken(customer.id), customer });
}));

customersRouter.post("/customers/login", asyncHandler(async (req, res) => {
  const { email, password } = CustomerLoginSchema.parse(req.body);
  const customer = await customerService.login(email, password);
  if (!customer) {
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }
  res.json({
    token: issueCustomerToken(customer.id),
    customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, createdAt: customer.createdAt }
  });
}));

customersRouter.get("/customers/me", requireCustomer, asyncHandler(async (_req, res) => {
  res.json(await customerService.getCustomer(res.locals.customerId));
}));

customersRouter.get("/customers/me/orders", requireCustomer, asyncHandler(async (_req, res) => {
  res.json(await orderService.listOrdersForCustomer(res.locals.customerId));
}));
