import { Response } from "express";

export class Controller {
  convert(req: any, res: Response): void {
    console.log(req.files);
    const files: any[] = req.files;
    const filteredFiles = files.reduce(_filterFiles, { gpx: [], tcxgz: [] });
    res.status(200).send(filteredFiles);
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
  }
  return acc;
}
