import { handleProxyRequest } from "@/handleProxyRequest";
import { OpenapiDocument } from "from-anywhere";
import { readJsonFile } from "from-anywhere/node";
import { existsSync } from "fs";
import path from "path";

export const handleOpenapiRequest = async (request: Request) => {
  const url = request.url;
  const urlObject = new URL(url);

  const [tld, domain, subdomain] = urlObject.hostname.split(".").reverse();

  const key =
    urlObject.hostname === "localhost"
      ? process.env.LOCALHOST_TEST_KEY
      : subdomain || domain;

  const openapiPath = path.resolve(".", "public", key + ".json");

  const hasOpenapi = existsSync(openapiPath);

  const defaultResponseInit = {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      // "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  };

  const openapi = await readJsonFile<OpenapiDocument>(openapiPath);

  return Response.json(openapi);
};
