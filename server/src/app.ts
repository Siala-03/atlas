import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { healthRouter } from "./routes/health.routes";
import { productsRouter } from "./routes/products.routes";
import { accountsRouter } from "./routes/accounts.routes";
import { ordersRouter } from "./routes/orders.routes";
import { paymentsRouter } from "./routes/payments.routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.PUBLIC_APP_URL ?? "http://localhost:5173" }));
  app.use(express.json());

  app.use(healthRouter);
  app.use("/api", productsRouter);
  app.use("/api", accountsRouter);
  app.use("/api", ordersRouter);
  app.use("/api", paymentsRouter);

  app.use(errorHandler);

  return app;
}
