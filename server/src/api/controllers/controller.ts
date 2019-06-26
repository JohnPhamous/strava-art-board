const tj = require("@mapbox/togeojson");
import { Response } from "express";
import fs from "fs";
import { DOMParser } from "xmldom";
const parse = require("tcx");
const rimraf = require("rimraf");

let previousPayload = {};
export class Controller {
  convert(req: any, res: Response): void {
    const filteredFiles = req.files.reduce(_filterFiles, {
      gpx: [],
      tcx: []
    });

    const convertedGpxFiles = convertGpx(filteredFiles["gpx"]);
    const convertedTcxFiles = convertTcx(filteredFiles["tcx"]);

    const responsePayload = [...convertedGpxFiles, ...convertedTcxFiles];
    previousPayload = responsePayload;

    // Clean up uploads directory
    rimraf("./uploads", () => console.log("Cleaned Uploads"));

    res.status(200).send(responsePayload);
  }
  getPreviousPayload(_req: any, res: Response) {
    res.status(200).json(previousPayload);
  }
}
export default new Controller();

function _filterFiles(acc: any, file: any) {
  const { originalname } = file;
  const extenstion = originalname.split(".")[1];

  switch (extenstion) {
    case "gpx":
      acc["gpx"].push(file);
      break;
    case "tcx":
      acc["tcx"].push(file);
      break;
    default:
      throw new Error(`Unexpected file type ${file.mimetype}`);
  }
  return acc;
}

function convertGpx(gpxFiles: any) {
  return gpxFiles.map((file: any) => {
    const gpx = new DOMParser().parseFromString(
      fs.readFileSync(`${file.path}`, "utf8")
    );
    return tj.gpx(gpx, { styles: true });
  });
}

function convertTcx(tcxFiles: any) {
  return tcxFiles.map((file: any) => {
    const tcx = new DOMParser().parseFromString(
      fs.readFileSync(`${file.path}`, "utf8")
    );
    return parse(tcx);
  });
}
