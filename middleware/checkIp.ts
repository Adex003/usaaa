import MobileDetect from "mobile-detect";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import geoApi from "../utils/geoApi";

const middleware = async (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) => {
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = await geoApi(String(ip).split(",")[0]);

  const country = geo?.country;

  console.log(`GEO:`, geo);

  const countries =
    process.env.ALLOWED_COUNTRIES && process.env.ALLOWED_COUNTRIES.split(",");
  const md = new MobileDetect(req.headers["user-agent"] as string);

  const isBot = md.is("bot");

  if (isBot || (countries && (!country || !countries.includes(country)))) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,
  };
};

export default middleware;
