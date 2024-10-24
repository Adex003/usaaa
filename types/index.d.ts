import { NextApiRequest } from "next";


export interface ExtendedRequest extends NextApiRequest {
    files: any;
}

export interface GeoApiResponse {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    zipCode?: string;
    loc?: string;
    org?: string;
    timezone?: string;
    error?: string;
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    zipCode?: string;
    loc?: string;
    org?: string;
    timezone?: string;
    error?: string;
  }