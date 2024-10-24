import { createRouter } from "next-connect";
import multiparty from "multiparty";
import { NextApiResponse } from "next";
import { ExtendedRequest } from "../types";

const router = createRouter<ExtendedRequest, NextApiResponse>();

router.use((request, _response, next) => {
  const form = new multiparty.Form();

  form.parse(request, async (_err, fields, files) => {
    request.body = fields;
    request.files = files;
    await next();
  });
});

export const middleware = (
  request: ExtendedRequest,
  response: NextApiResponse
) => {
  return router.run(request, response);
};

export default router;
