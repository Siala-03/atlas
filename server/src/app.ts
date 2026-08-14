import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { healthRouter } from "./routes/health.routes";
import { productsRouter } from "./routes/products.routes";
import { ordersRouter } from "./routes/orders.routes";
import { paymentsRouter } from "./routes/payments.routes";
import { portalRouter } from "./routes/portal.routes";

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.PUBLIC_APP_URL ?? "http://localhost:5173").
  split(",").
  map((origin) => origin.trim());
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.use(healthRouter);
  app.use("/api", productsRouter);
  app.use("/api", ordersRouter);
  app.use("/api", paymentsRouter);
  app.use("/api", portalRouter);

  app.use(errorHandler);

  return app;
}
