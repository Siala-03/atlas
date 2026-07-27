export class AppError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
  }
}

export class StockConflictError extends AppError {
  constructor(public unavailable: string[]) {
    super(409, "Some items are no longer available in the requested quantity", { unavailable });
  }
}
