import axios from "axios";
import { endpoint } from "./endpoint";

async function createRequest({ reqHeaders, params, authToken }) {
  if (authToken) {
    return axios.create({
      baseURL: endpoint.BASE_URL_STAGING,
      responseType: "json",
      crossdomain: true,
      headers: {
        "Content-Type": reqHeaders?.["Content-Type"] || "multipart/form-data",
        Authorization: "Bearer " + authToken,
        Accept: "application/json",
        ...reqHeaders,
      },
      params,
    });
  } else {
    return axios.create({
      baseURL: endpoint.BASE_URL_STAGING,
      responseType: "json",
      crossdomain: true,
      headers: {
        "Content-Type": reqHeaders?.["Content-Type"] || "multipart/form-data",
        Accept: "application/json",
        ...reqHeaders,
      },
      params,
    });
  }
}

export const handleCatchBlock = (error) => {};

export async function apiHandler({
  url,
  method,
  headers: reqHeaders,
  data: jsonData,
  params,
  authToken,
}) {
  try {
    const request = await createRequest({ reqHeaders, params, authToken });
    let result = [];
    switch (method) {
      case "POST":
        result = await request.post(url, jsonData);
        break;

      case "PUT":
        result = await request.put(url, jsonData);
        break;

      case "DELETE":
        result = await request.delete(url, { data: jsonData });
        break;

      default:
        result = await request.get(url);
    }
    const { data, headers, status } = result;
    return { data, headers, status };
  } catch (error) {
    handleCatchBlock(error);

    if (error.response) {
      const { data, headers, status } = error.response;
      return { data, headers, status };
    } else {
      return {
        data: { error_code: 500, error_message: "Error in getting data" },
      };
    }
  }
}
