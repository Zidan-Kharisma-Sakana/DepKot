import express from "express";
import "express-async-errors";
import {
  CurrentUserRouter,
  SignInRouter,
  SignOutRouter,
  SignUpRouter,
} from "./routes";
import { currentUser, errorHandler, NotFoundError } from "@zpyon/common";
import cookieSession from "cookie-session";
import { UpdateStoreRouter } from "./routes/store/update";
import { UpdateProductRouter } from "./routes/buyer/update";

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
app.use(currentUser);

app.use(SignInRouter);
app.use(SignUpRouter);
app.use(SignOutRouter);
app.use(CurrentUserRouter);
app.use(UpdateStoreRouter)
app.use(UpdateProductRouter)
app.all("*", async (req, res) => {
  console.log("bxhnjshnjasasas")
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
