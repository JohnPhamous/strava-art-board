import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const errorMessage = `${err.status || 500} Error: ${err.message}`;

  console.error(errorMessage);
  res.status(err.status || 500);
  res.send(errorMessage);
}
