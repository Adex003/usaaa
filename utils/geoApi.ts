import { GeoApiResponse } from "../types";
import axios from "axios";

const geoApi = async (ipAddress: string): Promise<GeoApiResponse> => {
  const url = `https://freeipapi.com/api/json/${ipAddress}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data) {
      return {
        ip: data.ipAddress,
        city: data.cityName,
        region: data.regionName,
        country: data.countryName,
        zipCode: data.zipCode,
        loc: `${data.latitude},${data.longitude}`,
        org: data.isp,
        timezone: data.timeZone,
      };
    } else {
      return { error: "No data received from the API" };
    }
  } catch (error: any) {
    return { error: `Unable to fetch geo information: ${error.message}` };
  }
};

export default geoApi;
