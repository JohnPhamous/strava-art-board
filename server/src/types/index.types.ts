export interface ResponsePayload {
  data: any[];
  errorMessage: string;
}

export interface GeoJson {
  type: string;
  feature: Feature[];
  geometry: Geometry;
}

export interface Feature {
  type: string;
  properties: {
    name: string;
    type: string;
    time: string;
    coordTimes: any[];
  };
}

export interface Geometry {
  type: string;
  coordinates: any;
}

export interface SupportedFileTypes {
  gpx: any[];
  tcx: any[];
}
