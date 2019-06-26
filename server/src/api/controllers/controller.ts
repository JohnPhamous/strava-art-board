const tj = require("@mapbox/togeojson");
import { Response } from "express";
import fs from "fs";
import { DOMParser } from "xmldom";

let previousPayload = {};
export class Controller {
  convert(req: any, res: Response): void {
    const filteredFiles = req.files.reduce(_filterFiles, {
      gpx: [],
      tcxgz: []
    });

    const convertedGpxFiles = convertGpx(filteredFiles["gpx"]);

    const responsePayload = [...convertedGpxFiles];
    previousPayload = responsePayload;
    res.status(200).send(responsePayload);
  }
  getPreviousPayload(_req: any, res: Response) {
    console.log("get /");
    res.status(200).json(previousPayload);
  }
}
export default new Controller();

function _filterFiles(acc: any, curr: any) {
  switch (curr.mimetype) {
    case "application/gpx+xml":
      acc["gpx"].push(curr);
      break;
    case "application/gzip":
      acc["tcxgz"].push(curr);
      break;
    default:
      throw new Error(`Unexpected file type ${curr.mimetype}`);
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

// function unzipGz() {}

// function convertTcx() {}
