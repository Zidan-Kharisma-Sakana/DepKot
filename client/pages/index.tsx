import { NextPage } from "next";
import buildClient from "../api/build_client";
import { BasePageProps } from "../types/pages";

const LandingPage: NextPage<BasePageProps> = ({ currentUser }) => {
  console.log(currentUser)
  return currentUser ? (
    <h1>You are siggned in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");
  console.log(data)
  return data;
};

export default LandingPage;
