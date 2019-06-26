import express from "express";
import { Application } from "express";
import http from "http";
import path from "path";
import errorHandler from "../api/middlewares/error.handler";

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + "/../..");
    app.set("appPath", root + "client");
    app.use(errorHandler);
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);

    return this;
  }

  listen(p: string | number = process.env.PORT || 3000): Application {
    const welcome = (port: string | number) => () =>
      console.log(
        `Running in ${process.env.NODE_ENV ||
          "development"} at: http://localhost:${port}`
      );
    http.createServer(app).listen(p, welcome(p));

    return app;
  }
}
