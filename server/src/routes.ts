import { Application } from "express";
import router from "./api/controllers/router";

export default function routes(app: Application): void {
  app.use("/api/", router);
}
