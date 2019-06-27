const tj = require("@mapbox/togeojson");
import { Response } from "express";
import fs from "fs";
import { DOMParser } from "xmldom";
import logger from "../../common/logger";
const parse = require("tcx");

let previousPayload = {};
export class Controller {
  convert(req: any, res: Response): void {
    logger.info(`Payload Size: ${req.files.length}`);
    let filteredFiles = {
      gpx: [],
      tcx: []
    };
    let errorMessage = "";

    try {
      filteredFiles = req.files.reduce(_filterFiles, filteredFiles);
    } catch (e) {
      errorMessage = e.toString();
      logger.error(e);
    }

    const convertedGpxFiles = convertGpx(filteredFiles["gpx"]);
    logger.info(`Number of GPX Files: ${convertedGpxFiles.length}`);
    const convertedTcxFiles = convertTcx(filteredFiles["tcx"]);
    logger.info(`Number of TCX Files: ${convertedTcxFiles.length}`);

    const responsePayload = {
      data: [...convertedGpxFiles, ...convertedTcxFiles],
      errorMessage
    };
    previousPayload = responsePayload;
    logger.info(`Returned Activities: ${responsePayload.data.length}`);

    removeUploads(filteredFiles);
    res.status(200).send(responsePayload);
  }
  getPreviousPayload(_req: any, res: Response) {
    res.status(200).json(previousPayload);
  }
}
export default new Controller();

function _filterFiles(acc: any, file: any) {
  const { originalname } = file;
  const filenameTokens = originalname.split(".");
  const extenstion = filenameTokens[filenameTokens.length - 1];

  switch (extenstion) {
    case "gpx":
      acc["gpx"].push(file);
      break;
    case "tcx":
      acc["tcx"].push(file);
      break;
    default:
      throw new Error(`Unsupported file type .${file.mimetype.split("/")[1]}`);
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

const removeUploads = (files: any) => {
  const keys = Object.keys(files);

  keys.forEach((key: any) => {
    const fileType = files[key];

    fileType.forEach((fileObject: any) => {
      const path = fileObject.path;
      fs.unlink(path, err => {
        if (err) throw err;
      });
    });
  });
};
