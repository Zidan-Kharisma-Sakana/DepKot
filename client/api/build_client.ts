import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";
const buildClient = ({ req }: NextPageContext) => {
  if (typeof window === "undefined") {
    // We are on the server sss

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req?.headers as AxiosRequestHeaders,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
