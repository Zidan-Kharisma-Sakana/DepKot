import express from "express";
import "express-async-errors";
import {
  CurrentUserRouter,
  SignInRouter,
  SignOutRouter,
  SignUpRouter,
} from "./routes";
import { errorHandler } from "./middlewares/error_handler";
import { NotFoundError } from "./errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true); // karena pakai nginx

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    // secure: true,
  })
);

app.use(SignInRouter);
app.use(SignUpRouter);
app.use(SignOutRouter);
app.use(CurrentUserRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No JWT KEY");
  }
  await mongoose.connect("mongodb://auth-mongo-service:27017/auth", (err) => {
    if (!!err) {
      console.log(err.message);
    } else {
      console.log("Auth service connected to mongodb");
      app.listen(3000, () => {
        console.log("Auth service is up on port 3000 aa");
      });
    }
  });
};
start();
