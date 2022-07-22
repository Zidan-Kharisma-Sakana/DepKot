import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { NextPage } from "next";
import buildClient from "../api/build_client";
import Header from "../components/header";

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <div>
      <Header currentUser={pageProps.currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  const appprops = await App.getInitialProps(appContext);
  return {
    pageProps: {
      ...appprops,
      ...data,
    },
  };
};
export default MyApp;
