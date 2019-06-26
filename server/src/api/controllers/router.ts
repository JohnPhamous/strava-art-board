import express from "express";
import multer from "multer";
import controller from "./controller";

const upload = multer({ dest: "uploads/" });

export default express
  .Router()
  .post("/", upload.array("routeData"), controller.convert);
